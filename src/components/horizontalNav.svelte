<script>
	export let profile;
	export let localOpen;
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { getContext } from 'svelte';

	const { toggleMenu } = getContext('changeNav');

	$: open = localOpen;

	let fullname = profile.full_name ?? '';
	let avatarUrl = profile.avatar_url ?? '';

	// let fullname = 'hola';
	// let avatarUrl = 'pato';

	let path;

	$: path = $page.url.pathname;

	function handleToggleMenu() {
		if (toggleMenu) {
			toggleMenu();
		}
	}

	const nav = [
		{ divider: true },
		{
			title: 'Inicio',
			url: '/app',
			icon: 'majesticons:home',
			color: 'text-blue-300',
			active: 'text-blue-500'
		},
		{ divider: 'Principal' },
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
		{ divider: 'Ajustes' },
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

<li class="w-full">
	<button
		class="hover:bg-secondary/50 flex items-center gap-5 p-5 bg-secondary/20 text-accent menu-title rounded-[10px]"
		on:click={handleToggleMenu}
	>
		<img src="/logo.svg" alt="icon" width="25" height="25" />
		{#if localOpen}
			<h1
				class="font-bold text-accent/95 text-xl whitespace-nowrap"
				in:fade={{ delay: 0, duration: 100 }}
				out:fade={{ delay: 0, duration: 25 }}
			>
				Punto Bazar
			</h1>
		{/if}
	</button>
</li>
{#each nav as link}
	{#if link.title}
		<li>
			<a
				href={link.url}
				class="{link.class ? link.class : ''} {path === link.url
					? 'active shadow-xl shadow-primary/[0.02]'
					: ''} hover:scale-[1.03] transform-gpu {!open ? 'pl-[21px]' : ''} "
			>
				<iconify-icon
					class="{path === link.url
						? `${link.active} transition-all ease-in-out`
						: link.color} {!open ? 'text-xl' : ''}"
					icon={link.icon}
				/>
				<p
					class="whitespace-nowrap {open ? '' : 'hidden'} transition-all"
					in:fade={{ delay: 300, duration: 100 }}
					out:fade={{ delay: 0, duration: 25 }}
				>
					{link.title}
				</p>
			</a>
		</li>
	{:else if link.divider === true}
		<div class="separator" />
	{:else}
		<h1
			class="mt-3 ml-3 subpixel-antialiased font-medium text-xs text-accent/30 uppercase tracking-widest cursor-default select-none {open
				? ''
				: 'text-white/0 line-through decoration-accent/20 ml-[-10px] tracking-[10rem]'}"
		>
			{link.divider}
		</h1>
	{/if}
{/each}

<li>
	<div
		class="flex {open
			? 'py-4'
			: 'flex-col px-0'} border-2 border-secondary hover:border-accent/10 hover:bg-inherit profile"
		id="profile"
	>
		{#if avatarUrl}
			<div class="avatar">
				<div class="w-10 rounded">
					<img src={avatarUrl} alt="Avatar" />
				</div>
			</div>
		{/if}
		{#if open}
			<div class="flex flex-col">
				<p>{fullname}</p>
			</div>
		{/if}
		<div class={open ? '' : 'w-full'}>
			<div class="flex mx-auto {open ? 'w-fit ml-1' : 'flex-col w-full px-2 items-center'} gap-1">
				<a href="/app/account">
					<iconify-icon
						icon="tabler:settings"
						class="hover:bg-secondary p-1.5 rounded hover:scale-110 transition-all"
					/>
				</a>
				<a href="/auth/logout">
					<iconify-icon
						icon="tabler:logout"
						class="hover:bg-secondary p-1.5 rounded text-error hover:scale-110 transition-all"
					/>
				</a>
			</div>
			<!-- {#if open}
				<div class="flex mx-auto w-fit h-fit gap-1 ml-1">
					<button class="btn btn-xs btn-neutral cursor-default pointer-events-none p-1 max-h-fit"
						></button
					>
				</div>
			{/if} -->
		</div>
	</div>
</li>

<style>
	.separator {
		background-image: linear-gradient(to right, #3a3a3a 50%, rgba(255, 255, 255, 0) 0%);
		background-size: 1.5rem 1px;
		position: relative;
		flex: 0 0 2px;
		opacity: 0.5;
		margin: 10px;
	}

	#profile {
		cursor: default;
	}

	#profile:active {
		background-color: unset;
	}
</style>
