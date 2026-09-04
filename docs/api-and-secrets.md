# API and secrets

## API

- `POST /api/auth/signup` creates a free account.
- `POST /api/auth/login` creates the secure session cookie.
- `GET /api/auth/session` checks the session.
- `POST /api/auth/logout` removes the session.
- `GET|POST /api/worlds` lists or creates owned worlds.
- `POST /api/paraphrase` previews the first clarity pass.
- `POST /api/generate` accepts `kind: story|character|image|song|video`; all requests paraphrase first.

`POST /api/generate` accepts an `Idempotency-Key`. Text is executed when OpenRouter is configured. Media requests return a truthful `rewritten_ready` state until the provider adapter and Queue consumer are installed.

## Secrets

Already installed: `JWT_SECRET`, generated with `openssl rand -hex 32`.

You must install manually:

```sh
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```
