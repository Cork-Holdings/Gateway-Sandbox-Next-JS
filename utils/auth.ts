export function signInPathForRole(role?: string | null) {
  return role === "admin" ? "/auth/signin/admin" : "/auth/signin/merchant";
}
