# StreamHub – Adult Affiliate Streaming (Placeholder)

Next.js 14 App Router project for an adult affiliate streaming site. **No real adult content** — placeholder thumbnails (Picsum) and titles only.

## Requirements

- Node.js 18+
- npm

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Affiliate links (real “Watch Full Video” URL)

The “Watch Full Video” button uses a base URL + video slug as `subid`. To point it at your partner:

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_AFFILIATE_BASE_URL` to your partner’s base URL (no trailing slash), e.g. `https://partner.com/go`.
3. Restart the dev server (`npm run dev`).

Optional: set `NEXT_PUBLIC_AFFILIATE_CAMPAIGN` and/or `NEXT_PUBLIC_AFFILIATE_SOURCE` to add `campaign` and `source` query params to every affiliate link. `.env.local` is gitignored; never commit real affiliate URLs.

## SEO (sitemap, robots, canonical)

- **Sitemap:** `/sitemap.xml` is generated dynamically and includes the homepage, paginated home pages (`/?page=2`, …), `/categories`, each `/category/[slug]`, each `/video/[slug]`, and legal pages.
- **Robots:** `/robots.txt` allows all crawlers (`allow: /`) and points to the sitemap.
- **Canonical URLs:** Each page sets `alternates.canonical` to its absolute URL. Set `NEXT_PUBLIC_SITE_URL` in `.env.local` (e.g. `https://yoursite.com`) so canonicals and the sitemap use your real domain; if unset, `https://example.com` is used.

## Analytics

Basic analytics (page views and “Watch Full Video” clicks) are supported. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to your Google Analytics 4 measurement ID (e.g. `G-XXXXXXXXXX`) to enable. The GA script loads globally after interactive; page views are sent on route change, and CTA clicks send a `watch_full_video` event with `video_slug`. If the env var is unset, no script is loaded and tracking is a no-op. This aligns with the site’s Privacy Policy (cookies and analytics disclosed).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home – featured/trending placeholder videos |
| `/categories` | Categories – grid of category cards |
| `/categories/[slug]` | Category detail – videos in that category |
| `/video/[slug]` | Video embed page – placeholder iframe + related videos |

## Features

- **SEO**: Per-page metadata, semantic HTML, title template
- **Responsive**: Tailwind breakpoints (sm, lg), mobile-first layout
- **Placeholders**: Thumbnails from Picsum; titles and data in `src/lib/data.ts`
- **Video embed**: Placeholder iframe on `/video/[slug]` — replace `src` with your affiliate embed URL when integrating

## Folder structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, Header/Footer
│   ├── page.tsx            # Home
│   ├── globals.css
│   ├── categories/
│   │   ├── page.tsx        # Categories list
│   │   └── [slug]/page.tsx # Category detail
│   └── video/
│       └── [slug]/page.tsx # Video embed page
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── VideoCard.tsx
│   └── CategoryCard.tsx
└── lib/
    └── data.ts             # Placeholder videos & categories
```

## Replacing the video embed

In `src/app/video/[slug]/page.tsx`, change the iframe `src` to your affiliate embed URL (e.g. from `data.ts` or an API). The current placeholder uses a neutral YouTube embed for development only.

## Commands

- `npm run dev` – dev server
- `npm run build` – production build
- `npm run start` – run production build
- `npm run lint` – ESLint

## Troubleshooting: PowerShell "running scripts is disabled"

If you see **"npm.ps1 cannot be loaded because running scripts is disabled on this system"**:

- **Use Command Prompt (cmd)** instead of PowerShell: open **cmd**, then `cd c:\Users\OLAITAN\Documents\AdultStars` and run `npm install` and `npm run dev`.
- **Or in PowerShell** run `npm.cmd install` and `npm.cmd run dev` (the `.cmd` launcher is not affected by script policy).
- **Or allow scripts** for your user: in PowerShell (Run as Administrator), run:  
  `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Troubleshooting: SWC binary failed on Windows

If you see **"Failed to load SWC binary for win32/x64"** or **"is not a valid Win32 application"**:

1. **Babel fallback** – This project includes a `.babelrc` so Next.js uses Babel instead of SWC. Dev and build should work; only compilation may be a bit slower.
2. **Fix the SWC binary (optional)** – Delete `node_modules` and `package-lock.json`, then run `npm install` again. On Windows, install [Microsoft Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist) if needed.
