<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { blur } from 'svelte/transition';
	import { goto } from '$app/navigation';

	import Features from '../components/index/Features.svelte';
	import OpenSource from '../components/index/OpenSource.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let y;

	let loading = true;

	onMount(() => {
		if (session) {
			goto('/app/');
		}
		// por cada boton, compruebo si el mouse se mueve, y si es asi, le paso las coords al css
		document.querySelectorAll('.button').forEach((button) => {
			const bounding = button.getBoundingClientRect();
			button.addEventListener('mousemove', (e) => {
				let dy = (e.clientY - bounding.top - bounding.height / 2) / -1;
				let dx = (e.clientX - bounding.left - bounding.width / 2) / 10;

				dy = dy > 10 ? 10 : dy < -10 ? -10 : dy;
				dx = dx > 4 ? 4 : dx < -4 ? -4 : dx;

				button.style.setProperty('--rx', dy);
				button.style.setProperty('--ry', dx);
			});

			button.addEventListener('mouseleave', (e) => {
				button.style.setProperty('--rx', 0);
				button.style.setProperty('--ry', 0);
			});
		});

		loading = false;
	});
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<svelte:window bind:scrollY={y} />

{#if loading}
	<div
		class="fixed flex items-center bg-base-100 justify-center z-[500] h-[100dvh] w-[100dvw]"
		out:fade
	>
		<span class="loading loading-spinner loading-lg" />
	</div>
{/if}
<div class="w-screen">
	<div class="w-full h-screen absolute z-0 blur-[200px] opacity-40 overflow-hidden">
		<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
			<path
				fill="#c930c4"
				d="M43.4,-72.7C54.9,-68.6,61.9,-54.1,68.8,-40.3C75.8,-26.5,82.8,-13.2,81.5,-0.7C80.2,11.8,70.7,23.5,62.9,36C55.1,48.4,49.1,61.5,38.9,71.4C28.7,81.4,14.4,88.2,0.7,86.9C-12.9,85.6,-25.8,76.3,-39.9,68.7C-54.1,61,-69.4,55,-77.6,43.8C-85.7,32.6,-86.7,16.3,-86.3,0.2C-85.9,-15.9,-84.2,-31.7,-77.3,-45.1C-70.4,-58.4,-58.3,-69.3,-44.6,-72.2C-30.8,-75,-15.4,-70,0.3,-70.4C16,-70.9,31.9,-76.9,43.4,-72.7Z"
				transform="translate(250 0)"
			/>
		</svg>
	</div>
	<div class="w-full h-screen absolute z-0 blur-[120px] opacity-30 overflow-hidden">
		<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
			<path
				fill="#30c9b2"
				d="M43.4,-72.7C54.9,-68.6,61.9,-54.1,68.8,-40.3C75.8,-26.5,82.8,-13.2,81.5,-0.7C80.2,11.8,70.7,23.5,62.9,36C55.1,48.4,49.1,61.5,38.9,71.4C28.7,81.4,14.4,88.2,0.7,86.9C-12.9,85.6,-25.8,76.3,-39.9,68.7C-54.1,61,-69.4,55,-77.6,43.8C-85.7,32.6,-86.7,16.3,-86.3,0.2C-85.9,-15.9,-84.2,-31.7,-77.3,-45.1C-70.4,-58.4,-58.3,-69.3,-44.6,-72.2C-30.8,-75,-15.4,-70,0.3,-70.4C16,-70.9,31.9,-76.9,43.4,-72.7Z"
				transform="translate(180 0)"
			/>
		</svg>
	</div>
	<div class="w-full h-screen absolute z-0 blur-[80px] opacity-10 overflow-hidden">
		<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
			<path
				fill="#30c9b2"
				d="M43.4,-72.7C54.9,-68.6,61.9,-54.1,68.8,-40.3C75.8,-26.5,82.8,-13.2,81.5,-0.7C80.2,11.8,70.7,23.5,62.9,36C55.1,48.4,49.1,61.5,38.9,71.4C28.7,81.4,14.4,88.2,0.7,86.9C-12.9,85.6,-25.8,76.3,-39.9,68.7C-54.1,61,-69.4,55,-77.6,43.8C-85.7,32.6,-86.7,16.3,-86.3,0.2C-85.9,-15.9,-84.2,-31.7,-77.3,-45.1C-70.4,-58.4,-58.3,-69.3,-44.6,-72.2C-30.8,-75,-15.4,-70,0.3,-70.4C16,-70.9,31.9,-76.9,43.4,-72.7Z"
				transform="translate(250 250)"
			/>
		</svg>
	</div>
</div>
<main class="bg-primary/[0.03]">
	<header
		class="flex items-center pt-24 lg:pt-0 lg:justify-center flex-col h-screen p-10 overflow z-10"
	>
		<h1 class="text-center mb-10">
			<span class="magic"
				><span class="magic-text text-4xl lg:text-6xl font-bold">Potencia tu comercio.</span></span
			>
		</h1>
		<h2 class="prose text-balance text-center text-lg lg:text-xl z-10">
			Nuestro Dashboard te ofrece la libertad de gestionar ventas, calcular precios y mantener tu
			inventario siempre actualizado. Simplifica tus tareas diarias y concéntrate en lo que más
			importa: <span class="font-semibold text-accent/70 underline decoration-secondary/50"
				>hacer crecer tu negocio</span
			>.
		</h2>
		<div class="mt-10">
			<a class="button" href="/login">
				<span>Proba Punto Bazar. Gratis!</span>
			</a>
		</div>
		{#if y < 50}
			<div
				transition:fade
				class="absolute bottom-14 text-2xl bg-secondary/40 w-10 h-10 flex items-center justify-center rounded-xl float"
			>
				<iconify-icon icon="mingcute:arrow-down-fill" />
			</div>
		{/if}
	</header>
	<section class="z-10">
		<h1 class="text-center text-3xl font-bold mx-5">Características</h1>
		<Features />
	</section>
	<section class="z-10 mt-10">
		<h1 class="text-center text-3xl font-bold mx-5">Creemos en lo Open Source</h1>
		<h2 class="text-center text-xl font-semibold mx-5 my-3">
			Por eso, podes hostear vos mismo este dashboard!
		</h2>
		<OpenSource />
	</section>
	<section class="z-10 bg-accent/5 py-10 documentation">
		<h1 class="text-center text-3xl font-bold mx-5">Te quedó alguna duda?</h1>
		<h2 class="text-center text-xl font-semibold mx-5 my-3">Visita la wiki!</h2>
		<div class="mx-auto w-fit p-10">
			<a class="btn btn-wide btn-accent" href="https://github.com/bbauti/dashboard/wiki/Inicio">
				<iconify-icon icon="octicon:link-16" />
				Ir a la documentacion
				<iconify-icon icon="mdi:pickaxe" />
			</a>
		</div>
	</section>
</main>

<style>
	:root {
		--purple: rgb(123, 31, 162);
		--violet: rgb(103, 58, 183);
		--pink: rgb(244, 143, 177);
	}

	h1 > .magic {
		display: inline-block;
		position: relative;
	}

	h1 > .magic > .magic-text {
		animation: background-pan 3s linear infinite;
		background: linear-gradient(to right, var(--purple), var(--violet), var(--pink), var(--purple));
		background-size: 200%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.button {
		--background: #1df05c;
		--color: #131313;
		--shadow: rgba(0, 9, 61, 0.24);
		--z-before: -6;
		display: block;
		outline: none;
		cursor: pointer;
		position: relative;
		border: 0;
		background: none;
		padding: 9px 22px 9px 22px;
		line-height: 26px;
		font-family: inherit;
		font-weight: 600;
		font-size: 14px;
		color: var(--color);
		-webkit-appearance: none;
		-webkit-tap-highlight-color: transparent;
		transition: transform var(--transform-duration, 0.4s);
		will-change: transform;
		transform-style: preserve-3d;
		transform: perspective(240px) rotateX(calc(var(--rx, 0) * 1deg))
			rotateY(calc(var(--ry, 0) * 1deg)) translateZ(0);
	}

	.button:hover {
		--transform-duration: 0.16s;
	}

	.button:before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		border-radius: 12px;
		transform: translateZ(calc(var(--z-before) * 1px));
		background: var(--background);
		box-shadow: 0 4px 8px var(--shadow);
	}

	.float {
		animation: float 4s ease infinite;
	}

	.documentation {
		box-shadow: inset 0 20px 20px -20px rgba(0, 0, 0, 0.664);
	}

	@keyframes float {
		0% {
			transform: translatey(0px);
		}
		50% {
			transform: translatey(-10px);
		}
		100% {
			transform: translatey(0px);
		}
	}

	@media only screen and (max-width: 600px) {
		.button {
			padding: 12px 25px 12px 25px;
			line-height: 32px;
			font-size: 18px;
		}
	}

	@keyframes background-pan {
		from {
			background-position: 0% center;
		}

		to {
			background-position: -200% center;
		}
	}

	@keyframes scale {
		from,
		to {
			transform: scale(0);
		}

		50% {
			transform: scale(1);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(180deg);
		}
	}
</style>
