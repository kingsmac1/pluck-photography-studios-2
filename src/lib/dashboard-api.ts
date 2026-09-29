/**
 * All dashboard server logic lives in this single file, deliberately. The build's import-protection
 * plugin denies any client-reachable file from statically importing something under `**\/server/**`
 * — including transitively, even when the import is only used inside a createServerFn `.handler()`.
 * Since dashboard pages need to import the `createServerFn`s below directly, every secret-touching
 * helper (env, GitHub API, auth/session, content read/write, image upload) is inlined here instead
 * of split across `src/server/*.ts`. Nothing here runs on the client — createServerFn's own compiler
 * strips every `.handler()`/`.server()` body out of the client bundle, which is the real boundary.
 */
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------

let devVarsCache: Record<string, string> | null = null;

/** `.dev.vars`-only fallback for local dev, since `vite dev` doesn't auto-load it into process.env. */
function loadDevVars(): Record<string, string> {
  if (devVarsCache) return devVarsCache;
  devVarsCache = {};
  try {
    const raw = readFileSync(join(process.cwd(), ".dev.vars"), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      devVarsCache[key] = value;
    }
  } catch {
    // no .dev.vars present — expected in production
  }
  return devVarsCache;
}

function getEnv(key: string): string | undefined {
  return process.env[key] || loadDevVars()[key];
}

// ---------------------------------------------------------------------------
// GitHub Contents API
// ---------------------------------------------------------------------------

const REPO_OWNER = "kingsmac1";
const REPO_NAME = "pluck-photography-studios-2";
const BRANCH = "main";

function githubHeaders(): HeadersInit {
  const token = getEnv("GITHUB_TOKEN");
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the server");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "pluck-photography-dashboard",
  };
}

function contentsUrl(path: string): string {
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodedPath}`;
}

type GithubFile = { contentBase64: string; sha: string };

async function githubGetFile(path: string): Promise<GithubFile | null> {
  const res = await fetch(`${contentsUrl(path)}?ref=${BRANCH}`, { headers: githubHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFile(${path}) failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { content: string; sha: string; type: string };
  if (json.type !== "file") throw new Error(`GitHub path is not a file: ${path}`);
  return { contentBase64: json.content, sha: json.sha };
}

async function githubPutFile(
  path: string,
  contentBase64: string,
  message: string,
  sha?: string,
): Promise<void> {
  const res = await fetch(contentsUrl(path), {
    method: "PUT",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub putFile(${path}) failed: ${res.status} ${await res.text()}`);
}

