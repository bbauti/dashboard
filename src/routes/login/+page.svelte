<script>
	import { toast } from 'svelte-sonner';

	import { blur } from 'svelte/transition';
	import { fade } from 'svelte/transition';

	import { goto } from '$app/navigation';

	import { createDialog } from '@melt-ui/svelte';
	import { onMount } from 'svelte';

	import { enhance } from '$app/forms';

	export let form;
	export let data;

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();

	let { supabase } = data;
	$: ({ supabase } = data);

	let email;
	let password;
	let code = false;
	let current = 'login';

	$: code = data.code;
	$: message = form?.message;
	$: success = form?.success;

	$: logged = form?.logged;

	$: if (logged) {
		location.reload();
	}

	async function sendCode() {
		const data = new FormData(this);
		const res = await fetch('?/sendCode', {
			method: 'POST',
			body: data
		}).then(async (response) => {
			let serverData = await response.json();
			let jsonData = JSON.parse(serverData.data);
			if (jsonData[1]) {
				document.cookie = `code=${data.get('code')}; max-age=${60 * 60 * 24 * 7}; path=/`;
				code = true;
			}
		});
	}

	async function signInWithGitHub() {
		const { data, error } = await supabase.auth
			.signInWithOAuth({
				provider: 'github'
			})
			.then(location.reload());
	}

	async function signInWithGoogle() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});
	}

	onMount(() => {
		if (data.session) {
			goto('/app');
		}
	});
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<section class="flex flex-1 h-screen bg-base-100">
	<main
		class="flex flex-col items-center flex-1 flex-shrink-0 px-5 py-16 lg:border-r border-accent/10 shadow-lg overflow-y-auto"
	>
		{#if code}
			<section id="login" class="prose max-w-[40ch] w-full mx-auto">
				<div class="flex-col gap-0 w-full">
					<h2 class="mt-0 mb-1 font-semibold">Bienvenido de vuelta</h2>
					<p class="mt-1 mb-4 font-normal">Inicia sesion en tu cuenta.</p>

					<div class="flex flex-col gap-3 mt-10">
						<button
							class="btn bg-secondary-content border-accent/10 hover:bg-accent/10 hover:border-accent/30 justify-center font-bold min-h-[2.5rem] h-[2.5rem] w-full"
							on:click={() => signInWithGitHub()}
							on:click={() => toast('Iniciando sesion...')}
						>
							<iconify-icon icon="bi:github" class="icon" />
							Iniciar con GitHub
						</button>
						<button
							class="btn bg-secondary/50 border-accent/10 hover:border-accent/50 hover:bg-secondary/30 justify-center font-bold min-h-[2.5rem] h-[2.5rem] w-full"
							on:click={() => signInWithGoogle()}
							on:click={() => toast('Iniciando sesion...')}
						>
							<iconify-icon icon="bi:google" class="icon" />
							Iniciar con Google
						</button>
						<!-- <button
							class="btn justify-center font-bold shadow-xl min-h-[2.5rem] h-[2.5rem] w-full"
							onclick="email.showModal()"
							><iconify-icon icon="ic:round-email" id="mail" class="icon" />
							Usar correo</button
						> -->
						<div class="divider" />
						<form method="post" action="?/login" use:enhance>
							<div class="form-control w-full">
								<label class="label pt-0" for="emailInput">
									<span class="label-text">Correo</span>
								</label>
								<input
									class="input input-bordered {success === true
										? 'input-success'
										: success === false
										? 'input-error'
										: ''}"
									type="email"
									name="emailInput"
									id="emailInput"
									placeholder="john@bbauti.com"
									value={form?.email ?? ''}
								/>
							</div>
							<div class="form-control w-full">
								<label class="label" for="passwordInput">
									<span class="label-text">Contraseña</span>
									<a
										href="/password"
										class="label-text link link-hover font-normal text-sm text-accent/70"
										>Olvidaste tu contraseña?</a
									>
								</label>
								<input
									class="input input-bordered {success === true
										? 'input-success'
										: success === false
										? 'input-error'
										: ''}"
									type="password"
									name="passwordInput"
									id="passwordInput"
									placeholder="•••••"
								/>
							</div>
							{#if success === true}
								<p style="color:green;">{message}</p>
							{:else if success === false}
								<p style="color:red;">{message}</p>
							{/if}
							<button
								class="btn mt-4 bg-success/50 min-h-[2.5rem] h-[2.5rem] w-full border-success/80 hover:border-success/80 hover:bg-success/25"
								name="loginUser"
								aria-label="Login"
							>
								<iconify-icon icon="ic:round-email" />
								Iniciar sesion
							</button>
						</form>
						<p class="text-sm text-accent/70 mx-auto">
							No tenes una cuenta?<a
								href="/register"
								class="link link-hover text-sm text-accent font-normal ml-[0.5ch]"
								>Registrate ahora</a
							>
						</p>
					</div>
				</div>
			</section>
		{:else}
			<section id="login" class="prose max-w-[40ch] w-full m-auto">
				<div class="flex-col gap-0 w-full">
					<!-- <img
					class="rounded-3xl shadow-lg"
					src="https://media.discordapp.net/attachments/1128453887259594783/1128769815578955816/DALLE_2023-07-12_16.27.39_-_fill_the_blank_space_with_a_B_with_a_gradient_and_it_migth_have_a_purple_background.png"
					alt="Logo"
					width="100px"
				/> -->
					<h2 class="mt-0 mb-1 font-semibold">Tenes un codigo?</h2>
					<p class="mt-1 mb-4 font-normal">Para usar la app, necesitas un codigo de invitacion.</p>

					<div class="flex flex-col gap-3 mt-10 w-full">
						<form
							method="post"
							on:submit|preventDefault={sendCode}
							class="flex flex-col items-center w-full"
						>
							<div class="form-control w-full">
								<label class="label" for="code">
									<span class="label-text">Codigo</span>
								</label>
								<input
									type="password"
									name="code"
									id="code"
									placeholder="*****"
									class="input input-bordered w-full"
								/>
							</div>
							<button
								type="submit"
								name="send"
								class="btn btn-primary mt-10 min-h-[2.5rem] h-[2.5rem] w-full">Enviar</button
							>
						</form>
					</div>
				</div>
			</section>
		{/if}
	</main>
	<aside
		class="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex bg-zinc-900/10"
	>
		<h1 class="text-6xl max-w-[10ch] font-bold">El dashboard para tu negocio</h1>
	</aside>
</section>

<style>
	:root {
		--purple: rgb(123, 31, 162);
		--violet: rgb(103, 58, 183);
		--pink: rgb(244, 143, 177);
	}

	#inputs {
		scrollbar-width: none;
	}

	#inputs::-webkit-scrollbar {
		display: none;
	}
</style>
