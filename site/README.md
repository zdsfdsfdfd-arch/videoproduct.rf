# Видеопродакшн.РФ — «От идеи до кадра»

Production build of the Claude Design prototype in `../project/Videoproduction Magazine.dc.html`:
an interactive magazine about video production — cover + 12 spreads, scroll-driven.

**Stack:** React 19 · TypeScript · Vite 6 · React Router 7 · CSS Modules. No animation library: the
prototype's requestAnimationFrame scroll engine is ported as `src/lib/scroll-engine.ts` (it writes
`--p` / `--e` / `--mx` / `--my` / `--sp` custom properties that the stylesheets read).

**Palette:** violet-black (`--ink #0A0714`, `--ink-2 #120C22` for the alternating spreads, accent
`#8C5CFF`). Off-white is used for text only — there are no light backgrounds.

## Pages

| Path | Page |
| --- | --- |
| `/` | the magazine — cover + 12 spreads |
| `/portfolio` | wall of all projects with live previews → case overlay |
| `/uslugi` | 27 services + the 7-stage process |
| `/tarify` | tariffs + FAQ |
| `/komanda` | team stage + backstage + clients |
| `/otzyvy` | four video testimonials |
| `/brif` | the branching brief + tariffs |
| `/kontakty` | consultation form, contacts, geography |

Routing is client-side (`BrowserRouter`); `public/_redirects` gives Netlify the SPA fallback,
Cloudflare Pages serves `index.html` for unknown paths automatically. Cross-page anchors
(`#sp-09` on a page without that section) resolve to the owning page via `src/lib/routes.ts`.

**Video:** every VK embed goes through `src/components/VkPlayer.tsx`, which mounts the iframe one to
two screens ahead of the viewport, keeps the still frame on top until the player has loaded plus a
short hold, and never unmounts a loaded player — no black frames while scrolling.

## Run

```bash
npm install
npm run dev        # http://localhost:5173  (forms post to /api/lead served by the dev middleware)
npm run build      # tsc -b && vite build → dist/
npm run preview
```

## Forms → Telegram

The brief (09) and the consultation form (12) POST JSON to `/api/lead`; the handler in
`functions/api/lead.ts` forwards it to a Telegram chat. Secrets stay server-side.

1. Copy `.env.example` → `.env`, fill `TELEGRAM_BOT_TOKEN` (from @BotFather) and `TELEGRAM_CHAT_ID`
   (add the bot to the chat, send a message, read the id from `https://api.telegram.org/bot<TOKEN>/getUpdates`).
2. Set the same two variables in the host's environment.

Hosting (both give `/api/lead` for free):

- **Cloudflare Pages** — build `npm run build`, output `dist`. `functions/api/lead.ts` is picked up automatically.
- **Netlify** — `netlify.toml` is included; the wrapper is `netlify/functions/lead.mts`.

Without the variables the endpoint answers 503 and the forms show «не удалось отправить — позвоните…»
with the real phone number, so nothing is silently lost.

## Images

`npm run images` regenerates `src/assets/images/` from the handoff bundle (`../project/assets/images`):
backstage PNGs → WebP at source size + a 720px variant (used via `srcset`), everything else copied.
Client logos remain PNG (alpha), `logo.svg` is copied without its embedded manifest.

## Structure

```
src/
  content/          all real copy, prices, team, reviews, FAQ, brief logic (nothing invented)
  assets/           typed asset map
  lib/              scroll engine, hooks, lead client
  components/chrome/  perforation, progress bar, custom cursor, top plates, side/bottom index
  components/sections/ Cover · Clients · Intro · Works · Process · Services · Backstage ·
                       Tariffs · Team · Reviews · Brief · Geography · Faq · Contact
  components/CaseOverlay.tsx  cinematic case page (flyer → full screen → details)
functions/api/lead.ts   Telegram handler (Web-standard Request/Response)
```

## Known content gaps (from the source site, not invented)

- Telegram account link and the privacy-policy link are not published — both are rendered as marked placeholders in 12 / Контакт (`src/content/index.ts` → `contacts`).
- No still frame was supplied for the university film (work 08) — its VK preview loads directly.
- The original portfolio page («Портфолио 100+») was not reachable from the build environment. Besides the nine
  confirmed cases, the export contained nine more VK videos of the studio without titles or clients; they are
  listed in `src/content/index.ts` → `archiveWorks` with titles described from the frame, marked «архив» on
  `/portfolio` and in the case overlay. Replace those titles with the studio's own wording when available.
- Case pages have no text description or results; the note says so.
