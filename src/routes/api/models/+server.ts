import { json } from '@sveltejs/kit';
import { MODELS } from '$lib/server/config';
export function GET() { return json({plans:MODELS, note:'Model selection is server-side; every generation starts with paraphrase.'}); }
