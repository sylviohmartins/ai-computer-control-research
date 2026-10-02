export interface ResponseMeta {
  request_id: string;
}

export interface SuccessEnvelope<T> {
  ok: true;
  data: T;
  meta: ResponseMeta;
}

export interface ErrorEnvelope {
  ok: false;
  error: {
    code: string;
    message: string;
  };
  meta: ResponseMeta;
}

export function requestId(): string {
  return crypto.randomUUID();
}
export function jsonResponse(
  body: SuccessEnvelope<unknown> | ErrorEnvelope,
  status = 200,
): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

export function success<T>(data: T, status = 200): Response {
  return jsonResponse(
    {
      ok: true,
      data,
      meta: { request_id: requestId() },
    },
    status,
  );
}

export function failure(
  code: string,
  message: string,
  status: number,
): Response {
  return jsonResponse(
    {
      ok: false,
      error: { code, message },
      meta: { request_id: requestId() },
    },
    status,
  );
}
