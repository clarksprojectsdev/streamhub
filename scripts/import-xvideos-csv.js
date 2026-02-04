/**
 * Import XVideos "Last 7 days" (or full) CSV into videos.json for StreamHub.
 *
 * CSV is semicolon-delimited. Expected columns (XVideos): video URL, thumb URL, tags, duration, title, embed code.
 * Your sample had: URL ; title (so we support 2+ columns and map by position).
 *
 * Usage:
 *   1. Download "Last 7 days database export" from https://info.xvideos.net/db
 *   2. Extract the .zip/.gz to get the .csv file
 *   3. node scripts/import-xvideos-csv.js path/to/extracted.csv
 *
 * Output: src/data/videos.json (first 20_000 rows by default).
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const CSV_PATH = process.argv[2] || path.join(__dirname, "../xvideos-last7days.csv");
const OUT_PATH = path.join(__dirname, "../src/data/videos.json");
const MAX_ROWS = 20_000;

// Column indices (0-based). Actual XVideos export order: URL, title, duration, thumb URL, embed code, tags.
const COL = { URL: 0, TITLE: 1, DURATION: 2, THUMB: 3, EMBED: 4, TAGS: 5 };

function extractVideoId(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.match(/video\.([a-z0-9]+)/i);
  return m ? m[1] : null;
}

function parseLine(line) {
  const parts = line.split(";").map((p) => p.trim());
  if (parts.length < 2) return null;
  const url = parts[COL.URL];
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  const title = parts.length > 1 ? (parts[COL.TITLE] || "").trim() : "";
  const duration = parts.length > 2 ? (parts[COL.DURATION] || "") : "";
  const thumb = parts.length > 3 ? (parts[COL.THUMB] || "") : "";
  let embedUrl = parts.length > 4 ? (parts[COL.EMBED] || "") : "";
  if (embedUrl.startsWith("<")) {
    const srcMatch = embedUrl.match(/src=["']([^"']+)["']/);
    if (srcMatch) embedUrl = srcMatch[1];
  }
  if (!embedUrl) embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;
  const tags = parts.length > 5 ? (parts[COL.TAGS] || "") : "";
  const category = tags ? tags.split(/[,|]/)[0].trim() || "Uncategorized" : "Uncategorized";

  return {
    id: videoId,
    slug: videoId,
    title: title || "Untitled",
    description: title || "",
    thumbnail: thumb,
    duration: duration || "0:00",
    views: "0",
    category,
    embedUrl,
    affiliateUrl: url,
  };
}

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error("CSV not found:", CSV_PATH);
    console.error("Usage: node scripts/import-xvideos-csv.js <path-to-extracted.csv>");
    process.exit(1);
  }

  const outDir = path.dirname(OUT_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  const videos = [];
  let first = true;

  for await (const line of rl) {
    if (!line.trim()) continue;
    if (first && line.toLowerCase().includes("http") === false && line.includes(";")) {
      first = false;
      if (line.toLowerCase().includes("url") || line.toLowerCase().includes("title")) continue;
    }
    const row = parseLine(line);
    if (row) videos.push(row);
    if (videos.length >= MAX_ROWS) break;
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(videos, null, 0), "utf8");
  console.log("Wrote", videos.length, "videos to", OUT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
