const API = process.env.NEXT_PUBLIC_API_URL;

export async function isBackendAvailable(): Promise<boolean> {
  if (!API) return false;

  try {
    const res = await fetch(`${API}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
