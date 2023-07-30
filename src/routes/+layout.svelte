<script>
	import '../app.postcss';
	import { Toaster, toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import HorizontalNav from '../components/horizontalNav.svelte';
	import '@fontsource-variable/inter';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	import { invalidate } from '$app/navigation';

	const themes = ['dark', 'light'];

	inject({ mode: dev ? 'development' : 'production' });

	export let data;

	let outdatedProducts;

	let { supabase, session, profile } = data;
	$: ({ supabase, session, profile } = data);

	const waitFor = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

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

	let current_theme;

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
</script>

<Toaster richColors closeButton />

<main class="">
	{#if session}
		<HorizontalNav data={profile} products={getProducts()} />
		<section class={session ? 'lg:pl-56 pt-[4rem] w-full' : ''}>
			<slot />
		</section>
	{:else}
		<slot />
		<nav class="fixed bottom-4 left-4 flex gap-2 rounded-xl p-2 border-2 border-secondary/50">
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
