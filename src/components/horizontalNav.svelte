<script>
	import { page } from '$app/stores';

	let path;

	$: path = $page.url.pathname;

	const nav = [
		{
			title: 'Inicio',
			url: '/app',
			icon: 'majesticons:home',
			class: 'mt-[1.5rem]',
			color: 'text-blue-300',
			active: 'text-blue-500'
		},
		{ divider: true },
		{
			title: 'Carrito',
			url: '/app/sell',
			icon: 'fluent:cart-16-filled',
			color: 'text-green-300',
			active: 'text-green-500'
		},
		{
			title: 'Stock',
			url: '/app/stockmgm',
			icon: 'solar:box-bold',
			color: 'text-purple-300',
			active: 'text-purple-500'
		},
		{
			title: 'Team',
			url: '/app/team',
			icon: 'fluent:people-team-24-filled',
			color: 'text-orange-300',
			active: 'text-orange-500'
		},
		{
			title: 'Ventas',
			url: '/app/sales',
			icon: 'solar:card-bold',
			color: 'text-pink-300',
			active: 'text-pink-500'
		},
		{ divider: true },
		{
			title: 'Ajustes',
			url: '/app/settings',
			icon: 'ic:round-settings',
			color: 'text-gray-300',
			active: 'text-gray-500'
		},
		{ divider: true }
	];
</script>

{#each nav as link}
	{#if link.title}
		<li>
			<a
				href={link.url}
				class="{link.class ? link.class : ''} {path === link.url
					? 'active shadow-xl shadow-primary/[0.02]'
					: ''} hover:scale-[1.03] transform-gpu"
			>
				<iconify-icon
					class={path === link.url ? `${link.active} transition-all ease-in-out` : link.color}
					icon={link.icon}
				/>
				{link.title}
			</a>
		</li>
	{:else}
		<div class="divider" />
	{/if}
{/each}
<li class="mt-[80%] hover:bg-unset">
	<div class="p-5">
		<p>aca iria el perfil y eso</p>
	</div>
</li>
