<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	function redirect() {
		throw redirect(301, '/');
	}
</script>

<p>hola</p>
<p>
	{#if !$page.data.session}
		<span class="notSignedInText">You are not signed in</span>
		<button on:click={() => signIn('github')}>Sign In with GitHub</button>
	{:else}
		<button on:click={() => signOut()} class="button">Sign out</button>
		<a href="/">Home</a>
		<img src={$page.data.session.user.image} />
	{/if}
</p>

<style>
</style>
