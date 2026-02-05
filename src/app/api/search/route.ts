import { NextRequest } from "next/server";
import { getFeaturedVideos } from "@/lib/data";

const MAX_RESULTS = 50;

/**
 * GET /api/search?q=... – server-side search so the client never loads the full video list.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();
  if (!q || q.length === 0) {
    return Response.json([]);
  }
  const videos = getFeaturedVideos();
  const filtered = videos
    .filter((v) => v.title.toLowerCase().includes(q))
    .slice(0, MAX_RESULTS);
  return Response.json(filtered);
}
