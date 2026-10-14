const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1")
  .replace(/\/$/, "");

const DEFAULT_TIMEOUT_MS = 30_000;

export interface ApiRequestInit extends RequestInit {
  timeoutMs?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiTimeoutError extends Error {
  constructor(public readonly timeoutMs: number) {
    super(`AMGR API request timed out after ${timeoutMs} ms`);
    this.name = "ApiTimeoutError";
  }
}

function getErrorMessage(body: unknown): string | undefined {
  if (typeof body === "string") return body || undefined;
  if (typeof body !== "object" || body === null) return undefined;

  const record = body as Record<string, unknown>;
  for (const key of ["detail", "message", "error"]) {
    const value = record[key];
    if (typeof value === "string") return value;
    if (value !== undefined) return JSON.stringify(value);
  }
  return undefined;
}

async function readResponseBody(
  response: Response,
): Promise<{ isJson: boolean; value: unknown }> {
  const text = await response.text();
  if (!text) return { isJson: false, value: undefined };

  try {
    return { isJson: true, value: JSON.parse(text) as unknown };
  } catch {
    return { isJson: false, value: text };
  }
}

export async function apiFetch<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal: callerSignal,
    headers: requestHeaders,
    ...requestInit
  } = init ?? {};
  const controller = new AbortController();
  let timedOut = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const abortFromCaller = () => controller.abort(callerSignal?.reason);
  if (callerSignal?.aborted) {
    abortFromCaller();
  } else {
    callerSignal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
  }

  const headers = new Headers(requestHeaders);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  try {
    const response = await fetch(`${apiBaseUrl}/${path.replace(/^\//, "")}`, {
      ...requestInit,
      headers,
      signal: controller.signal,
    });
    const { isJson, value: body } = await readResponseBody(response);

    if (!response.ok) {
      const detail = getErrorMessage(body);
      const statusLabel = `${response.status}${response.statusText ? ` ${response.statusText}` : ""}`;
      throw new ApiError(
        `AMGR API request failed (${statusLabel})${detail ? `: ${detail}` : ""}`,
        response.status,
        response.statusText,
        body,
      );
    }

    if (!isJson) {
      throw new ApiError(
        `AMGR API returned a non-JSON response (${response.status}${response.statusText ? ` ${response.statusText}` : ""})`,
        response.status,
        response.statusText,
        body,
      );
    }

    return body as T;
  } catch (error) {
    if (timedOut) throw new ApiTimeoutError(timeoutMs);
    throw error;
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    callerSignal?.removeEventListener("abort", abortFromCaller);
  }
}
