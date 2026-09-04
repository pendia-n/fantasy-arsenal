// @ts-nocheck
import { json } from '@sveltejs/kit';
import { verifyPassword, signJwt, setSession } from '$lib/server/auth';
export async function POST({request,cookies,platform}) { const body=await request.json().catch(()=>({})); const username=String(body.username||'').trim().toLowerCase(); const password=String(body.password||''); const db=platform?.env?.DB; if(!db) return json({error:'D1 is not configured yet.',code:'DB_NOT_CONFIGURED'},{status:503}); const user=await db.prepare('SELECT id, username, password_hash, plan FROM users WHERE username = ?').bind(username).first<{id:string;username:string;password_hash:string;plan:string}>(); if(!user || !(await verifyPassword(password,user.password_hash))) return json({error:'Invalid username or password.'},{status:401}); setSession(cookies,await signJwt({sub:user.id,username:user.username,plan:user.plan},platform.env?.JWT_SECRET||'')); return json({id:user.id,username:user.username,plan:user.plan}); }
// @ts-nocheck
