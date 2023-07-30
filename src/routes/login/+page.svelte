<script>
	import { toast } from 'svelte-sonner';

	import { blur } from 'svelte/transition';
	import { fade } from 'svelte/transition';

	import { createDialog } from '@melt-ui/svelte';
	import { onMount } from 'svelte';

	import { enhance } from '$app/forms';

	export let form;
	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	let email;
	let password;

	let code = false;

	$: code = data.code;

	let loading = true;

	let selected;

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};

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

	let current = 'login';

	$: message = form?.message;

	$: success = form?.success;

	$: logged = form?.logged;

	$: if (logged) {
		location.reload();
	}

	function handleTabClick(el) {
		current = el;
		success = null;
		message = null;
	}

	onMount(() => {
		loading = false;
		//creo un canvas para la imagen de fondo
		let canvas = document.getElementById('canvas'),
			ctx = canvas.getContext('2d'),
			pic = new Image();

		// dependiendo del width de la pantalla va a ser tener distinto width

		function setCanvasDimensions(context) {
			context.canvas.width = context.canvas.clientWidth;
			context.canvas.height = context.canvas.clientHeight;
		}

		function getImageSize(context, image) {
			let canvasWidth = context.canvas.width,
				canvasHeight = context.canvas.height,
				canvasRatio = canvasHeight / canvasWidth,
				imageWidth = image.naturalWidth,
				imageHeight = image.naturalHeight,
				imageRatio = imageHeight / imageWidth,
				widthValue = imageRatio > canvasRatio ? canvasWidth : canvasHeight / imageRatio,
				heightValue = imageRatio > canvasRatio ? canvasWidth * imageRatio : canvasHeight,
				adjX = imageRatio > canvasRatio ? 0 : (canvasWidth - widthValue) / 2,
				adjY = imageRatio > canvasRatio ? (canvasHeight - heightValue) / 2 : 0;

			return {
				width: widthValue,
				height: heightValue,
				offsetX: adjX,
				offsetY: adjY
			};
		}

		//imrpime la image

		function drawSizedImage(context, image) {
			let { offsetX, offsetY, width, height } = getImageSize(context, image);
			context.drawImage(pic, offsetX, offsetY, width, height);
		}

		setCanvasDimensions(ctx);
		pic.src = '/login.svg';

		// al cargar la imagen la imprime

		pic.onload = function () {
			drawSizedImage(ctx, this);
		};

		//cada vez que cambia el width de la pagina se cambia el size de la imagen

		window.addEventListener(
			'resize',
			() => {
				setCanvasDimensions(ctx);
				drawSizedImage(ctx, pic);
			},
			false
		);
	});

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="grain" />

{#if loading}
	<div
		class="fixed flex items-center bg-base-100 justify-center z-[500] h-[100dvh] w-[100dvw]"
		out:fade
	>
		<span class="loading loading-spinner loading-lg" />
	</div>
{/if}

<section class="flex items-center justify-center min-h-[100dvh]">
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
</section>
<canvas id="canvas" in:blur />

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

	.grain {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
		z-index: 49;
		transform: translateZ(0);
	}
	.grain:before {
		content: '';
		top: -10rem;
		left: -10rem;
		width: calc(100% + 20rem);
		height: calc(100% + 20rem);
		z-index: 49;
		position: fixed;
		background-image: url('/noise.webp');
		opacity: 0.05;
		pointer-events: none;
		-webkit-animation: noise 1s steps(2) infinite;
		animation: noise 1s steps(2) infinite;
	}

	#canvas {
		position: fixed;
		z-index: -10;
		top: 0;
		left: 0;
		width: 100dvw;
		height: 100dvh;
		opacity: 0.5;
		display: block;
	}

	@-webkit-keyframes noise {
		to {
			transform: translate3d(-7rem, 0, 0);
		}
	}

	@keyframes noise {
		0% {
			transform: translate3d(0, 9rem, 0);
		}
		10% {
			transform: translate3d(-1rem, -4rem, 0);
		}
		20% {
			transform: translate3d(-8rem, 2rem, 0);
		}
		30% {
			transform: translate3d(9rem, -9rem, 0);
		}
		40% {
			transform: translate3d(-2rem, 7rem, 0);
		}
		50% {
			transform: translate3d(-9rem, -4rem, 0);
		}
		60% {
			transform: translate3d(2rem, 6rem, 0);
		}
		70% {
			transform: translate3d(7rem, -8rem, 0);
		}
		80% {
			transform: translate3d(-9rem, 1rem, 0);
		}
		90% {
			transform: translate3d(6rem, -5rem, 0);
		}
		to {
			transform: translate3d(-7rem, 0, 0);
		}
	}
</style>
