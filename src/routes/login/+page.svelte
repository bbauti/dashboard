<script>
	import { toast } from 'svelte-sonner';

	import { fly } from 'svelte/transition';

	import { fade } from 'svelte/transition';

	import { enhance } from '$app/forms';
	export let form;

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	let email;
	let password;

	let selected;

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};

	async function signInWithGitHub() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github'
		});
	}

	let current = 'login';

	$: message = form?.message;

	$: success = form?.success;

	$: if (form?.message) {
		console.log(form?.message);
	}

	function handleTabClick(el) {
		current = el;
		success = null;
		message = null;
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
			<button id="emailButton" class="button" {...$trigger} use:trigger>
				<iconify-icon icon="ic:round-email" id="mail" class="icon" />
				Usar correo
			</button>
		</div>
	</section>
	<!-- Modal -->
	<div use:portal class="modal">
		{#if $open}
			<div {...$overlay} class="overlay" transition:fade={{ duration: 100 }} />
			<div
				class="modalContents"
				{...$content}
				use:content
				transition:fly={{ y: 50, duration: 300 }}
			>
				<div class="contents">
					{#if current === 'login'}
						<div class="modalHeader">
							<h1 class="modalTitle">Login</h1>
							<button class="closeModal" {...$close} use:close>
								<iconify-icon icon="lucide:x" class="closeModalIcon" />
							</button>
						</div>
						<form method="post" action="?/login" use:enhance>
							<div class="input">
								<label
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									for="email">Correo</label
								>
								<input
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									type="email"
									name="email"
									id="email"
									placeholder="nombre@dominio.com"
									value={form?.email ?? ''}
								/>
							</div>
							<div class="input">
								<label
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									for="password">Contraseña</label
								>
								<input
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									type="password"
									name="password"
									id="password"
									placeholder="•••••"
								/>
							</div>
							{#if success === true}
								<p style="color:green;">{message}</p>
							{:else if success === false}
								<p style="color:red;">{message}</p>
							{/if}
							<button id="loginModal" class="button submitModal">
								<iconify-icon icon="ic:round-email" id="submitIcon" class="icon" />
								Iniciar sesion
							</button>
						</form>
						<div class="smallAction">
							<button
								class="smallActionButton {current === 'register' ? 'current' : ''}"
								type="button"
								id="registerButton"
								on:click={() => handleTabClick('register')}>No tenes cuenta?</button
							>
						</div>
					{:else if current === 'register'}
						<div class="modalHeader">
							<h1 class="modalTitle">Register</h1>
							<button class="closeModal" {...$close} use:close>
								<iconify-icon icon="lucide:x" class="closeModalIcon" />
							</button>
						</div>
						<form method="post" action="?/register" use:enhance>
							<div class="input">
								<label
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									for="email">Correo</label
								>
								<input
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									type="email"
									name="email"
									id="email"
									placeholder="nombre@dominio.com"
									value={form?.email ?? ''}
								/>
							</div>
							<div class="input">
								<label
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									for="password">Contraseña</label
								>
								<input
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									type="password"
									name="password"
									id="password"
									placeholder="•••••"
								/>
							</div>
							<div class="input">
								<label
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									for="confirmPassword">Confirmar contraseña</label
								>
								<input
									class={success === true ? 'correct' : success === false ? 'wrong' : ''}
									type="password"
									name="confirmPassword"
									id="confirmPassword"
									placeholder="•••••"
								/>
							</div>
							{#if success === true}
								<p style="color:green;">{message}</p>
							{:else if success === false}
								<p style="color:red;">{message}</p>
							{/if}
							<button id="registerModal" class="button submitModal">
								<iconify-icon icon="ic:round-email" id="submitIcon" class="icon" />
								Crear cuenta
							</button>
						</form>
						<div class="smallAction">
							<button
								class="smallActionButton {current === 'login' ? 'current' : ''}"
								type="button"
								id="loginButton"
								on:click={() => handleTabClick('login')}>Ya tenes una cuenta?</button
							>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{:else}
	<section id="login">
		<img
			class="smalllogo"
			src="https://media.discordapp.net/attachments/1128453887259594783/1128769815578955816/DALLE_2023-07-12_16.27.39_-_fill_the_blank_space_with_a_B_with_a_gradient_and_it_migth_have_a_purple_background.png"
			alt="logoplaceholder"
			width="100px"
		/>
		<p id="loginTitle">Ya iniciaste sesion!</p>
		<small>Queres volver al <a class="loginSmall" href="/">inicio?</a></small>
		<button on:click={() => handleSignOut()} class="signOutButton">Sign out</button>
	</section>
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
		text-decoration-color: $bg-darker;
		text-decoration-thickness: 2px;
	}

	#mail {
		color: unset;
	}

	#emailButton {
		background-color: $bg-darker;
		color: $text-color;
	}

	label {
		margin-left: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.actions {
		margin: 16px;
		margin-top: 0;
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}

	#closeModal {
		background-color: $danger;
		max-width: 7.5rem;
		font-weight: 700;
	}

	.submitModal {
		background-color: $bg-light;
		color: $text-color;
		width: 100%;
		font-weight: 500;
		justify-content: center;
	}

	#submitIcon {
		color: $text-color;
	}

	.wrong {
		border-color: $danger;
		color: $danger-light;
	}

	.signOutButton {
		margin: 0 auto;
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background-color: unset;
		border: 1px solid $danger;
		border-radius: 10px;
		color: $danger;
	}

	/* #login > small {
		margin-top: 0;
	} */
</style>
