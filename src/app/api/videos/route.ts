import { NextRequest } from "next/server";
import { getVideosPage } from "@/lib/data";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;

/**
 * GET /api/videos?page=1&limit=12 – paginated videos for infinite scroll.
 * Uses cached video list; no full parse per request.
 */
export async function GET(request: NextRequest) {
  const page = Math.max(1, Number.parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1);
  const rawLimit = Number.parseInt(request.nextUrl.searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
  const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit));
  const { videos, hasMore, total } = getVideosPage(page, limit);
  return Response.json({ videos, hasMore, total });
}
