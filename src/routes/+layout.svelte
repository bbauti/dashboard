<script>
	import '../app.postcss';
	import { Toaster } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import Nav from '../components/nav.svelte';
	import '@fontsource-variable/inter';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	// import '../app.scss';

	import { invalidate } from '$app/navigation';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

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

<!-- <Nav /> -->
<Toaster />
<button data-toggle-theme="dark,light" data-act-class="ACTIVECLASS" class="absolute"
	>cambiar tema?god</button
>

<main>
	<slot />
</main>
