import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteImageFn, listImagesFn, uploadImageFn } from "@/lib/dashboard-api";

const MAX_DIMENSION = 2500; // long edge, px — matches what the initial gallery swap was compressed to
const OUTPUT_QUALITY = 0.82;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error as Error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Resizes (never upscales) to a max 2500px edge and re-encodes at ~82% quality, entirely in the
 * browser via Canvas — no server-side image library needed. Falls back to the original file if
 * the browser can't do it (very old browser, unsupported format); the server's 8MB cap still
 * applies either way as a backstop.
 */
async function compressImage(file: File): Promise<{ blob: Blob; mimeType: string }> {
  const outputType =
    file.type === "image/png"
      ? "image/png"
      : file.type === "image/webp"
        ? "image/webp"
        : "image/jpeg";

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, outputType === "image/png" ? undefined : OUTPUT_QUALITY),
    );
    if (!blob) throw new Error("Canvas encoding failed");

    // Compression can occasionally lose to a well-optimized source file — keep whichever is smaller.
    return blob.size < file.size
      ? { blob, mimeType: outputType }
      : { blob: file, mimeType: file.type };
  } catch {
    return { blob: file, mimeType: file.type };
  }
}

export function imagesQueryKey(kind: "gallery" | "hero", slug?: string) {
  return ["dashboard-images", kind, slug ?? null] as const;
}

/** Live image listing + upload/delete for one gallery folder (or the hero slide folder). */
export function useGalleryImages(kind: "gallery" | "hero", slug?: string) {
  const queryClient = useQueryClient();
  const key = imagesQueryKey(kind, slug);

  const query = useQuery({
    queryKey: key,
    queryFn: () => listImagesFn({ data: { kind, slug } }),
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const { blob, mimeType } = await compressImage(file);
      const dataBase64 = await blobToDataUrl(blob);
      return uploadImageFn({
        data: { kind, slug, originalName: file.name, mimeType, dataBase64 },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: (filename: string) => deleteImageFn({ data: { kind, slug, filename } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  return {
    images: query.data ?? [],
    isLoading: query.isLoading,
    upload: upload.mutateAsync,
    uploading: upload.isPending,
    remove: remove.mutateAsync,
    removing: remove.isPending,
  };
}
