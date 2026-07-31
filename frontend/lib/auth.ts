export function saveToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('token', token);
}
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
export function logout() {
  if (typeof window !== 'undefined') localStorage.removeItem('token');
}
