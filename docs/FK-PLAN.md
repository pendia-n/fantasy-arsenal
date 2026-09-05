# Fable Keep V2 Execution Plan

Status: Plan only. Do not scaffold, edit application code, deploy, migrate a database, or charge a payment method until this plan is approved.

## 1. Product Boundary

Fable Keep V2 is a new World-first application. The existing `mattalk-agentic` application remains untouched and continues to be the V1 reference/runtime.

The V2 user model is:

```text
World -> Canon / Characters / Scenes / Assets
      -> text / image / music / video generations
      -> durable accepted assets and downloadable outputs
```

The user should experience one simple creation flow and should not need to select providers, model names, OpenRouter, queues, credits, or fallback logic.

## 2. Project Creation

Create the new project only after approval:

```sh
cd ~/mvp/fable-maker
pnpm create cloudflare@latest fable-keep-app --framework=svelte
```

The new application must have its own Worker, D1 database, R2 storage namespace/bucket strategy, secrets, and deployment configuration. Do not reuse V1 tables or production bindings during initial development.

Use the existing FM logo as the Fable Keep logo. Source candidate:

```text
~/mvp/fable-maker/mattalk-agentic/fm.svg
```

Copy only the required logo asset into the new project. Do not copy the V1 application architecture into V2.

## 3. Source Documentation

Create a root `APP.md` and a `docs/` directory in `fable-keep-app`.

`APP.md` must explain:

- What Fable Keep is.
- Why V2 was created.
- The user problem it solves.
- How World persistence reduces creative stress.
- What makes Fable Keep different from a one-off AI media generator.
- The public API and billing boundary.

The `docs/` directory must contain consolidated V2 decisions, not an unedited dump of conflicting historical notes:

```text
docs/
├── v2-product.md
├── v2-world-and-assets.md
├── v2-monetization.md
├── v2-billing.md
├── v2-tier-functions.md
├── v2-api-contract.md
├── v2-auth-security.md
├── v2-rendering.md
├── v2-observability.md
└── source-register.md
```

Cross-reference and reconcile:

- `~/mvp/fable-maker/fm.md`
- `~/mvp/fable-maker/fm*.md`
- `~/mvp/fable-maker/two/*.md`
- The referenced FM strategy conversation.

The source register must distinguish current V2 decisions from superseded V1 concepts, including old Story-centered tables, credits, Model A/B, FIFO cleanup, and MCP behavior.

## 4. Plan and Access Model

### Free World Trial

```text
1 World
2 image generations per week
10 text generations per week
No isolated generation
No Top-up
No download
Assets viewable for 7 days
After 7 days, assets remain metadata-visible but media is locked
Card verification required before trial generation
```

Free must be presented as a limited World trial, not as permanently free storage.

### Creator

```text
$8.99/month
Non-refundable subscription subject to applicable law and payment rules
1 included World
Additional World: $5 under the same ownership and retention rules
Permanent asset visibility while the account is entitled to access
Download enabled
Top-up enabled
11% FM service fee on billable generation usage
```

Creator model routing:

```text
Text: meta/muse-spark-1.3
Character text: deepseek/deepseek-v4-flash-0731
Image: meta/muse-image
Music: google/lyria-3-clip-preview
Video primary: alibaba/wan-3.0
Video fallback: minimax/hailuo-3-max
```

The fallback may run only under a defined technical failure policy. A user-requested subjective retry is a new billable generation.

## 5. Model Verification Gate

Before implementation, verify every selected model through the current OpenRouter model/API metadata:

- Exact model slug.
- Supported endpoint and modality.
- Input reference support.
- Output format.
- Maximum video duration and clip behavior.
- Current pricing fields.
- Provider availability.
- Whether fallback is permitted by the provider and by FM economics.

Do not hard-code a model name into the UI. Use capability routing internally:

```text
text_world
text_character
image_world
music_world
video_world
```

If `alibaba/wan-3.0` or `minimax/hailuo-3-max` is unavailable under the exact requested API contract, stop before implementation and present the verified alternative. Do not silently substitute a model.

## 6. Billing Rules

The Creator subscription and the generation wallet are separate:

```text
Creator subscription = access, retention, downloads, Creator models
Top-up wallet = funds for Creator generation usage
```

For a Provider actual cost of `$1.00`:

```text
Provider cost: $1.00
FM service fee: $0.11
User charge: $1.11
```

The system must use:

```text
estimate maximum -> reserve -> execute -> validate -> settle actual cost
```

Technical failure or no usable artifact:

```text
release reservation
do not settle user generation charge
```

User dislike of a valid output is not an automatic refund. It creates a new generation request.

Insufficient balance:

```text
do not call the provider
generation.status = needs_funds
return required top-up amount
```

Never allow a negative wallet balance.

## 7. Stripe and Card Data Boundary

Do not store credit-card numbers in D1. Do not store PAN, CVV, expiration data, or magnetic-stripe data in FM systems.

Use Stripe-hosted Checkout or SetupIntent for card collection. FM may store only Stripe references and non-sensitive enforcement metadata, for example:

```text
stripe_customer_id
stripe_payment_method_id
stripe_payment_method_fingerprint
card_verification_status
account_id
created_at
```

