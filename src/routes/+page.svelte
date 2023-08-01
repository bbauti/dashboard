<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { blur } from 'svelte/transition';
	import { goto } from '$app/navigation';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

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
		pic.src = '/home.svg';

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

		loading = false;
	});
</script>

<svelte:head>
	<title>Dashboard</title>
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

<header class="flex items-center justify-center flex-col h-[100dvh] p-10">
	<h1 class="text-center mb-10">
		<span class="magic"
			><span class="magic-text text-4xl lg:text-6xl font-bold"
				>Potencia tu comercio con nosotros</span
			></span
		>
	</h1>
	<h2 class="prose text-balance text-center text-lg lg:text-2xl">
		Nuestro Dashboard te ofrece la libertad de gestionar ventas, calcular precios y mantener tu
		inventario siempre actualizado. Simplifica tus tareas diarias y concéntrate en lo que más
		importa: <span class="font-semibold text-accent underline">hacer crecer tu negocio</span>.
	</h2>
	<div class="mt-10">
		<a class="button" href="/login">
			<span>Iniciar sesion</span>
		</a>
	</div>
</header>
<canvas id="canvas" in:blur />

<style>
	:root {
		--purple: rgb(123, 31, 162);
		--violet: rgb(103, 58, 183);
		--pink: rgb(244, 143, 177);
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

	@media only screen and (max-width: 600px) {
		.button {
			padding: 12px 25px 12px 25px;
			line-height: 32px;
			font-size: 18px;
		}
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
