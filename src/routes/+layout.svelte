<script lang="ts">let { children } = $props();</script>
<svelte:head><link rel="icon" href="/fm.svg" />
<style>:global(html),:global(body){overflow-x:hidden}:global(.landing-nav),:global(.page header){width:100%;min-height:82px;display:flex;align-items:center;justify-content:space-between;gap:20px}:global(.landing-nav nav),:global(.page header nav){display:flex;align-items:center;gap:clamp(10px,2vw,24px);flex-wrap:wrap;justify-content:flex-end}:global(.landing-nav .brand),:global(.page header .brand){flex:0 0 auto}:global(.landing-nav button),:global(.page header button){cursor:pointer;border-radius:8px}:global(.page header>a:last-child){white-space:nowrap}@media(max-width:560px){:global(.landing-nav),:global(.page header){min-height:76px;align-items:flex-start;padding-top:16px;padding-bottom:16px}:global(.landing-nav nav),:global(.page header nav){gap:8px 12px}:global(.landing-nav .brand span),:global(.page header .brand b){font-size:14px}}
:global(.public-shell){padding:0 clamp(18px,5vw,76px);background:#0d0f14;color:#f6f0e8;--muted:#92909e;--line:rgba(255,255,255,.14)}:global(.public-shell.light){background:#f3f1eb;color:#202127;--muted:#6d6b73;--line:rgba(25,26,30,.14)}:global(.page>header){display:none}
</style></svelte:head>

{@render children()}