Enforce the one-card-per-account rule using Stripe's payment-method fingerprint and server-side uniqueness checks. Treat this as a fraud-control signal, not an absolute promise: payment methods, wallets, network tokens, and Stripe behavior can vary.

Free trial card verification must happen through Stripe before the first trial generation. The browser must never send raw card data to the Worker.

Stripe webhook events are authoritative for:

- Subscription active/inactive state.
- Payment success/failure.
- Cancellation at period end.
- Top-up completion.
- Chargeback or dispute state.

## 8. Authentication and Security

Registration requires a unique username and password through both UI and API.

Password policy:

```text
7-18 characters
At least one letter
At least one digit
```

Use Worker-compatible PBKDF2-HMAC-SHA-256 with a per-user random salt and an explicitly benchmarked iteration count. Store the algorithm, iteration count, salt, and derived hash. Do not use the JWT secret as the password salt.

Generate the JWT signing secret locally with:

```sh
openssl rand -hex 32
```

Store it with the platform secret manager. Never place it in source, frontend bundles, docs, logs, or example responses.

Use:

```text
HttpOnly cookie
Secure cookie
SameSite=Lax
28-day lifetime
server-side JWT verification
```

Include API-capable signup, login, logout, session check, password recovery, reset, and security settings. Do not implement MCP.

Add login/register rate limits, generic account-enumeration-safe errors, CSRF protection for cookie-authenticated mutations, and audit logging for billing and ownership changes.

## 9. API Contract

All core functions must be callable without React:

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session

POST /api/worlds
GET  /api/worlds
GET  /api/worlds/:worldId
POST /api/worlds/:worldId/entities

POST /api/worlds/:worldId/generations/text
POST /api/worlds/:worldId/generations/image
POST /api/worlds/:worldId/generations/music
POST /api/worlds/:worldId/generations/video
GET  /api/generations/:generationId

POST /api/billing/checkout
POST /api/billing/topup/checkout
GET  /api/billing/wallet
GET  /api/billing/ledger
```

Text may return synchronously if it completes within the request contract. Image, music, and video must support asynchronous execution:

```json
{
  "generation_id": "gen_...",
  "status": "queued",
  "max_estimate": 1.11,
  "poll_url": "/api/generations/gen_..."
}
```

On completion:

```json
{
  "generation_id": "gen_...",
  "status": "completed",
  "artifact_url": "/api/artifacts/art_.../download"
}
```

The API must never return provider credentials or expose internal secrets.

## 10. World and Asset Data Model

Use new V2 tables rather than V1 `stories`, `script_versions`, and `media` as the domain root:

```text
users
subscriptions
payment_methods
wallets
ledger_entries
worlds
entities
entity_versions
canon_facts
relationships
creative_contracts
generations
provider_attempts
artifacts
artifact_versions
audit_events
```

World assets must be durable. Scratch/trial artifacts must have explicit `expires_at` and a visible lock state. Do not use a simple `save_to_world` boolean as the ownership model.

## 11. Rendering and Storage

Use R2 for original assets and generated files. Store metadata and ownership in D1.

```text
worlds/{worldId}/entities/{entityId}/versions/{versionId}/original
worlds/{worldId}/entities/{entityId}/versions/{versionId}/preview
worlds/{worldId}/generations/{generationId}/artifacts/{artifactId}
```

The Worker orchestrates model requests, polling, validation, R2 storage, and protected artifact URLs. It must not buffer or encode long videos in memory.

For the first V2 build, store the Provider-returned MP4. Add a separate renderer only when multi-clip composition is an approved requirement.

## 12. UI Scope

Required screens:

```text
Landing
Pricing
About
Profile
Security
Signup / Login / Recovery
Worlds
World dashboard
Create
Generation status
Asset detail
Wallet / Billing
```

Design requirements:

- Svelte UI.
- Simple and content-first.
- No animation.
- Responsive for desktop and tablet, with a usable mobile fallback.
- No provider/model selector.
- No visible credits or internal queue terminology.
- Always show generation estimate before execution.
- Clearly show Free asset lock timing.
- Use `fm.svg` as the brand mark.

## 13. Acceptance Gates Before Deployment

Do not deploy until all of these pass:

```text
API signup/login works without the UI
PBKDF2 password hashes verify and use unique salts
JWT secret is absent from source and bundles
Stripe never sends raw card data to FM
Duplicate payment-method fingerprint is rejected safely
Free cannot Top-up
Creator cannot generate without active subscription and funds
Provider is never called when reserve fails
Technical failure releases reservation
Repeated webhook does not duplicate subscription or wallet credit
Text/image/music/video API contracts are documented and tested
Completed MP4 is stored in R2 and returned through an authorized URL
World assets survive normal generation cleanup
No MCP route or dependency exists
```

## 14. Explicit Non-Goals

- Do not modify V1.
- Do not migrate V1 production data during the first build.
- Do not store raw credit-card numbers.
- Do not implement MCP.
- Do not expose model complexity in the UI.
- Do not promise synchronous MP4 generation.
- Do not allow negative balances.
- Do not implement long-video encoding inside the Worker.
- Do not add Team until the Free/Creator economics and World loop are proven.
