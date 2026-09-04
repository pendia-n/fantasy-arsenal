# Cloudflare Architecture

Planned bindings are D1 for users/worlds/assets/jobs/ledger, R2 for media, Queue for generation jobs, and Workers with Assets for the SvelteKit shell. Durable Objects may coordinate a per-world generation lock when Queue concurrency alone is insufficient.

Required API surface: signup, login, logout, session, password recovery/reset, worlds, assets, paraphrase preview, generation job creation, job status, and asset download. Auth uses Web Crypto PBKDF2 with a per-user salt, standard base64url HS256 JWT, HttpOnly Secure SameSite cookie, and a JWT secret generated with `openssl rand -hex 32`. Never store payment card numbers; Stripe Checkout/Customer identifiers are the boundary.

Operational requirements: idempotency keys for generation and billing, provider request IDs, job state transitions, cost estimates before submission, atomic ledger reservations, retry limits, dead-letter visibility, R2 cleanup, rate limits, audit logs, and privacy-safe structured logs.
