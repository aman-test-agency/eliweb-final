const API = process.env.NEXT_PUBLIC_API_URL;

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("admin-token");
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  if (!API) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not configured", 500);
  }

  const headers = new Headers(options?.headers);
  if (options?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string }).error ?? "Request failed",
      res.status,
    );
  }

  return data as T;
}

export async function uploadImage(file: File): Promise<string> {
  if (!API) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not configured", 500);
  }

  const form = new FormData();
  form.append("file", file);

  const headers = new Headers();
  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API}/api/upload`, {
    method: "POST",
    body: form,
    credentials: "include",
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string }).error ?? "Upload failed",
      res.status,
    );
  }

  return (data as { url: string }).url;
}
