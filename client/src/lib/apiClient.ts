const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:4000/api/v1';

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fields?: Record<string, string[]>,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

type UnknownRecord = Record<string, unknown>;

function readErrorPayload(json: UnknownRecord | undefined): {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
  requestId?: string;
} {
  const err = json?.error as UnknownRecord | undefined;
  const code = typeof err?.code === 'string' ? err.code : 'REQUEST_FAILED';
  const message = typeof err?.message === 'string' ? err.message : 'Request failed';
  const requestId = typeof err?.requestId === 'string' ? err.requestId : undefined;
  const fields = err?.fields as Record<string, string[]> | undefined;
  return { code, message, fields, requestId };
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean; query?: Record<string, string | undefined> } = {}
): Promise<T> {
  const { skipAuth, query, ...init } = options;
  let url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  if (query) {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== '') p.set(k, v);
    }
    const qs = p.toString();
    if (qs) url += `?${qs}`;
  }

  const headers = new Headers(init.headers);
  if (init.body !== undefined && init.body !== null && !headers.has('Content-Type')) {
    if (!(init.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
  }
  if (!skipAuth) {
    const t = getToken();
    if (t) headers.set('Authorization', `Bearer ${t}`);
  }

  const res = await fetch(url, { ...init, headers });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  let json: UnknownRecord | undefined;
  try {
    json = text ? (JSON.parse(text) as UnknownRecord) : undefined;
  } catch {
    if (!res.ok) {
      const { code, message, fields, requestId } = readErrorPayload(undefined);
      throw new ApiRequestError(res.status, code, message, fields, requestId);
    }
    throw new ApiRequestError(res.status, 'INVALID_RESPONSE', 'Unable to parse server response');
  }

  if (!res.ok) {
    const { code, message, fields, requestId } = readErrorPayload(json);
    throw new ApiRequestError(res.status, code, message, fields, requestId);
  }

  if (json && typeof json === 'object' && 'data' in json) {
    return (json as { data: T }).data;
  }

  if (json && typeof json === 'object' && (json as { success?: boolean }).success === true) {
    return undefined as T;
  }

  return json as T;
}

export async function apiFetchOptional<T>(path: string, options?: Parameters<typeof apiFetch<T>>[1]): Promise<T | undefined> {
  try {
    return await apiFetch<T>(path, options);
  } catch (e) {
    if (e instanceof ApiRequestError && e.status === 404) return undefined;
    throw e;
  }
}