async function githubDeleteFile(path: string, message: string, sha: string): Promise<void> {
  const res = await fetch(contentsUrl(path), {
    method: "DELETE",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
  if (!res.ok)
    throw new Error(`GitHub deleteFile(${path}) failed: ${res.status} ${await res.text()}`);
}

type GithubDirEntry = { name: string; sha: string; type: string; download_url: string | null };

async function githubListDir(path: string): Promise<GithubDirEntry[]> {
  const res = await fetch(`${contentsUrl(path)}?ref=${BRANCH}`, { headers: githubHeaders() });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub listDir(${path}) failed: ${res.status} ${await res.text()}`);
  const json: unknown = await res.json();
  if (!Array.isArray(json)) throw new Error(`GitHub path is not a directory: ${path}`);
  return json as GithubDirEntry[];
}

function encodeBase64(input: string | Uint8Array): string {
  return typeof input === "string"
    ? Buffer.from(input, "utf-8").toString("base64")
    : Buffer.from(input).toString("base64");
}

function decodeBase64Text(base64: string): string {
  return Buffer.from(base64, "base64").toString("utf-8");
}

// ---------------------------------------------------------------------------
// Auth / session
// ---------------------------------------------------------------------------

const SESSION_COOKIE = "__Host-dashboard-session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function readCookie(name: string): string | null {
  const header = getRequestHeader("cookie");
  if (!header) return null;
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq) === name) return part.slice(eq + 1);
  }
  return null;
}

function verifyPassword(input: string): boolean {
  const correct = getEnv("DASHBOARD_PASSWORD");
  if (!correct) return false;
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(correct).digest();
  return crypto.timingSafeEqual(a, b);
}

function issueSessionCookie(): void {
  const secret = getEnv("DASHBOARD_SESSION_SECRET");
  if (!secret) throw new Error("DASHBOARD_SESSION_SECRET is not configured on the server");
  const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `v1.${exp}`;
  const token = `${payload}.${sign(payload, secret)}`;
  setResponseHeader(
    "Set-Cookie",
    [
      `${SESSION_COOKIE}=${token}`,
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      "Path=/",
      `Max-Age=${SESSION_TTL_SECONDS}`,
    ].join("; "),
  );
}

function clearSessionCookie(): void {
  setResponseHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  );
}

function hasValidSession(): boolean {
  const secret = getEnv("DASHBOARD_SESSION_SECRET");
  if (!secret) return false;
  const token = readCookie(SESSION_COOKIE);
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [v, expStr, sig] = parts as [string, string, string];
  if (v !== "v1") return false;

  const expected = sign(`${v}.${expStr}`, secret);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf))
    return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  return true;
}

// Best-effort in-memory rate limiting — not durable across cold starts/instances, but raises the
// bar against naive credential stuffing on a single shared-password login.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_MAX_ATTEMPTS = 8;
const LOGIN_WINDOW_MS = 60_000;

function checkLoginRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }
  if (entry.count >= LOGIN_MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

/** The actual security boundary for every dashboard write — route redirects are UX only. */
const authMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  if (!hasValidSession()) throw new Error("Unauthorized");
  return next();
});

// ---------------------------------------------------------------------------
// Content (galleries/pricing/testimonials/hero/contact/pages JSON in the repo)
// ---------------------------------------------------------------------------

const socialSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });
const pageHeroSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  intro: z.string().min(1),
});

const contentSchemas = {
  galleries: z.array(
    z.object({
      slug: z.string().min(1),
      name: z.string().min(1),
      eyebrow: z.string().min(1),
      tagline: z.string().min(1),
      intro: z.string().min(1),
      body: z.array(z.string().min(1)).min(1),
      coverImage: z.string().min(1).nullable(),
      imageOrder: z.array(z.string().min(1)),
    }),
  ),
  pricing: z.object({
    tiers: z.array(
      z.object({
        name: z.string().min(1),
        price: z.string().min(1),
        features: z.array(z.string().min(1)).min(1),
        featured: z.boolean(),
      }),
    ),
    faqs: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })),
  }),
  testimonials: z.array(z.object({ quote: z.string().min(1), name: z.string().min(1) })),
  hero: z.array(
    z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      caption: z.string().min(1),
      image: z.string().min(1).nullable(),
    }),
  ),
  contact: z.object({
    phone: z.string().min(1),
    phoneHref: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1),
    socials: z.array(socialSchema),
  }),
  pages: z.object({
    about: z.object({
      hero: pageHeroSchema,
      story: z.object({
        eyebrow: z.string().min(1),
        heading: z.string().min(1),
        paragraphs: z.array(z.string().min(1)).min(1),
      }),
      values: z.array(z.object({ title: z.string().min(1), copy: z.string().min(1) })),
    }),
    services: z.object({
      hero: pageHeroSchema,
      steps: z.array(
        z.object({ step: z.string().min(1), title: z.string().min(1), copy: z.string().min(1) }),
      ),
    }),
  }),
} as const;

type ContentSectionKey = keyof typeof contentSchemas;
type ContentForSection<S extends ContentSectionKey> = z.infer<(typeof contentSchemas)[S]>;

const contentPaths: Record<ContentSectionKey, string> = {
  galleries: "src/content/galleries.json",
  pricing: "src/content/pricing.json",
  testimonials: "src/content/testimonials.json",
  hero: "src/content/hero.json",
  contact: "src/content/contact.json",
  pages: "src/content/pages.json",
};

async function readContent<S extends ContentSectionKey>(section: S): Promise<ContentForSection<S>> {
  const file = await githubGetFile(contentPaths[section]);
  if (!file) throw new Error(`Content file missing on GitHub for section "${section}"`);
  const parsed: unknown = JSON.parse(decodeBase64Text(file.contentBase64));
  return contentSchemas[section].parse(parsed) as ContentForSection<S>;
}

async function writeContent<S extends ContentSectionKey>(
  section: S,
  data: unknown,
  message: string,
): Promise<ContentForSection<S>> {
  const validated = contentSchemas[section].parse(data) as ContentForSection<S>;
  const existing = await githubGetFile(contentPaths[section]);
  const body = `${JSON.stringify(validated, null, 2)}\n`;
  await githubPutFile(contentPaths[section], encodeBase64(body), message, existing?.sha);
  return validated;
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB — keep web-sized exports, not raw camera files
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const SLUG_PATTERN = /^[a-z0-9-]+$/;

type ImageKind = "gallery" | "hero";

function assertSlug(slug: string): void {
  if (!SLUG_PATTERN.test(slug)) throw new Error(`Invalid gallery slug: ${slug}`);
}

function baseName(name: string): string {
  const stripped = name
    .replace(/\.[^./]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return stripped || "photo";
}

function imageDir(kind: ImageKind, slug: string | undefined): string {
  if (kind === "gallery") {
    if (!slug) throw new Error("A gallery slug is required for gallery images");
    assertSlug(slug);
    return `src/assets/galleries/${slug}`;
  }
  return "src/assets/hero";
}

function imagePath(kind: ImageKind, slug: string | undefined, filename: string): string {
  return `${imageDir(kind, slug)}/${filename}`;
}

async function listImages(
  kind: ImageKind,
  slug?: string,
): Promise<{ filename: string; url: string }[]> {
  const entries = await githubListDir(imageDir(kind, slug));
  return entries
    .filter((entry) => entry.type === "file" && entry.download_url)
    .map((entry) => ({ filename: entry.name, url: entry.download_url! }))
    .sort((a, b) => a.filename.localeCompare(b.filename));
}

async function uploadImage(params: {
  kind: ImageKind;
  slug: string | undefined;
  originalName: string;
  mimeType: string;
  dataBase64: string;
}): Promise<{ filename: string; path: string }> {
  const extension = MIME_EXTENSIONS[params.mimeType];
  if (!extension)
    throw new Error(`Unsupported image type: ${params.mimeType}. Use JPEG, PNG or WebP.`);

  const commaIndex = params.dataBase64.indexOf(",");
  const raw =
    params.dataBase64.startsWith("data:") && commaIndex !== -1
      ? params.dataBase64.slice(commaIndex + 1)
      : params.dataBase64;
  const bytes = Buffer.from(raw, "base64");

  if (bytes.length === 0) throw new Error("Empty image payload");
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error(
      `Image is too large (${Math.round(bytes.length / 1024 / 1024)}MB). Keep uploads under 8MB.`,
    );
  }

  const filename = `${Date.now()}-${baseName(params.originalName)}.${extension}`;
  const path = imagePath(params.kind, params.slug, filename);
  await githubPutFile(path, bytes.toString("base64"), `Dashboard: upload ${path}`);
  return { filename, path };
}

async function deleteImage(params: {
  kind: ImageKind;
  slug: string | undefined;
  filename: string;
}): Promise<void> {
  if (params.filename.includes("/") || params.filename.includes(".."))
    throw new Error("Invalid filename");
  const path = imagePath(params.kind, params.slug, params.filename);
  const file = await githubGetFile(path);
  if (!file) throw new Error(`Image not found: ${path}`);
  await githubDeleteFile(path, `Dashboard: delete ${path}`, file.sha);
}

// ---------------------------------------------------------------------------
// Server functions (the client-facing RPC surface)
// ---------------------------------------------------------------------------

function clientIp(): string {
  return getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for") ?? "unknown";
}

export const loginFn = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1) }))
  .handler(async ({ data }) => {
    if (!checkLoginRateLimit(clientIp()))
      throw new Error("Too many attempts. Try again in a minute.");
    if (!verifyPassword(data.password)) throw new Error("Incorrect access code");
    issueSessionCookie();
    return { ok: true as const };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  clearSessionCookie();
  return { ok: true as const };
});

export const sessionFn = createServerFn({ method: "GET" }).handler(async () => {
  return { authenticated: hasValidSession() };
});

const sectionSchema = z.enum(["galleries", "pricing", "testimonials", "hero", "contact", "pages"]);

export const getContentFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ section: sectionSchema }))
  .handler(async ({ data }) => {
    return readContent(data.section);
  });

export const saveContentFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ section: sectionSchema, payload: z.unknown(), message: z.string().min(1) }))
  .handler(async ({ data }) => {
    return writeContent(data.section, data.payload, data.message);
  });

export const listImagesFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ kind: z.enum(["gallery", "hero"]), slug: z.string().optional() }))
  .handler(async ({ data }) => {
    return listImages(data.kind, data.slug);
  });

export const uploadImageFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      kind: z.enum(["gallery", "hero"]),
      slug: z.string().optional(),
      originalName: z.string().min(1),
      mimeType: z.string().min(1),
      dataBase64: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    return uploadImage({ ...data, slug: data.slug });
  });

export const deleteImageFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      kind: z.enum(["gallery", "hero"]),
      slug: z.string().optional(),
      filename: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    await deleteImage({ ...data, slug: data.slug });
    return { ok: true as const };
  });
