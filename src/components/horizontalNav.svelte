<script>
	export let data;
	import ThemeSelect from '$lib/theme-select.svelte';

	let width;
	let firstName = data.first_name ?? '';
	let lastName = data.last_name ?? '';
	let avatarUrl = data.avatar_url ?? '';
</script>

<svelte:window bind:innerWidth={width} />

{#if width >= 1024}
	<ul class="menu bg-base-100 w-56 top-[4rem] h-full box fixed z-10">
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<div class="divider" />
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<div class="divider" />
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
		<li>
			<a href="/">
				<iconify-icon icon="majesticons:home" />
				Inicio
			</a>
		</li>
	</ul>
{/if}

<div class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content fixed top-0 w-full z-10 flex flex-col">
		<!-- Navbar -->
		<div class="w-full navbar bg-base-100">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" class="btn btn-square btn-secondary">
					<iconify-icon icon="mingcute:menu-fill" />
				</label>
			</div>
			<div class="flex-1 px-2 mx-2">
				<a href="/" class="btn btn-ghost normal-case text-xl">Dashboard</a>
			</div>
			<div class="flex items-center">
				<ul class="menu menu-horizontal items-center p-0">
					<ThemeSelect />
					<div class="dropdown dropdown-end">
						{#if avatarUrl}
							<label tabindex="0" class="btn btn-ghost btn-circle avatar">
								<div class="w-10 rounded-full">
									<img src={avatarUrl} />
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
								<a href="/account" class="justify-between"> Perfil </a>
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
		<ul class="menu bg-base-100 w-56 top-[4rem] h-full box fixed z-10">
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<div class="divider" />
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<div class="divider" />
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
			<li>
				<a href="/">
					<iconify-icon icon="majesticons:home" />
					Inicio
				</a>
			</li>
		</ul>
	</div>
</div>
