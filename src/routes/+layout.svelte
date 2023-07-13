<script>
	import { Toaster } from 'svelte-sonner';
	import { Modals, closeModal } from 'svelte-modals';
	import { fade } from 'svelte/transition';
	import Nav from '../components/nav.svelte';
	import '@fontsource-variable/inter';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
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
<Modals>
	<div
		slot="backdrop"
		class="backdrop"
		transition:fade|global={{ duration: 100 }}
		on:click={closeModal}
	/>
</Modals>
<slot />

<style>
	.backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
	}
</style>
