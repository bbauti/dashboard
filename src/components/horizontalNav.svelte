<script>
	export let data;
	export let products;
	import ThemeSelect from '$lib/theme-select.svelte';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// let lowProducts = getProducts();

	let notifications;

	let path;

	onMount(async () => {
		notifications = await products;
	});

	$: path = $page.url.pathname;

	let width;
	let firstName = data.first_name ?? '';
	let lastName = data.last_name ?? '';
	let avatarUrl = data.avatar_url ?? '';
</script>

<svelte:window bind:innerWidth={width} />

<ul class="menu bg-base-100 w-56 top-[4rem] h-full box fixed z-10 hidden lg:flex flex-col gap-2">
	<li>
		<a href="/app/" class="mt-[1.5rem] {path === '/app/' ? 'active' : ''}">
			<iconify-icon icon="majesticons:home" />
			Inicio
		</a>
	</li>
	<div class="divider" />
	<li>
		<a href="/app/sell" class={path === '/app/sell' ? 'active' : ''}>
			<iconify-icon icon="fluent:cart-16-filled" />
			Carrito
		</a>
	</li>
	<li>
		<a href="/app/stockmgm" class={path === '/app/stockmgm' ? 'active' : ''}>
			<iconify-icon icon="solar:box-bold" />
			Stock
		</a>
	</li>
	<li>
		<a href="/app/team" class={path === '/app/team' ? 'active' : ''}>
			<iconify-icon icon="fluent:people-team-24-filled" />
			Team
		</a>
	</li>
	<li>
		<a href="/app/sales" class={path === '/app/sales' ? 'active' : ''}>
			<iconify-icon icon="solar:card-bold" />
			Ventas
		</a>
	</li>
	<div class="divider" />
	<li>
		<a href="/app/settings" class={path === '/app/settings' ? 'active' : ''}>
			<iconify-icon icon="ic:round-settings" />
			Ajustes
		</a>
	</li>
	<div class="divider" />
	<li>
		<ThemeSelect />
	</li>
</ul>

<div class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content fixed top-0 w-full z-10 flex flex-col border-secondary border-b-2">
		<!-- Navbar -->
		<div class="w-full navbar bg-base-100">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" class="btn btn-square btn-secondary">
					<iconify-icon icon="mingcute:menu-fill" />
				</label>
			</div>
			<div class="flex-1 px-2 mx-2">
				<a href="/app/" class="btn btn-ghost normal-case text-xl">Dashboard</a>
			</div>
			<div class="flex items-center">
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
				<ul class="menu menu-horizontal items-center p-0">
					<div class="dropdown dropdown-end">
						{#if avatarUrl}
							<label tabindex="0" class="btn btn-ghost btn-circle avatar">
								<div class="w-10 rounded-full">
									<img src={avatarUrl} alt="user avatar" />
								</div>
							</label>
						{:else}
							<label class="btn btn-ghost btn-circle avatar placeholder">
								<div class="bg-secondary text-neutral-content rounded-full w-24 mx-auto lg:mx-0">
									<span class="text-3xl">{firstName.charAt(0) + lastName.charAt(0)}</span>
								</div>
							</label>
						{/if}
						<ul
							class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
						>
							<li>
								<a href="/app/account" class="justify-between"> Perfil </a>
							</li>
							<li><a href="/auth/logout">Cerrar sesion</a></li>
						</ul>
					</div>
				</ul>
			</div>
		</div>
	</div>
	<div class="drawer-side z-20">
		<label for="my-drawer-3" class="drawer-overlay" />
		<ul class="menu bg-base-100 w-56 h-full box fixed z-10">
			<li class="flex-1 px-2 h-[4rem] max-h-[4rem] mx-2">
				<a href="/app/" class="btn btn-ghost normal-case text-xl">Dashboard</a>
			</li>
			<li>
				<a href="/app/" class={path === '/app/' ? 'active' : ''}>
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<div class="divider" />
			<li>
				<a href="/app/sell" class={path === '/app/sell' ? 'active' : ''}>
					<iconify-icon icon="fluent:cart-16-filled" />
					Carrito
				</a>
			</li>
			<li>
				<a href="/app/stockmgm" class={path === '/app/stockmgm' ? 'active' : ''}>
					<iconify-icon icon="solar:box-bold" />
					Stock
				</a>
			</li>
			<li>
				<a href="/app/team" class={path === '/app/team' ? 'active' : ''}>
					<iconify-icon icon="fluent:people-team-24-filled" />
					Team
				</a>
			</li>
			<li>
				<a href="/app/sales" class={path === '/app/sales' ? 'active' : ''}>
					<iconify-icon icon="solar:card-bold" />
					Ventas
				</a>
			</li>
			<div class="divider" />
			<li>
				<a href="/app/settings" class={path === '/app/settings' ? 'active' : ''}>
					<iconify-icon icon="ic:round-settings" />
					Ajustes
				</a>
			</li>
			<div class="divider" />
			<li>
				<ThemeSelect />
			</li>
		</ul>
	</div>
</div>
