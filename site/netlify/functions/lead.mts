// Netlify Functions v2 wrapper around the shared handler. netlify.toml maps /api/lead here.
import { handleLead } from '../../functions/api/lead';

export default (request: Request) =>
  handleLead(request, {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  });

export const config = { path: '/api/lead' };
