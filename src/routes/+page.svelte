<script>
	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<a href="/login">login</a>
