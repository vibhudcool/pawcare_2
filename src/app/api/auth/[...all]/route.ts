import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

let handlers: ReturnType<typeof toNextJsHandler> | null = null;

/**
 * Better Auth is created lazily so the MongoDB connection can be
 * established first (the adapter needs the live Db handle).
 */
async function getHandlers() {
  if (!handlers) {
    const auth = await getAuth();
    handlers = toNextJsHandler(auth);
  }
  return handlers;
}

export async function GET(request: Request) {
  const h = await getHandlers();
  return h.GET(request);
}

export async function POST(request: Request) {
  const h = await getHandlers();
  return h.POST(request);
}

export async function PATCH(request: Request) {
  const h = await getHandlers();
  return h.PATCH(request);
}

export async function PUT(request: Request) {
  const h = await getHandlers();
  return h.PUT(request);
}

export async function DELETE(request: Request) {
  const h = await getHandlers();
  return h.DELETE(request);
}
