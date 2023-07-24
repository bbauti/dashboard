<script>
	import '../app.postcss';
	import { Toaster, toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import HorizontalNav from '../components/horizontalNav.svelte';
	import '@fontsource-variable/inter';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	import { invalidate } from '$app/navigation';

	const waitFor = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

	export let data;

	let outdatedProducts;

	let { supabase, session, profile } = data;
	$: ({ supabase, session, profile } = data);

	async function getProducts() {
		const { data: products, error } = await supabase
			.from('stock')
			.select('id, product, quantity')
			.lte('quantity', 10);
		return products;
	}

	function mostrarToast(prod, count) {
		if (!count) {
			count = 1;
		}
		toast.error(`${count} | Bajo stock (${prod.quantity}) en ${prod.product}`);
		count++;
		setTimeout(() => {
			const siguienteProducto = outdatedProducts.shift();
			if (siguienteProducto) {
				mostrarToast(siguienteProducto, count);
			}
		}, 500);
	}

	onMount(async () => {
		themeChange(false);
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		if (session) {
			outdatedProducts = await getProducts();
			if (profile.stockNotifications) {
				if (outdatedProducts) {
					mostrarToast(outdatedProducts[0]);
				}
			}
		}

		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster richColors closeButton />

<main class="">
	{#if session}
		<HorizontalNav data={profile} />
	{/if}
	{#if !session}
		<slot />
	{:else}
		<section class="lg:pl-56 pt-[4rem] w-full">
			<slot />
		</section>
	{/if}
</main>
