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

	let codeSuccess;
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
			} else {
				codeSuccess = false;
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
	<title>Registro</title>
</svelte:head>

<section class="flex flex-1 h-screen bg-base-100">
	<main
		class="flex flex-col items-center flex-1 flex-shrink-0 px-5 py-16 lg:border-r border-accent/10 shadow-lg overflow-y-auto"
	>
		{#if code}
			<section id="login" class="prose max-w-[40ch] w-full mx-auto">
				<div class="flex-col gap-0 w-full">
					<!-- <img
						class="rounded-3xl shadow-lg"
						src="https://media.discordapp.net/attachments/1128453887259594783/1128769815578955816/DALLE_2023-07-12_16.27.39_-_fill_the_blank_space_with_a_B_with_a_gradient_and_it_migth_have_a_purple_background.png"
						alt="Logo"
						width="100px"
					/> -->
					<h2 class="mt-0 mb-1 font-semibold">Bienvenido!</h2>
					<p class="mt-1 mb-4 font-normal">Crea tu cuenta.</p>

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
						<form method="post" action="?/register" use:enhance>
							<div class="form-control w-full">
								<label class="label" for="fullName">
									<span class="label-text">Nombre completo</span>
								</label>
								<input
									class="input input-bordered {success === true
										? 'input-success'
										: success === false
										? 'input-error'
										: ''}"
									type="text"
									name="fullName"
									id="fullName"
									placeholder="John Doe"
									value={form?.fullName ?? ''}
								/>
							</div>
							<div class="form-control w-full">
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
									placeholder="john@bbauti.com"
									value={form?.email ?? ''}
								/>
							</div>
							<div class="form-control w-full">
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
							<div class="form-control w-full">
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
							{#if success === true}
								<p style="color:green;">{message}</p>
							{:else if success === false}
								<p style="color:red;">{message}</p>
							{/if}
							<button
								class="btn mt-4 bg-success/50 min-h-[2.5rem] h-[2.5rem] w-full border-success/80 hover:border-success/80 hover:bg-success/25"
								name="register1"
								aria-label="Register"
							>
								<iconify-icon icon="ic:round-email" />
								Crear cuenta
							</button>
						</form>
						<p class="text-sm text-accent/70 mx-auto">
							Ya tenes una cuenta?<a
								href="/login"
								class="link link-hover text-sm text-accent font-normal ml-[0.5ch]">Inicia sesion</a
							>
						</p>
						<!-- <dialog id="email" class="modal">
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
												placeholder="john@bbauti.com"
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
										<button class="btn mt-4 btn-neutral" name="loginUser" aria-label="Login">
											<iconify-icon icon="ic:round-email" />
											Iniciar sesion
										</button>
									</form>
									<button
										class="btn btn-ghost btn-sm btn-accent font-normal normal-case mt-2"
										name="registerUser"
										type="button"
										on:click={() => handleTabClick('register')}>No tenes cuenta?</button
									>
								{:else if current === 'register'}
									<h2 class="mt-0">Registro</h2>
									<form method="post" action="?/register" use:enhance>
										<div id="inputs" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
											<div class="form-control mx-auto w-fit">
												<label class="label" for="fullName">
													<span class="label-text">Nombre completo</span>
												</label>
												<input
													class="input input-bordered {success === true
														? 'input-success'
														: success === false
														? 'input-error'
														: ''}"
													type="text"
													name="fullName"
													id="fullName"
													placeholder="John Doe"
													value={form?.fullName ?? ''}
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
													placeholder="john@bbauti.com"
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
										<button class="btn mt-4 btn-neutral" name="register1" aria-label="Register">
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
								<button name="closeee">close</button>
							</form>
						</dialog> -->
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
									class="input input-bordered w-full {codeSuccess === false ? 'input-error' : ''}"
								/>
								{#if codeSuccess === false}
									<label for="code" class="label">
										<span class="label-text text-error text-xs">Codigo incorrecto</span>
									</label>
								{/if}
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

<!-- <section>
	{#if code}
		<section
			id="login"
			class="prose hero min-h-[calc(100dvh-5rem)] max-w-[80vw] lg:max-w-[50ch] mx-auto rounded-box border-accent/[0.02] border-2 shadow-2xl"
		>
			<div class="hero-content text-center flex-col gap-0">
				<img
					class="rounded-3xl shadow-lg"
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
						class="btn btn-accent text-left justify-start font-bold shadow-xl hover:-translate-y-[4px] hover:scale-105"
						on:click={() => signInWithGitHub()}
						on:click={() => toast('Iniciando sesion...')}
					>
						<iconify-icon icon="bi:github" class="icon" />
						Iniciar con GitHub
					</button>
					<button
						class="btn justify-start font-bold shadow-xl hover:-translate-y-[4px] hover:scale-105"
						onclick="email.showModal()"
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
											placeholder="john@bbauti.com"
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
									<button class="btn mt-4 btn-neutral" name="loginUser" aria-label="Login">
										<iconify-icon icon="ic:round-email" />
										Iniciar sesion
									</button>
								</form>
								<button
									class="btn btn-ghost btn-sm btn-accent font-normal normal-case mt-2"
									name="registerUser"
									type="button"
									on:click={() => handleTabClick('register')}>No tenes cuenta?</button
								>
							{:else if current === 'register'}
								<h2 class="mt-0">Registro</h2>
								<form method="post" action="?/register" use:enhance>
									<div id="inputs" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
										<div class="form-control mx-auto w-fit">
											<label class="label" for="fullName">
												<span class="label-text">Nombre completo</span>
											</label>
											<input
												class="input input-bordered {success === true
													? 'input-success'
													: success === false
													? 'input-error'
													: ''}"
												type="text"
												name="fullName"
												id="fullName"
												placeholder="John Doe"
												value={form?.fullName ?? ''}
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
												placeholder="john@bbauti.com"
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
									<button class="btn mt-4 btn-neutral" name="register1" aria-label="Register">
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
							<button name="closeee">close</button>
						</form>
					</dialog>
				</div>
			</div>
		</section>
	{:else}
		<section
			id="login"
			class="prose hero min-h-[calc(100dvh-5rem)] max-w-[80vw] lg:max-w-[50ch] mx-auto rounded-box border-accent/[0.02] border-2 shadow-2xl"
		>
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
				<p class="mt-1 mb-0 font-normal">
					Para poder acceder al servicio, <span class="font-bold">inicia sesion</span>.
				</p>

				<div class="flex flex-col gap-3 mt-0">
					<form
						method="post"
						on:submit|preventDefault={sendCode}
						class="flex flex-col items-center"
					>
						<p class="font-semibold text-xl text-accent">
							Para ingresar, necesitas un
							<span class="underline decoration-primary underline-offset-4">
								codigo de invitacion
							</span>
						</p>
						<div class="form-control w-full max-w-xs">
							<label class="label" for="code">
								<span class="label-text">Codigo</span>
							</label>
							<input
								type="password"
								name="code"
								id="code"
								placeholder="*****"
								class="input input-bordered w-full max-w-xs"
							/>
						</div>
						<button
							type="submit"
							name="send"
							class="btn btn-primary mt-10 shadow-xl hover:-translate-y-[4px] hover:scale-105 btn-wide lg:max-w-fit"
							>Enviar</button
						>
					</form>
				</div>
			</div>
		</section>
	{/if}
</section> -->

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
