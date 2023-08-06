<script>
	export let data;
	export let products;
	export let open;
	export let toggleMenu;

	$: localOpen = open;
	import HorizontalNav from '../components/horizontalNav.svelte';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	// let lowProducts = getProducts();

	let notifications;

	let path;

	let title = 'Dashboard';

	let loaded = false;

	const themes = ['dark', 'light'];

	$: current_theme = '';

	onMount(async () => {
		title = document.title;
		title = title;
		notifications = await products;
		if (typeof window !== 'undefined') {
			const theme = window.localStorage.getItem('theme');
			if (theme && themes.includes(theme)) {
				document.documentElement.setAttribute('data-theme', theme);
				current_theme = theme;
			}
		}
		loaded = true;
	});

	function changeTheme() {
		let theme = '';
		let bool = document.querySelector('#theme').checked;
		bool ? (theme = 'light') : (theme = 'dark');
		if (themes.includes(theme)) {
			const one_year = 60 * 60 * 24 * 365;
			window.localStorage.setItem('theme', theme);
			document.cookie = `theme=${theme}; max-age=${one_year}; path=/; SameSite=Lax`;
			document.documentElement.setAttribute('data-theme', theme);
			current_theme = theme;
		}
	}

	$: path = $page.url.pathname;

	$: if (path && loaded) {
		title = document.title;
	}

	let burgerOpen = false;

	$: if (burgerOpen) {
		document.documentElement.style.height = '100vh';
		document.documentElement.style.overflow = 'hidden';
	} else if (!burgerOpen && loaded) {
		document.documentElement.style.height = 'unset';
		document.documentElement.style.overflow = 'auto';
	}

	let width;
</script>

<svelte:window bind:innerWidth={width} />

<div class="flex relative">
	<div
		class="{localOpen
			? 'lg:pl-56'
			: 'lg:pl-[81px]'} bg-neutral w-full py-5 px-0 lg:py- lg:px-5 flex items-center transition-all"
	>
		{#if width < 1024}
			<div class="drawer w-fit">
				<input id="nav" type="checkbox" class="drawer-toggle" bind:checked={burgerOpen} />
				<div
					class="drawer-content fixed top-[18px] left-[21px] rounded bg-accent/10 w-fit z-[5] backdrop-blur-[5px] text-accent"
				>
					<label for="nav" class="btn btn-square btn-ghost min-h-0 h-[2.3rem] w-[2.3rem] p-0">
						<iconify-icon icon="mingcute:menu-fill" />
					</label>
				</div>
				<div class="drawer-side z-10">
					<label for="nav" class="drawer-overlay" />
					<ul
						class="fondo menu bg-base-100 {localOpen
							? 'w-56 gap-2'
							: 'w-[81px] gap-1'} overflow-hidden h-full box fixed z-10 flex flex-col flex-nowrap transition-all ease-in-out"
						style={open ? '' : '--opacity: 0.2;'}
					>
						<HorizontalNav profile={data} {localOpen} {toggleMenu} />
					</ul>
				</div>
			</div>
		{/if}
		<div class="flex w-full">
			<h1 class="font-bold text-2xl ml-[80px] lg:ml-10" in:fade>{title}</h1>
			<div class="flex items-center mr-4 ml-auto">
				<ul class="menu menu-horizontal items-center p-0 mr-4">
					<div class="dropdown dropdown-end">
						<label tabindex="0"
							><button class="btn btn-ghost btn-square btn-sm" name="menuButton" aria-label="Menu">
								<div class="indicator">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
										/></svg
									>
									{#if notifications}
										{#if notifications.length > 0}
											<span class="badge badge-xs badge-primary indicator-item" />
										{/if}
									{/if}
								</div>
							</button></label
						>
						<ul
							class="menu menu-sm dropdown-content mt-3 z-[1] p-2 gap-1 shadow bg-base-100 rounded-box w-52"
						>
							{#if notifications && notifications.length > 0}
								<p class="text-center">Notificaciones: {notifications.length}</p>
								{#each notifications as prod}
									<li>
										<div class="alert shadow-lg bg-secondary border-secondary">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												class="stroke-error shrink-0 w-6 h-6"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/></svg
											>
											<div>
												<h3 class="font-bold">Bajo stock! ({prod.quantity})</h3>
												<div class="text-xs">
													{prod.product}
												</div>
											</div>
										</div>
									</li>
								{/each}
							{:else if notifications && notifications.length < 1}
								<li>
									<div class="alert alert-success">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="stroke-current shrink-0 h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/></svg
										>
										<span>Sin notificaciones!</span>
									</div>
								</li>
							{/if}
						</ul>
					</div>
				</ul>
				<label class="swap swap-rotate" on:click={changeTheme}>
					<input type="checkbox" id="theme" checked={current_theme === 'light'} />
					<svg
						class="swap-on fill-current w-6 h-6"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						><path
							d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
						/></svg
					>
					<svg
						class="swap-off fill-current w-6 h-6"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						><path
							d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
						/></svg
					>
				</label>
			</div>
		</div>
	</div>
	<ul
		class="fondo menu bg-base-100 {localOpen
			? 'w-56 gap-2'
			: 'w-[81px] gap-1'} overflow-hidden h-full box fixed z-10 hidden lg:flex flex-col flex-nowrap transition-all ease-in-out"
		style={open ? '' : '--opacity: 0.2;'}
	>
		<HorizontalNav profile={data} {localOpen} {toggleMenu} />
	</ul>
</div>

<style>
	:root {
		--opacity: 0.5;
	}
	.fondo::before {
		content: '';
		width: 100%;
		height: 200px;
		top: 0;
		left: 0;
		opacity: var(--opacity);
		filter: brightness(1.5);
		position: absolute;
		z-index: -1;
		background: url('/test.webp');
		background-repeat: no-repeat;
		transition: all 0.3s ease-in-out;
	}
</style>
