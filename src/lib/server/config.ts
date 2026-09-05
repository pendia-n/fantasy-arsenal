export type Plan = 'free' | 'creator';
export type OutputKind = 'story' | 'character' | 'image' | 'song' | 'video';
export const MODELS = {
 free: { paraphrase:'ibm-granite/granite-4.0-h-micro', text:'qwen/qwen3.7-flash', character:'ibm-granite/granite-4.1-8b', image:'black-forest-labs/flux.2-klein-4b' },
 creator: { paraphrase:'qwen/qwen3.6-35b-a3b', text:'meta/muse-spark-1.3', character:'z-ai/glm-5.3-flash:batch', image:'meta/muse-image', song:'google/lyria-3-clip-preview', video:'alibaba/wan-3.0-prime', videoFallback:'minimax/hailuo-3-max' }
} as const;
export function modelFor(plan: Plan, kind: OutputKind) { const p = MODELS[plan]; return kind === 'character' ? p.character : kind === 'image' ? p.image : kind === 'song' || kind === 'video' ? (p as typeof MODELS.creator)[kind] : p.text; }
