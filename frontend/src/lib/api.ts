const API = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet<T>(path: string): Promise<T> {
  if (!API) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const res = await fetch(`${API}${path}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return res.json() as Promise<T>;
}

export { API };
