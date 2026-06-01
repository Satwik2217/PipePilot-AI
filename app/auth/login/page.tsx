import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-surface">
          <p className="text-sm text-slate-600">Loading...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
