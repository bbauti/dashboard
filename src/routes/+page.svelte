<script>
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	let status = data.session;

	$: status = data.session;

	console.log('index');
	console.log(status);

	let email;
	let password;

	const handleSignUp = async () => {
		await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`
			}
		});
	};

	const handleSignIn = async () => {
		await supabase.auth.signInWithPassword({
			email,
			password
		});
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};

	async function signInWithGitHub() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github'
		});
	}
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="row flex-center flex">
	<div class="col-6 form-widget">
		<Auth
			supabaseClient={data.supabase}
			view="magic_link"
			redirectTo={`${data.url}/auth/callback`}
			showLinks={false}
			appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
		/>
	</div>
	<form on:submit={handleSignUp}>
		<input name="email" bind:value={email} />
		<input type="password" name="password" bind:value={password} />
		<button>Sign up</button>
	</form>

	<button on:click={handleSignIn}>Sign in</button>
	<button on:click={handleSignOut}>Sign out</button>

	<button on:click={signInWithGitHub}>gihub</button>
</div>
