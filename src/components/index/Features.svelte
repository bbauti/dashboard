<script>
	const features = [
		{
			image: '/features-grid/stock.webp',
			icon: 'fluent:box-20-filled',
			title: 'Controla tu stock.',
			desc: 'Modifica los productos que vos quieras.'
		},
		{
			image: '/features-grid/taxes.webp',
			icon: 'heroicons-solid:receipt-tax',
			title: 'Gestiona tus impuestos.',
			desc: 'Mantene los impuestos siempre actualizados.'
		},
		{
			image: '/features-grid/team.webp',
			icon: 'fluent:people-team-20-filled',
			title: 'Registro de Personal.',
			desc: 'Permanece al corriente de tus empleados.'
		},
		{
			image: '/features-grid/sales.webp',
			icon: 'material-symbols:shopping-cart',
			title: 'Compras simplificadas.',
			desc: 'Procesa los precios y pagos facilmente.'
		},
		{
			image: '/features-grid/sells.webp',
			icon: 'fluent:list-28-filled',
			title: 'Análisis de ventas.',
			desc: 'No te pierdas ninguna transaccion.'
		},
		{
			image: '/features-grid/notif.webp',
			icon: 'heroicons-solid:receipt-tax',
			title: 'Notificaciones del stock.',
			desc: 'Controla la disponibilidad de tus productos.'
		}
	];
</script>

<div class="grid md:grid-cols-2 lg:grid-cols-3 mx-auto gap-5 w-fit py-10">
	<!-- {#each Array(6) as _, index (index)} -->
	{#each features as item}
		<div
			class="max-w-[35ch] w-[35ch] rounded-box overflow-hidden border border-accent/20 h-fit card"
		>
			<div
				class="image"
				style="background: linear-gradient( 0deg, rgba(0, 0, 0, 0.616) 2%, rgba(0, 0, 0, 0.171) 40%, rgba(255, 255, 255, 0) 70% ), url({item.image}); background-repeat: no-repeat; background-position: center; background-size: cover;"
			/>
			<div class="border-t border-accent/10 bg-accent/5 text h-[8ch] flex flex-col justify-center">
				<h1 class="w-full inline-flex items-center justify-center gap-[0.5ch] font-semibold">
					<iconify-icon icon={item.icon} />
					{item.title}
				</h1>
				<p class="text-sm w-full text-center text-accent/80">
					{item.desc}
				</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.image {
		height: 20ch;
		margin: 10px;
		margin-bottom: 0;
		border-radius: 10px 10px 0 0;
		background: linear-gradient(
				0deg,
				rgba(0, 0, 0, 0.616) 2%,
				rgba(0, 0, 0, 0.171) 40%,
				rgba(255, 255, 255, 0) 70%
			),
			url('/screen.png');
		/* -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.192) 1%, black 95%);
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.192) 1%, black 95%); */
		filter: brightness(80%);
		transition: all 0.2s linear;
	}

	.card:hover > .image {
		filter: brightness(100%);
	}

	.text {
		margin: 3px;
		border-radius: 5px 5px 13px 13px;
		box-shadow: inset 0px -10px 50px -10px rgba(255, 255, 255, 0.075);
		transition: all 0.2s ease-in-out;
	}

	.card:hover > .text {
		box-shadow: inset 0px -10px 50px -10px rgba(255, 255, 255, 0.11);
	}

	h1 > iconify-icon {
		transition: all 0.2s ease-in-out;
	}

	.card:hover > .text > h1 > iconify-icon {
		transition: all 0.2s ease-in-out;
		transform: rotate(-10deg);
	}
</style>
