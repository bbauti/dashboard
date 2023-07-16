<script>
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

{#if data.sessio}
	<a href="/account">account</a>
{:else}
	<a href="/login">login</a>
{/if}
