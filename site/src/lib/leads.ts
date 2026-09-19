/** Client side of the lead pipeline: POST → /api/lead → Telegram (see functions/api/lead.ts). */

export interface Lead {
  kind: 'brief' | 'consult';
  contact: string;
  name?: string;
  answers?: string[];
  result?: string;
}

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '/api/lead';

export async function sendLead(lead: Lead): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lead, page: location.href, sentAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`lead failed: ${res.status}`);
}
