# Worker secrets

Run these from `fantasy-arsenal`. The JWT value below was generated with `openssl rand -hex 32` for this deployment; do not commit it.

```sh
npx wrangler secret put JWT_SECRET
# value: 25da6bd705cab84fe46069362893aa8ae1714df4aa3b52a12296e58dc380907b
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

Required now: `JWT_SECRET`, `OPENROUTER_API_KEY`.

Required when billing is enabled: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, plus Stripe price IDs as non-secret Wrangler vars or deployment configuration.

The app never stores raw card numbers. Stripe Checkout/Customer IDs and webhook signatures are the payment boundary.
