<script>
	import ThemeSelect from '$lib/theme-select.svelte';
	import { page } from '$app/stores';

	let path;

	$: path = $page.url.pathname;

	const nav = [
		{ title: 'Inicio', url: '/app', icon: 'majesticons:home', class: 'mt-[1.5rem]' },
		{ divider: true },
		{ title: 'Carrito', url: '/app/sell', icon: 'fluent:cart-16-filled' },
		{ title: 'Stock', url: '/app/stockmgm', icon: 'solar:box-bold' },
		{ title: 'Team', url: '/app/team', icon: 'fluent:people-team-24-filled' },
		{ title: 'Ventas', url: '/app/sales', icon: 'solar:card-bold' },
		{ divider: true },
		{ title: 'Ajustes', url: '/app/settings', icon: 'ic:round-settings' }
	];
</script>

{#each nav as link}
	{#if link.title}
		<li>
			<a
				href={link.url}
				class="{link.class ? link.class : ''} {path === link.url
					? 'active'
					: ''} hover:scale-[1.03] transform-gpu"
			>
				<iconify-icon icon={link.icon} />
				{link.title}
			</a>
		</li>
	{:else}
		<div class="divider" />
	{/if}
{/each}
<div class="divider" />
<li>
	<ThemeSelect />
</li>
