declare global { namespace App { interface Platform { env?: { DB?: D1Database; R2?: R2Bucket; GENERATION_QUEUE?: Queue; OPENROUTER_API_KEY?: string; JWT_SECRET?: string; }; } } }
export {};
