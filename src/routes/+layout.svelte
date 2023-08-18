<script>
	export let data;

	import { Toaster, toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import Navbar from '$lib/navbar.svelte';
	import { browser } from '$app/environment';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { setContext } from 'svelte';

	setContext('changeNav', { toggleMenu });

	import '../app.postcss';

	inject({ mode: dev ? 'development' : 'production' });

	const themes = ['dark', 'light'];

	let open = true;
	let outdatedProducts;
	let current_theme;
	let path;

	let { supabase, session, profile } = data;
	$: ({ supabase, session, profile } = data);

	$: path = $page.url.pathname;

	function toggleMenu() {
		open = !open;
	}

	async function getProducts() {
		const { data: products, error } = await supabase
			.from('stock')
			.select('id, product, quantity')
			.lte('quantity', 10);
		return products;
	}

	function mostrarToast(arr) {
		arr.forEach((prod, index) => {
			setTimeout(() => {
				toast.error(`Bajo stock (${prod.quantity}) en ${prod.product}`);
			}, index * 500);
		});
	}

	function changeTheme(userTheme) {
		const theme = userTheme;
		if (themes.includes(theme)) {
			const one_year = 60 * 60 * 24 * 365;
			window.localStorage.setItem('theme', theme);
			document.cookie = `theme=${theme}; max-age=${one_year}; path=/; SameSite=Lax`;
			document.documentElement.setAttribute('data-theme', theme);
			current_theme = theme;
		}
	}

	onMount(async () => {
		themeChange(false);
		if (typeof window !== 'undefined') {
			const theme = window.localStorage.getItem('theme');
			if (theme && themes.includes(theme)) {
				document.documentElement.setAttribute('data-theme', theme);
				current_theme = theme;
			}
		}
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		if (session) {
			outdatedProducts = await getProducts();
			if (profile.stockNotifications) {
				if (outdatedProducts) {
					mostrarToast(outdatedProducts);
				}
			}
		}

		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster richColors closeButton />

<main>
	{#if session && path !== '/'}
		<Navbar data={profile} products={getProducts()} {open} on:toggleMenu={toggleMenu} />
		<section class="{session ? 'w-full' : ''} {open ? 'lg:pl-56' : 'lg:pl-[81px]'} transition-all">
			<slot />
		</section>
	{:else}
		<slot />
		<nav
			class="fixed bottom-4 left-4 flex gap-2 rounded-xl p-2 border-2 border-secondary/50 backdrop-blur-md"
		>
			<button
				class="btn btn-square btn-sm {current_theme === 'dark' ? 'btn-success' : 'btn-secondary'}"
				name="darkButton"
				on:click={() => changeTheme('dark')}
				><iconify-icon icon="akar-icons:moon-fill" />
			</button><button
				class="btn btn-square btn-sm {current_theme === 'light' ? 'btn-success' : 'btn-secondary'}"
				name="lightButton"
				on:click={() => changeTheme('light')}
				><iconify-icon icon="akar-icons:sun-fill" />
			</button>
		</nav>
	{/if}
</main>
