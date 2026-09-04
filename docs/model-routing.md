# Model Routing

Every generation request follows: raw input -> paraphrase -> task prompt -> provider job -> persistent asset.

## Free Trial

- Paraphrase: `ibm-granite/granite-4.0-h-micro`
- Story, scene, world text: `qwen/qwen3.7-flash`
- Character text: `ibm-granite/granite-4.1-8b`
- Image: `black-forest-labs/flux.2-klein-4b`; image-to-image is disabled

## Creator

- Paraphrase: `qwen/qwen3.6-35b-a3b`
- General text: `meta/muse-spark-1.2-contributor`
- Character text: `z-ai/glm-5.3-flash:batch`
- Image: `meta/muse-image`
- Music: `google/lyria-3-clip-preview`
- Video primary: `alibaba/wan-3.0-prime`
- Video fallback: `minimax/hailuo-3-max`

The provider adapter must normalize chat, image, audio, and asynchronous video responses. A failed provider job is not an automatic refund policy; billing state must be decided by a durable job ledger and explicit product policy.
