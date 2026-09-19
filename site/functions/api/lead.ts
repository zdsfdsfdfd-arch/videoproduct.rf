/**
 * /api/lead — forwards a form submission to the studio's Telegram chat.
 *
 * Written against the Web-standard Request/Response so the same handler runs as a
 * Cloudflare Pages Function (this file's location is the route), inside the Vite dev server
 * (see vite.config.ts) and behind the Netlify wrapper in netlify/functions/lead.mts.
 *
 * Secrets never reach the browser: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID live in the host's env.
 */

export interface LeadEnv {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

interface LeadBody {
  kind?: unknown;
  contact?: unknown;
  name?: unknown;
  answers?: unknown;
  result?: unknown;
  page?: unknown;
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max) : '');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function handleLead(request: Request, env: LeadEnv): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'method' });
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return json(503, { error: 'telegram is not configured' });

  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return json(400, { error: 'json' });
  }

  const kind = body.kind === 'brief' ? 'brief' : body.kind === 'consult' ? 'consult' : null;
  const contact = clean(body.contact, 120);
  if (!kind || contact.length < 5) return json(400, { error: 'contact' });

  const name = clean(body.name, 80);
  const answers = Array.isArray(body.answers) ? body.answers.map((a) => clean(a, 160)).filter(Boolean).slice(0, 6) : [];
  const result = clean(body.result, 120);
  const page = clean(body.page, 300);

  const lines = [
    kind === 'brief' ? '<b>🎬 Новый бриф с сайта</b>' : '<b>📞 Заявка на бесплатную консультацию</b>',
    '',
    name ? `<b>Имя:</b> ${esc(name)}` : '',
    `<b>Контакт:</b> ${esc(contact)}`,
    ...answers.map((a, i) => `${String(i + 1).padStart(2, '0')} · ${esc(a)}`),
    result ? `\n<b>Ориентир:</b> ${esc(result)}` : '',
    page ? `\n<i>${esc(page)}</i>` : '',
  ].filter((l) => l !== '');

  const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!tg.ok) {
    console.error('telegram error', tg.status, await tg.text().catch(() => ''));
    return json(502, { error: 'telegram' });
  }
  return json(200, { ok: true });
}

/** Cloudflare Pages Functions entry — the file path is the route (/api/lead). */
export const onRequestPost = ({ request, env }: { request: Request; env: LeadEnv }) => handleLead(request, env);
export const onRequest = ({ request, env }: { request: Request; env: LeadEnv }) => handleLead(request, env);
