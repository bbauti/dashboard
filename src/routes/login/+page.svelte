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
	<section id="login" class="prose hero min-h-screen mx-auto">
		<div class="hero-content text-center flex-col gap-0">
			<img
				class="rounded-3xl"
				src="https://media.discordapp.net/attachments/1128453887259594783/1128769815578955816/DALLE_2023-07-12_16.27.39_-_fill_the_blank_space_with_a_B_with_a_gradient_and_it_migth_have_a_purple_background.png"
				alt="Logo"
				width="100px"
			/>
			<h2 class="mt-0 mb-1 font-semibold">
				Iniciar sesion en <span class="font-bold underline decoration-3 underline-offset-4"
					>Dashboard</span
				>
			</h2>
			<p class="mt-1 mb-4 font-normal">
				Para poder acceder al servicio, <span class="font-bold">inicia sesion</span>.
			</p>

			<div class="flex flex-col gap-3">
				<button
					class="btn btn-accent text-left justify-start font-bold"
					on:click={() => signInWithGitHub()}
					on:click={() => toast('Iniciando sesion...')}
				>
					<iconify-icon icon="bi:github" class="icon" />
					Iniciar con GitHub
				</button>
				<button class="btn justify-start font-bold" onclick="email.showModal()"
					><iconify-icon icon="ic:round-email" id="mail" class="icon" />
					Usar correo</button
				>
				<dialog id="email" class="modal">
					<div class="modal-box w-fit">
						<form method="dialog">
							<button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2"
								><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
							>
						</form>
						{#if current === 'login'}
							<h2 class="mt-0">Login</h2>
							<form method="post" action="?/login" use:enhance>
								<div class="form-control mx-auto w-fit">
									<label class="label" for="emailInput">
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
										placeholder="nombre@dominio.com"
										value={form?.email ?? ''}
									/>
								</div>
								<div class="form-control mx-auto w-fit">
									<label class="label" for="passwordInput">
										<span class="label-text">Contraseña</span>
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
								<button class="btn mt-4 btn-neutral">
									<iconify-icon icon="ic:round-email" />
									Iniciar sesion
								</button>
							</form>
							<button
								class="btn btn-ghost btn-sm btn-accent font-normal normal-case mt-2"
								type="button"
								on:click={() => handleTabClick('register')}>No tenes cuenta?</button
							>
						{:else if current === 'register'}
							<h2 class="mt-0">Registro</h2>
							<form method="post" action="?/register" use:enhance>
								<div id="inputs" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
									<div class="form-control mx-auto w-fit">
										<label class="label" for="firstName">
											<span class="label-text">Nombre</span>
										</label>
										<input
											class="input input-bordered {success === true
												? 'input-success'
												: success === false
												? 'input-error'
												: ''}"
											type="text"
											name="firstName"
											id="firstName"
											placeholder="Nombre"
											value={form?.firstName ?? ''}
										/>
									</div>
									<div class="form-control mx-auto w-fit">
										<label class="label" for="lastName">
											<span class="label-text">Apellido</span>
										</label>
										<input
											class="input input-bordered {success === true
												? 'input-success'
												: success === false
												? 'input-error'
												: ''}"
											type="text"
											name="lastName"
											id="lastName"
											placeholder="Apellido"
											value={form?.lastName ?? ''}
										/>
									</div>
									<div class="form-control mx-auto w-fit">
										<label class="label" for="emailInput">
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
											placeholder="nombre@dominio.com"
											value={form?.email ?? ''}
										/>
									</div>
									<div class="form-control mx-auto w-fit">
										<label class="label" for="passwordInput">
											<span class="label-text">Contraseña</span>
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
									<div class="form-control mx-auto w-fit">
										<label class="label" for="confirmPassword">
											<span class="label-text">Confirmar contraseña</span>
										</label>
										<input
											class="input input-bordered {success === true
												? 'input-success'
												: success === false
												? 'input-error'
												: ''}"
											type="password"
											name="confirmPassword"
											id="confirmPassword"
											placeholder="•••••"
										/>
									</div>
								</div>
								{#if success === true}
									<p style="color:green;">{message}</p>
								{:else if success === false}
									<p style="color:red;">{message}</p>
								{/if}
								<button class="btn mt-4 btn-neutral">
									<iconify-icon icon="ic:round-email" />
									Crear cuenta
								</button>
							</form>
							<button
								class="btn btn-ghost btn-sm btn-accent font-normal normal-case mt-2"
								type="button"
								on:click={() => handleTabClick('login')}>Ya tenes una cuenta?</button
							>
						{/if}
					</div>
					<form method="dialog" class="modal-backdrop">
						<button>close</button>
					</form>
				</dialog>
			</div>
		</div>
	</section>
{:else}
	<section id="login" class="prose hero min-h-screen mx-auto">
		<div class="hero-content text-center flex-col">
			<img
				class="rounded-3xl"
				src="https://media.discordapp.net/attachments/1128453887259594783/1128769815578955816/DALLE_2023-07-12_16.27.39_-_fill_the_blank_space_with_a_B_with_a_gradient_and_it_migth_have_a_purple_background.png"
				alt="Logo"
				width="100px"
			/>
			<h2 class="mt-0 mb-2">Ya iniciaste sesion!</h2>
			<small>Queres volver al <a class="font-bold text-sm" href="/">inicio?</a></small>
			<button on:click={() => handleSignOut()} class="mt-5 btn btn-error">Cerrar sesion</button>
		</div>
	</section>
{/if}

<!-- <style lang="scss">

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
</!-->

<style lang="postcss">
	#inputs {
		scrollbar-width: none;
	}

	#inputs::-webkit-scrollbar {
		display: none;
	}
</style>
