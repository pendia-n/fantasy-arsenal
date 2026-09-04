<script lang="ts">
	let { theme, onTheme, onSignIn, onStart } = $props<{
		theme: 'dark' | 'light';
		onTheme: () => void;
		onSignIn?: () => void;
		onStart?: () => void;
	}>();
</script>

<header class="public-header">
	<a class="public-brand" href="/" aria-label="Fantasy Arsenal home">
		<img src="/fm.svg" alt="" />
		<strong>Fantasy Arsenal</strong>
	</a>
	<nav aria-label="Public navigation">
		<a href="/pricing">Pricing</a>
		<a href="/about">About</a>
		<button class="theme" type="button" aria-label="Toggle color theme" onclick={onTheme}>{theme === 'dark' ? '☼' : '☾'}</button>
		{#if onSignIn}<button class="sign-in" type="button" onclick={onSignIn}>Sign in</button>{:else}<a class="sign-in" href="/?signin=1">Sign in</a>{/if}
		{#if onStart}<button class="start" type="button" onclick={onStart}>Start keeping <span>↗</span></button>{:else}<a class="start" href="/?signup=1">Start keeping <span>↗</span></a>{/if}
	</nav>
</header>

<style>
	.public-header{width:100%;min-height:82px;border-bottom:1px solid var(--line,rgba(255,255,255,.14));display:flex;align-items:center;justify-content:space-between;gap:24px}
	.public-brand{display:flex;align-items:center;gap:11px;color:inherit;text-decoration:none;white-space:nowrap}.public-brand img{width:36px;height:36px}.public-brand strong{font-size:15px;letter-spacing:-.03em}
	nav{display:flex;align-items:center;justify-content:flex-end;gap:clamp(9px,1.7vw,24px)}nav>a:not(.start):not(.sign-in){color:var(--muted,#92909e);font-size:12px;text-decoration:none}button,.sign-in,.start{font:inherit;cursor:pointer;border-radius:8px;white-space:nowrap}.theme{width:42px;height:42px;color:inherit;background:transparent;border:1px solid var(--line,rgba(255,255,255,.14));font-size:18px}.sign-in{padding:11px 16px;color:inherit;background:transparent;border:1px solid var(--line,rgba(255,255,255,.14));text-decoration:none}.start{padding:12px 17px;color:#211b1b;background:#e7c39e;border:1px solid #e7c39e;font-weight:700;text-decoration:none}.start span{margin-left:18px}
	@media(max-width:700px){.public-header{align-items:flex-start;padding:16px 0;min-height:76px}.public-brand strong{display:none}nav{gap:8px;flex-wrap:wrap}nav>a:not(.start):not(.sign-in){display:none}.sign-in,.start{padding:10px 11px}.start span{margin-left:8px}}
</style>
