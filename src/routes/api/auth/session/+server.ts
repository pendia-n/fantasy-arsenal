import { json } from '@sveltejs/kit';
import { readJwt } from '$lib/server/auth';
export async function GET({cookies,platform}) { const user=await readJwt(cookies,platform?.env?.JWT_SECRET||''); return user ? json({authenticated:true,user}) : json({authenticated:false},{status:401}); }
