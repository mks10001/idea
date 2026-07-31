export async function apiFetch(path: string, opts: any = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const url = base + path;
  const headers = opts.headers || {};
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}
