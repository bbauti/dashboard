<script>
	import '../app.scss';

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
</script>

<Nav />

<slot />
