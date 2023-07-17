<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	import { toast } from 'svelte-sonner';

	function redirect() {
		throw redirect(301, '/');
	}
</script>

<p>
	{#if !$page.data.session}
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
					on:click={() => signIn('github')}
					on:click={() => toast('Iniciando sesion...')}
				>
					<iconify-icon icon="bi:github" class="icon" />
					Iniciar con GitHub
				</button>
				<!-- <button id="email" class="button" on:click={modalEmail}>
					<iconify-icon icon="ic:round-email" id="mail" class="icon" />
					Usar correo
				</button> -->
			</div>
		</section>
	{:else}
		<button on:click={() => signOut()} class="button">Sign out</button>
		<a href="/">Home</a>
		<img src={$page.data.session.user.image} />
	{/if}
</p>

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

	/* #login > small {
		margin-top: 0;
	} */
</style>
