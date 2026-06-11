const API = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet<T>(path: string): Promise<T | null> {
  if (!API) {
    console.error("[API] NEXT_PUBLIC_API_URL is not configured");
    return null;
  }

  try {
    const res = await fetch(`${API}${path}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`[API] GET ${path} failed:`, err);
    return null;
  }
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<T | null> {
  if (!API) {
    console.error("[API] NEXT_PUBLIC_API_URL is not configured");
    return null;
  }

  try {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`[API] POST ${path} failed:`, err);
    return null;
  }
}

export { API };
