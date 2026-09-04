// @ts-nocheck
import { json } from '@sveltejs/kit';
import { readJwt } from '$lib/server/auth';
export async function GET({cookies,platform}) { const user=await readJwt(cookies,platform?.env?.JWT_SECRET||''); if(!user) return json({error:'Unauthorized'},{status:401}); const rows=await platform?.env?.DB?.prepare('SELECT id,title,genre,created_at FROM worlds WHERE user_id = ? ORDER BY created_at DESC').bind(user.sub).all(); return json({worlds:rows?.results||[]}); }
export async function POST({request,cookies,platform}) { const user=await readJwt(cookies,platform?.env?.JWT_SECRET||''); if(!user) return json({error:'Unauthorized'},{status:401}); const body=await request.json().catch(()=>({})); const title=String(body.title||'').trim(); const genre=String(body.genre||'').trim(); if(!title||!genre) return json({error:'title and genre are required'},{status:400}); const id=crypto.randomUUID(); await platform?.env?.DB?.prepare('INSERT INTO worlds (id,user_id,title,genre) VALUES (?, ?, ?, ?)').bind(id,user.sub,title,genre).run(); return json({id,title,genre},{status:201}); }
// @ts-nocheck
