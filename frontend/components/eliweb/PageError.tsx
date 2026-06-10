"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PageError({
  reset,
  message = "Something went wrong loading this page.",
}: {
  reset?: () => void;
  message?: string;
}) {
  return (
    <div className="section-shell flex min-h-[50vh] flex-col items-center justify-center py-32 text-center">
      <h2 className="font-heading text-2xl font-bold">Unable to load content</h2>
      <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
      <div className="mt-6 flex gap-3">
        {reset ? (
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        ) : null}
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
