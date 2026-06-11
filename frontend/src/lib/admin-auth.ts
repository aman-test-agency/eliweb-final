const TOKEN_KEY = "admin-token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function hasAdminToken(): boolean {
  return Boolean(getAdminToken());
}
