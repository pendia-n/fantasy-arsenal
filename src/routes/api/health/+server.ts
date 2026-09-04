import { json } from '@sveltejs/kit';
export function GET() { return json({ok:true, service:'fantasy-arsenal', version:'v2', timestamp:new Date().toISOString()}); }
