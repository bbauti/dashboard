<script>
	import emailLogin from '../../components/modals/emailLogin.svelte';

	import { toast } from 'svelte-sonner';

	import { fly } from 'svelte/transition';

	import { fade } from 'svelte/transition';

	import { enhance } from '$app/forms'
	export let form


	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

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

	import { createDialog } from '@melt-ui/svelte';

  	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
</script>

{#if !data.session}
	<section id="login">
		<img
			class="smalllogo"
			src="https://media.discordapp.net/attachments/1128453887259594783/1128769815578955816/DALLE_2023-07-12_16.27.39_-_fill_the_blank_space_with_a_B_with_a_gradient_and_it_migth_have_a_purple_background.png"
			alt="logoplaceholder"
			width="100px"
		/>
		<p id="loginTitle">Iniciar sesion en <span id="loginDashboard">Dashboard</span></p>
		<small>Para poder acceder al servicio, <span class="loginSmall">inicia sesion</span>.</small>

		<div id="buttonSection">
			<button
				id="github"
				class="button"
				on:click={() => signInWithGitHub()}
				on:click={() => toast('Iniciando sesion...')}
			>
				<iconify-icon icon="bi:github" class="icon" />
				Iniciar con GitHub
			</button>
			<button id="email" class="button" {...$trigger}
			use:trigger>
				<iconify-icon icon="ic:round-email" id="mail" class="icon" />
				Usar correo
			</button>
		</div>
	</section>
	<!-- Modal -->
	<div use:portal class="modal">
		{#if $open}
			<div {...$overlay} class="overlay" transition:fade={{ duration: 100 }}/>
			<div class="contents"
				{...$content}
				use:content
				transition:fly={{ y: 50, duration: 300 }}
			>
				<div class="contents">
					<h1>Usar correo</h1>
					<form method="post" action="?/register" use:enhance>
						<div class="input">
							<label for="email">Correo</label>
							<input type="email" name="email" id="email" placeholder="Correo" value={form?.email ?? ''} />
						</div>
						<div class="input">
							<label for="password">Contraseña</label>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Contraseña"
							/>
						</div>
						<button id="submitModal" class="button">
							<iconify-icon icon="ic:round-email" id="submitIcon" class="icon" />
							Crear cuenta
						</button>
						<button id="submitModal" class="button" formaction="?/login">
							<iconify-icon icon="ic:round-email" id="submitIcon" class="icon" />
							Iniciar sesion
						</button>
					</form>
					<div class="actions">
						<button id="closeModal" class="button" {...$close}
						use:close>
							<iconify-icon icon="gg:close" id="closeIcon" class="icon" />
							Cancelar
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<button on:click={() => handleSignOut()} class="button">Sign out</button>
	<a href="/">Home</a>
	<img src={data.session.user.image} />
{/if}

<style lang="scss">

	#login {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 20vh;
	}

	.smalllogo {
		border-radius: 25px;
	}

	#loginTitle {
		font-weight: 400;
		font-size: 1.5rem;
		margin-bottom: 0.3rem;
	}

	#loginDashboard {
		font-weight: 700;
	}

	.loginSmall {
		text-decoration: underline;
		text-underline-offset: 0.2rem;
		text-decoration-color: #ffffff09;
		text-decoration-thickness: 2px;
	}

	#mail {
		color: unset;
	}

	#email {
		background-color: #0e0e0e;
		color: #f8f8f8;
	}

	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
	}

	.overlay {
		position: fixed;
		z-index: -40;
		background-color: rgba(14, 14, 14, 0.685);
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.contents {
		min-width: 240px;
		font-family: 'Inter Variable', sans-serif;
		font-weight: 600;
		border-radius: 10px;
		padding: 16px;
		background: $text-color;
		color: $background-color;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	input {
		padding: 1rem;
		border: 1px solid white;
		background-color: $background-color;
		border-radius: 10px;
		color: $text-color;
	}

	.input {
		display: flex;
		flex-direction: column;
	}

	::placeholder {
		font-family: 'Inter Variable', sans-serif;
		font-weight: 500;
	}

	label {
		margin-left: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.actions {
		margin-top: 32px;
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}

	#closeModal {
		background-color: #ff3a20;
		max-width: 7.5rem;
		font-weight: 700;
	}

	#submitModal {
		background-color: #181818;
		color: $text-color;
		max-width: 10rem;
		font-weight: 500;
	}

	#submitIcon {
		color: $text-color;
	}


	/* #login > small {
		margin-top: 0;
	} */
</style>
