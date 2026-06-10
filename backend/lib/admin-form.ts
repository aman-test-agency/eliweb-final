import type { FieldErrors, FieldValues } from "react-hook-form";
import { toast } from "sonner";

function firstErrorMessage(errors: FieldErrors<FieldValues>): string | null {
  for (const value of Object.values(errors)) {
    if (!value) continue;
    if ("message" in value && value.message) {
      return String(value.message);
    }
    if (typeof value === "object") {
      const nested = firstErrorMessage(value as FieldErrors<FieldValues>);
      if (nested) return nested;
    }
  }
  return null;
}

export function toastFormErrors(errors: FieldErrors<FieldValues>) {
  const message = firstErrorMessage(errors) ?? "Please fill in all required fields";
  toast.error(message);
}
