<script>
	import '../app.postcss';
	import { Toaster } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import HorizontalNav from '../components/horizontalNav.svelte';
	import '@fontsource-variable/inter';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	// import '../app.scss';

	import { invalidate } from '$app/navigation';

	export let data;

	let { supabase, session, profile } = data;
	$: ({ supabase, session, profile } = data);

	onMount(() => {
		themeChange(false);
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster />

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
