<script>
	import { toast } from 'svelte-sonner';

	import { fly } from 'svelte/transition';

	import { fade } from 'svelte/transition';

	import { enhance } from '$app/forms';
	export let form;
	export let data;

	let ide;
	let { datos, supabase } = data;
	$: ({ datos, supabase } = data);
	let producto = '';
	let amount = 0;
	let value;
	let current;
	$: success = form?.success;
	let currentPage = 1;
	const perPage = 8;
	let pageData = [];
	let loading = true;
	let next;

	async function loadData() {
		const { data: newData, error } = await supabase
			.from('stock')
			.select()
			.range((currentPage - 1) * perPage, currentPage * perPage - 1); //esto ni idea bien que hace, es un copy je
		if (error) {
			console.error(error);
			return;
		}
		if (newData.length < perPage) {
			next = false;
		} else {
			next = true;
		}
		pageData = newData;
		loading = false;
	}

	loadData();

	function nextPage() {
		loading = true;
		pageData = [];
		currentPage++;
		loadData();
	}

	function prevPag() {
		if (currentPage > 1) {
			loading = true;
			pageData = [];
			currentPage--;
			loadData();
		}
	}
</script>

<svelte:head>
	<title>Stock</title>
</svelte:head>

<!-- Modal -->
<dialog id="crear" class="modal">
	<div class="modal-box w-fit">
		<form method="dialog">
			<button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2" name="closeModal"
				><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
			>
		</form>
		<form method="post" action="?/addProduct" class="prose" use:enhance>
			<h2>Crea un producto</h2>
			<label for="producto"><h3>Nombre</h3></label>
			<input
				type="text"
				class="input input-bordered {success === true
					? 'input-success'
					: success === false
					? 'input-error'
					: ''}"
				name="producto"
				id="producto"
				placeholder="nombre"
				bind:value={producto}
			/> <br />
			<label for="value"><h3>Precio</h3></label>
			<input
				type="number"
				class="input input-bordered {success === true
					? 'input-success'
					: success === false
					? 'input-error'
					: ''}"
				name="value"
				id="value"
				placeholder="$$$$$$"
				bind:value
			/> <br />
			<label for="amount"><h3>Cantidad</h3></label>
			<input
				type="number"
				class="input input-bordered{success === true
					? 'input-info'
					: success === false
					? 'input-error'
					: ''}"
				name="amount"
				id="amount"
				bind:value={amount}
			/> <br />
			<button name="addProduct" type="submit" class="btn btn-primary font-normal normal-case mt-2"
				><iconify-icon icon="twemoji:plus" id="mail" class="icon" />
			</button>
			<button name="reset" type="reset" class="btn btn-error font-normal normal-case mt-2"
				><iconify-icon icon="fluent:arrow-reset-48-regular" id="mail" class="icon" />
			</button>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button name="close">close</button>
	</form>
</dialog>
<!-- Modal update -->
<dialog id="update" class="modal">
	<div class="modal-box w-fit">
		<form method="dialog">
			<button name="closeModal" class="btn btn-sm btn-square btn-ghost absolute right-2 top-2"
				><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
			>
		</form>
		<form method="post" action="?/updateProduct" class="prose" use:enhance>
			<h2>Actualizar</h2>
			<label for="producto"><h3>Nombre</h3></label>
			<input
				type="text"
				id="producto"
				class="input input-bordered {success === true
					? 'input-success'
					: success === false
					? 'input-error'
					: ''}"
				name="producto"
				placeholder="nombre"
				bind:value={producto}
			/>
			<label for="value"><h3>Precio</h3></label>
			<input
				type="number"
				class="input input-bordered {success === true
					? 'input-success'
					: success === false
					? 'input-error'
					: ''}"
				name="value"
				id="value"
				placeholder="$$$$$$"
				bind:value
			/>
			<input style="display:none;" type="text" id="ide" name="ide" bind:value={current} /><br />
			<label for="amount"><h3>Cantidad</h3></label>
			<input
				type="number"
				class="input input-bordered{success === true
					? 'input-primary'
					: success === false
					? 'input-error'
					: ''}"
				name="amount"
				id="amount"
				bind:value={producto.quantity}
			/> <br />
			<button name="submit" type="submit" class="btn btn-primary font-normal normal-case mt-2"
				><iconify-icon icon="mingcute:pencil-2-fill" id="mail" class="icon" />
			</button>
			<button name="reset" type="reset" class="btn btn-error font-normal normal-case mt-2"
				><iconify-icon icon="fluent:arrow-reset-48-regular" id="mail" class="icon" />
			</button>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button name="closeModal">close</button>
	</form>
</dialog>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">CONTROL DE <strong>STOCK</strong></h1>
			<p class="py-6 underline">
				Aca vas a poder: Crear, Modificar,Eliminar o Agregar cualquier producto que necesites.
			</p>
			<a class="btn btn-primary" href="#footer">llevame a la <strong>tabla</strong></a>
		</div>
	</div>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th />

				<th class="text-lg text-right">Producto</th>

				<th class="text-lg text-center">Cantidades</th>
				<th class="text-lg text-left"> Precio</th>
				<th>
					<button name="openModal" class="btn justify-start font-bold" onclick="crear.showModal()"
						><iconify-icon icon="twemoji:plus" id="mail" class="icon" /></button
					>
				</th>
				<th />
			</tr>
		</thead>
		<tbody>
			<!-- row 1 -->
			{#if pageData.length > 0}
				{#each pageData as producto}
					<tr>
						<th>
							<label class="text-right">
								<form method="post" action="?/deleteProduct">
									<input
										style="display:none;"
										type="text"
										id="ide"
										name="ide"
										bind:value={producto.id}
									/>
									<input
										type="submit"
										class="p-3 bg-error text-lg"
										aria-label="deleteproduct"
										value="&#128465;"
									/>
								</form>
							</label>
						</th>
						<td class="text-right text-base font-bold">
							{producto.product}
						</td>
						<td class="text-center text-base font-bold">
							{producto.quantity}
						</td>
						<td class="text-left text-base font-semibold">${producto.value}</td>
						<td>
							<button
								name="openModal"
								class="btn justify-left bg-primary font-bold"
								on:click={() => (current = producto.id)}
								onclick="update.showModal()"
								><iconify-icon icon="mingcute:pencil-2-fill" id="mail" class="icon" /></button
							>
						</td>
					</tr>
				{/each}
			{/if}
			<!-- foot -->
		</tbody><tfoot>
			<tr>
				<th />
				<th id="footer">name</th>
				<th>
					<div class="join">
						{#if currentPage > 1}
							<button name="next" on:click={() => prevPag()} class="join-item btn">«</button>
						{/if}
						{#if next === true}
							<button name="prev" on:click={() => nextPage()} class="join-item btn">»</button>
						{/if}

						{#if loading}
							<button name="loading" class="join-item btn"
								><span class="loading loading-spinner loading-xl" /></button
							>
						{/if}
					</div>
				</th>
				<th />
			</tr>
		</tfoot>
	</table>
</div>
