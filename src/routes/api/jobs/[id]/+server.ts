import { json } from '@sveltejs/kit';
import { readJwt } from '$lib/server/auth';
export async function GET({params,cookies,platform}) { const user=await readJwt(cookies,platform?.env?.JWT_SECRET||''); if(!user) return json({error:'Unauthorized'},{status:401}); const row=await platform?.env?.DB?.prepare('SELECT id,kind,plan,model,status,provider_request_id,error_code,created_at FROM generation_jobs WHERE id = ? AND user_id = ?').bind(params.id,user.sub).first(); return row?json(row):json({error:'Not found'},{status:404}); }
