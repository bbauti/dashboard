<script>
	const guide = [
		{
			title: 'Guarda el proyecto',
			steps: [
				{
					desc: 'Clona el repositorio',
					code: 'git clone https://github.com/bbauti/dashboard.git'
				},
				{
					desc: `Agrega las 
                        <a 
                            href='https://github.com/bbauti/dashboard#-api-keys' 
                            class='text-accent underline decoration-primary/50 decoration-2 underline-offset-2'
                        >
							Variables de entorno
						</a>`
				},
				{
					desc: 'Instala los paquetes',
					code: 'npm install'
				}
			]
		},
		{
			title: 'Modifica el dashboard',
			steps: [
				{
					desc: 'Inicia el entorno de desarrollo',
					code: 'npm run dev'
				},
				{
					desc: 'Edita el codigo a tu gusto'
				}
			]
		},
		{
			title: 'Subi los cambios',
			steps: [
				{
					desc: 'Genera la version de produccion',
					code: 'npm run build'
				},
				{
					desc: 'Proba el resultado final',
					code: 'npm run preview'
				},
				{
					desc: 'Subi los cambios a tu servidor, y listo!'
				}
			]
		}
	];
</script>

<div class="grid sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-5 w-fit py-10">
	{#each guide as item, index}
		<article
			class="h-fit w-[32ch] rounded-box bg-accent/5 border border-accent/20 overflow-hidden p-3"
		>
			<header class="flex items-center gap-5">
				<div
					class="bg-accent/20 w-10 h-10 text-2xl flex items-center justify-center font-bold rounded-lg"
				>
					{index + 1}
				</div>
				<div>{item.title}</div>
			</header>
			<section class="mt-5 mb-0 flex flex-col gap-4">
				{#each item.steps as step}
					<div>
						<div class="flex">
							<iconify-icon icon="bxs:right-arrow" class="mt-[0.3rem] mr-[0.5rem] text-accent/40" />
							<p>{@html step.desc}</p>
						</div>
						{#if step.code}
							<div
								class="mt-1 w-full bg-accent/10 rounded-md p-1 pl-3 inline-flex overflow-auto codediv"
							>
								<p class="mr-2 select-none cursor-default">$</p>
								<code class="whitespace-nowrap">{step.code}</code>
							</div>
						{/if}
					</div>
				{/each}
			</section>
		</article>
	{/each}
</div>

<style>
	.codediv {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.codediv::-webkit-scrollbar {
		display: none;
	}
</style>
