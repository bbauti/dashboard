<script>
	import '../app.scss';

	import { Toaster } from 'svelte-sonner';

	import { Modals, closeModal } from 'svelte-modals';

	import { fade } from 'svelte/transition';

	import { page } from '$app/stores';
	import Nav from '../components/nav.svelte';

	if (!$page.route.id.includes('auth')) {
		if (!$page.data.session) {
			console.log('no estas logueado');
		} else {
			console.log('tas logueado');
		}
	} else {
		console.log('estas en ' + $page.route.id);
	}
	import '@fontsource-variable/inter';
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
