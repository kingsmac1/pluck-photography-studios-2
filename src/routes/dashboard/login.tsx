import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginFn, sessionFn } from "@/lib/dashboard-api";

export const Route = createFileRoute("/dashboard/login")({
  beforeLoad: async () => {
    const session = await sessionFn();
    if (session.authenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: DashboardLoginPage,
});

function DashboardLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginFn({ data: { password } });
      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg bg-surface p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <p className="eyebrow">Pluck Photography</p>
            <h1 className="display text-xl">Dashboard</h1>
          </div>
        </div>

        <label className="mt-8 block">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Access code
          </span>
          <Input
            autoFocus
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3"
          />
        </label>

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

        <Button type="submit" disabled={submitting} className="mt-8 w-full">
          {submitting ? "Checking…" : "Enter"}
        </Button>
      </form>
    </div>
  );
}
