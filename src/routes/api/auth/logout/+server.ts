import { json } from '@sveltejs/kit';
export function POST({cookies}) { cookies.delete('fantasy_session',{path:'/'}); return json({ok:true}); }
