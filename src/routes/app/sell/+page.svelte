<script>
	export let data;

	import { formatMoney } from '$lib/helpers';

	import { onMount, beforeUpdate } from 'svelte';
	import { writable } from 'svelte/store';

	let { supabase, taxes } = data;
	$: ({ supabase, taxes } = data);

	// Products grid

	let currentPage = 1;
	let perPage = '6';
	let pageData = [];
	let loading = true;
	let next;
	let totalPages;
	let isSearch = false;

	let backup = [];

	$: if (pageData.length > 0) {
		console.log(backup);
		backup = pageData.slice();
	}

	let products = [];
	let uniqueProducts = [];

	// Payment

	let finalPrice = 0;
	let cuotas = 1;
	let precioFinalImp = 0;

	// Taxes

	let envio = taxes.find((item) => item.tax === 'shipping').amount;
	let iva = taxes.find((item) => item.tax === 'iva').amount;

	// Cuotas

	let cuotas3 = taxes.find((item) => item.tax === '3cuotas').amount;
	let cuotas6 = taxes.find((item) => item.tax === '6cuotas').amount;
	let cuotas12 = taxes.find((item) => item.tax === '12cuotas').amount;
	let cuotas18 = taxes.find((item) => item.tax === '18cuotas').amount;
	let cuotas24 = taxes.find((item) => item.tax === '24cuotas').amount;

	// Loads data

	async function loadData() {
		loading = true;
		const { data: newData, count: cant } = await supabase
			.from('stock')
			.select('*', { count: 'exact' })
			.range((currentPage - 1) * parseInt(perPage), currentPage * parseInt(perPage) - 1)
			.order('id', { ascending: true });
		if (newData.length < parseInt(perPage)) {
			next = false;
			totalPages = currentPage;
		} else {
			next = true;
			totalPages = Math.ceil(cant / parseInt(perPage));
		}
		pageData = newData;
		loading = false;
		isSearch = false;
	}

	loadData();

	// Searchs for data in the DB

	async function searchData(input) {
		loading = true;
		let inputEl = document.getElementById('search');
		if (input === '') {
			inputEl.style.border = '1px solid red';
			loading = false;
			return;
		}
		inputEl.style.removeProperty('border');
		const { data: newData, count: cant } = await supabase
			.from('stock')
			.select('*', { count: 'exact' })
			.textSearch('product', `'${input}'`);
		pageData = newData;
		isSearch = true;
		loading = false;
	}

	// Goes to the next page and redraws grid

	function nextPage() {
		loading = true;
		pageData = [];
		currentPage++;
		loadData();
	}

	// Goes to the previous page and redraws grid

	function prevPage() {
		if (currentPage > 1) {
			loading = true;
			pageData = [];
			currentPage--;
			loadData();
		}
	}

	// Goes to the first page and redraws grid

	function goToFirstPage() {
		if (currentPage > 1) {
			loading = true;
			pageData = [];
			currentPage = 1;
			loadData();
		}
	}

	// Goes to the last page and redraws grid

	function goToLastPage() {
		if (currentPage < totalPages) {
			loading = true;
			pageData = [];
			currentPage = totalPages;
			loadData();
		}
	}

	// Goes to a especific page and redraws grid

	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			loading = true;
			pageData = [];
			currentPage = page;
			loadData();
		}
	}

	// Updates the visual part of the selected products

	function updateContent(product) {
		let productEl = document.getElementById(product.id);
		let productDiv = document.getElementById('div' + product.id);
		let productQuant = document.getElementById('amount' + product.id);
		let productSelectedQuant = document.getElementById('quant' + product.id);

		if (!productEl) {
			return;
		}
		if (getAmount(product) === 0) {
			productEl.classList.remove('border', 'border-white');
			productSelectedQuant.remove();
			return;
		}
		if (!productEl.classList.contains('border', 'border-white')) {
			productEl.classList.add('border', 'border-white');
		}
		if (productSelectedQuant) {
			productSelectedQuant.textContent = getAmount(product);
		} else {
			let quant = document.createElement('p');
			quant.textContent = getAmount(product);
			quant.setAttribute('id', 'quant' + product.id);
			quant.className = 'absolute top-2 right-5 text-2xl font-semibold';
			productDiv.appendChild(quant);
		}
	}

	// Adds a product to the cart

	function addProduct(product) {
		if (product.quantity < 1) {
			return;
		}
		let productQuant = document.getElementById('amount' + product.id);
		if (productQuant) {
			productQuant.textContent = parseInt(productQuant.textContent) - 1;
		}
		product.quantity--;
		products.push(product);
		products = products;
		uniqueProducts = [...new Set(products)];
		getFinalPrice();
		updateContent(product);
	}

	// Removes a product to the cart

	function removeProduct(product) {
		if (!products.includes(product)) {
			return;
		}
		let productQuant = document.getElementById('amount' + product.id);
		if (productQuant) {
			productQuant.textContent = parseInt(productQuant.textContent) + 1;
		}
		let productToDelete = products.findIndex((el) => el.id === product.id);
		product.quantity++;
		products.splice(productToDelete, 1);
		uniqueProducts = [...new Set(products)];
		getFinalPrice();
		updateContent(product);
	}

	// Deletes all the products with the same id from the cart

	function deleteProduct(product) {
		if (!products.includes(product)) {
			return;
		}
		products = products.filter((item) => item.id !== product.id);
		products = products;
		uniqueProducts = [...new Set(products)];
		getFinalPrice();
		updateContent(product);
	}

	//Get amount of duplicated products on the cart

	function getAmount(product) {
		let count = 0;
		products.forEach((el) => {
			if (el.id === product.id) {
				count++;
			}
		});
		return count;
	}

	// Gets the subtotal of the cart

	function getFinalPrice() {
		let price = 0;
		products.forEach((el) => {
			price = price + el.value;
		});
		finalPrice = price;
	}

	function getDecimal(number) {
		number = number.toString().split('.')[1];
		if (number.length < 2) {
			return number + '0';
		}
		return number;
	}

	// Resets the selected products and price

	async function updateProducts(arr) {
		const formData = new URLSearchParams();
		formData.append(`products`, JSON.stringify(arr));
		formData.append('price', precioFinalImp);
		const response = await fetch('?/updateProducts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formData.toString()
		});
		const data = await response.json();
	}

	async function processPayment() {
		products.forEach((product) => {
			deleteProduct(product);
		});
		products = [];
		uniqueProducts = [];
		cuotas = 0;
		finalPrice = 0;
		precioFinalImp = 0;
	}

	$: precioFinalImp = formatMoney(
		finalPrice +
			finalPrice * iva +
			500 +
			(finalPrice + finalPrice * iva + 500) *
				(cuotas === 3
					? cuotas3
					: cuotas === 6
					? cuotas6
					: cuotas === 12
					? cuotas12
					: cuotas === 18
					? cuotas18
					: cuotas === 24
					? cuotas24
					: 0)
	);
</script>

<svelte:head>
	<title>Carrito</title>
</svelte:head>

<section class="bg-neutral w-full p-5 min-h-screen">
	<div class="bg-base-100 rounded-box min-h-[calc(100vh-6rem)] py-6 shadow-2xl shadow-primary/5">
		<header class="relative">
			<!-- TODO temporal pagination fix -->
			{#if currentPage !== totalPages}
				<select
					name="perPage"
					id="perPage"
					class="select select-primary w-full max-w-[5rem] absolute top-0 right-6"
					bind:value={perPage}
					on:change={() => loadData()}
				>
					<option value="3">3</option>
					<option selected={perPage === '6'} value="6">6</option>
					<option value="9">9</option>
					<option value="12">12</option>
				</select>
			{/if}
			<h1 class="font-semibold pt-0 lg:pt-10 pb-5 text-center text-4xl max-w-[12rem] lg:max-w-none">
				Calcular precios
			</h1>
		</header>
		<section class="mt-5 flex justify-center items-end gap-2">
			<div class="form-control max-w-[10rem] lg:max-w-none">
				<label class="label" for="search">
					<span class="label-text text-lg pl-[0.8rem]">Busqueda</span>
				</label>
				<input
					type="text"
					class="input input-bordered"
					disabled={loading}
					name="search1"
					id="search"
				/>
			</div>
			{#if loading}
				<button class="btn" disabled name="sendDisabled">Enviar</button>
			{:else}
				<button
					class="btn"
					name="send2"
					on:click={() => searchData(document.getElementById('search').value)}>Enviar</button
				>
			{/if}
			{#if isSearch}
				<button
					class="btn btn-square btn-error"
					name="search2"
					on:click={() => {
						loadData();
						document.getElementById('search').value = '';
					}}
				>
					<iconify-icon icon="lucide:x" />
				</button>
			{/if}
		</section>

		{#if pageData.length > 0}
			<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 m-10">
				{#each pageData as item, index}
					<div
						id={item.id}
						class="card bg-base-200 shadow-xl transition ease-in-out hover:scale-[1.001] hover:-translate-y-[2px] {getAmount(
							item
						) !== 0
							? 'border border-white selected'
							: ''}"
					>
						<div id="div{item.id}" class="relative">
							{#if getAmount(item) > 0}
								<p id="quant{item.id}" class="absolute top-2 right-5 text-2xl font-semibold">
									{getAmount(item)}
								</p>
							{:else if item.quantity < 1}
								<p
									id="quant{item.id}"
									class="absolute top-2 right-5 text-error text-xl font-semibold"
								>
									Sin stock
								</p>
							{/if}
						</div>
						<div class="card-body">
							<h2 class="card-title">{item.product}</h2>
							<p
								class="btn btn-xs cursor-default w-fit btn-secondary capitalize no-animation hover:none"
							>
								Stock: <span id="amount{item.id}">{item.quantity}</span>
							</p>
							<div class="card-actions flex justify-between mt-5">
								<div class="flex gap-2">
									<button
										name="add2"
										class="btn btn-primary btn-square"
										disabled={item.quantity < 1}
										on:click={addProduct(item)}>+</button
									>
									<button
										name="remove2"
										class="btn btn-outline btn-square btn-error"
										on:click={removeProduct(item)}
										disabled={item.quantity < 1}>-</button
									>
								</div>
								<button name="price" class="btn btn-neutral cursor-default no-animation hover:none"
									>{formatMoney(item.value)}</button
								>
							</div>
						</div>
					</div>
				{/each}
			</section>
		{:else if loading}
			<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 m-10">
				{#each backup as item, index}
					<div id={item.id} class="card bg-base-200 shadow-xl">
						<div id="div{item.id}" class="relative">
							{#if getAmount(item) > 0}
								<p id="quant{item.id}" class="absolute top-2 right-5 text-2xl font-semibold">
									{getAmount(item)}
								</p>
							{:else if item.quantity < 1}
								<p
									id="quant{item.id}"
									class="absolute top-2 right-5 text-error text-xl font-semibold"
								>
									Sin stock
								</p>
							{/if}
						</div>
						<div class="card-body">
							<h2 class="card-title">{item.product}</h2>
							<p
								class="btn btn-xs cursor-default w-fit btn-secondary capitalize no-animation hover:none"
							>
								Stock: <span id="amount{item.id}">{item.quantity}</span>
							</p>
							<div class="card-actions flex justify-between mt-5">
								<div class="flex gap-2">
									<button name="add" class="btn btn-primary btn-square" disabled>+</button>
									<button name="remove" class="btn btn-outline btn-square btn-error" disabled
										>-</button
									>
								</div>
								<button name="price" class="btn btn-neutral cursor-default no-animation hover:none"
									>{formatMoney(item.value)}</button
								>
							</div>
						</div>
					</div>
				{/each}
			</section>
		{:else if pageData.length <= 0 && !loading}
			<div class="prose">
				<h1>No se encontraron resultados</h1>
			</div>
		{/if}

		{#if !isSearch}
			<div class="flex justify-center gap-1 lg:gap-2 mt-5 mb-10">
				<button
					name="firstPageData"
					on:click={goToFirstPage}
					disabled={currentPage === 1}
					class="btn">1</button
				>
				<button
					name="prevPage"
					on:click={prevPage}
					disabled={currentPage === 1}
					class="btn max-w-[1rem] lg:max-w-none"><iconify-icon icon="typcn:arrow-left" /></button
				>
				{#if currentPage >= 2}
					<button name="pageBeforeData" on:click={() => goToPage(currentPage - 1)} class="btn"
						>{currentPage - 1}</button
					>
				{/if}
				<button name="currentPageData" class="btn btn-primary">{currentPage}</button>
				{#if currentPage <= totalPages - 1}
					<button name="pageAfterData" on:click={() => goToPage(currentPage + 1)} class="btn"
						>{currentPage + 1}</button
					>
				{/if}
				<button
					on:click={nextPage}
					name="nextPageData"
					disabled={currentPage === totalPages}
					class="btn max-w-[1rem] lg:max-w-none"><iconify-icon icon="typcn:arrow-right" /></button
				>
				<button
					name="lastPageData"
					on:click={goToLastPage}
					disabled={currentPage === totalPages}
					class="btn">{totalPages}</button
				>
			</div>
		{/if}

		{#if products.length > 0}
			<div class="divider" />
			<section class="w-full prose mx-auto max-w-max flex gap-5 flex-col">
				<h2 class="text-center my-10">Carrito</h2>
				{#each uniqueProducts as item, index}
					<div class="card w-[18rem] lg:w-96 min-h-[10rem] bg-secondary shadow-xl relative">
						<div class="card-body justify-between">
							<div class="flex justify-between items-center">
								<h2 class="m-0">{item.product}</h2>
								<h2 class="m-0">{formatMoney(getAmount(item) * item.value)}</h2>
							</div>
							<div class="flex items-start">
								<button name="currentStock3" class="btn btn-xs cursor-default capitalize"
									>Stock: {item.quantity}</button
								>
							</div>
							<div class="flex items-end justify-between">
								<button name="stock" class="btn btn-xs cursor-default btn-accent"
									>x {getAmount(item)}</button
								>
								<div class="">
									<button name="add3" class="btn btn-square btn-sm" on:click={addProduct(item)}
										>+</button
									>
									<button
										name="remove3"
										class="btn btn-square btn-sm"
										on:click={removeProduct(item)}>-</button
									>
									<button
										name="openModal3"
										class="btn btn-square btn-sm btn-error text-bold"
										aria-label="Close"
										onclick="delete{item.id}.showModal()"
									>
										<iconify-icon icon="lucide:x" />
									</button>
								</div>
							</div>
						</div>
					</div>
					{#if index === uniqueProducts.length - 1}
						<div class="divider" />
					{/if}
					<dialog id="delete{item.id}" class="modal">
						<div class="modal-box w-fit">
							<form method="dialog">
								<button
									name="closeModal4"
									class="btn btn-sm btn-square btn-ghost absolute right-2 top-2"
									><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
								>
							</form>
							<h2 class="mt-0 text-error mr-5">Borrar producto del carrito?</h2>
							<form method="dialog">
								<button
									name="deleteProduct4"
									class="btn btn-error mx-auto"
									on:click={() => deleteProduct(item)}>Borrar</button
								>
							</form>
						</div>
						<form method="dialog" class="modal-backdrop">
							<button name="closeModal5">close</button>
						</form>
					</dialog>
				{/each}
				<footer class="flex flex-col">
					<div class="flex flex-row justify-between">
						<p class="font-bold m-0 text-xl">Subtotal:</p>
						<p />
						<p class="font-bold m-0 text-xl">{formatMoney(finalPrice)}</p>
					</div>
					<div class="flex mt-5 mb-10">
						<button
							name="processPayment"
							class="btn btn-primary btn-wide mx-auto"
							onclick="processPayment.showModal()">Procesar pago</button
						>
					</div>
				</footer>
			</section>
			<dialog id="processPayment" class="modal">
				<div class="modal-box w-fit">
					<form method="dialog">
						<button
							name="closeModal6"
							class="btn btn-sm btn-square btn-ghost absolute right-2 top-2"
							><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
						>
					</form>
					<h2 class="mt-0 font-bold text-2xl">Precio final</h2>
					<div class="divider" />
					<div class="form-control w-full max-w-xs">
						<label class="label">
							<span class="label-text">Cuotas</span>
						</label>
						<select
							id="cuotas"
							on:change={(e) => (cuotas = parseInt(e.target.value))}
							class="select select-primary w-full max-w-xs"
						>
							<option selected>1</option>
							<option>3</option>
							<option>6</option>
							<option>12</option>
							<option>18</option>
							<option>24</option>
						</select>
					</div>
					<div class="divider" />
					<section class="flex flex-col">
						<div class="flex flex-row justify-between">
							<p class="font-medium m-0 text-xl">Subtotal:</p>
							<p />
							<p class="font-medium m-0 text-xl">{formatMoney(finalPrice)}</p>
						</div>
						<div class="flex flex-row justify-between">
							<p class="m-0 text-lg">Iva:</p>
							<p />
							<p class="m-0 text-lg">10%</p>
						</div>
						<div class="flex flex-row justify-between">
							<p class="m-0 text-lg">Envio:</p>
							<p />
							<p class="m-0 text-lg">{formatMoney(envio)}</p>
						</div>
						{#if cuotas > 1}
							<div class="flex flex-row justify-between">
								<p class="m-0 text-lg">Cuotas:</p>
								<p>
									{#if cuotas === 3}
										<p class="m-0 text-lg">{getDecimal(cuotas3)}%</p>
									{:else if cuotas === 6}
										<p class="m-0 text-lg">{getDecimal(cuotas6)}%</p>
									{:else if cuotas === 12}
										<p class="m-0 text-lg">{getDecimal(cuotas12)}%</p>
									{:else if cuotas === 18}
										<p class="m-0 text-lg">{getDecimal(cuotas18)}%</p>
									{:else if cuotas === 24}
										<p class="m-0 text-lg">{getDecimal(cuotas24)}%</p>
									{/if}
								</p>
							</div>
						{/if}
					</section>
					<div class="divider" />
					<div class="flex flex-row justify-between mb-6">
						<p class="font-bold m-0 text-xl">Total:</p>
						<p />
						<p class="font-bold m-0 text-xl">{precioFinalImp}</p>
					</div>
					<button
						name="submitPayment7"
						class="btn btn-success btn-wide mx-auto"
						on:click={() => {
							updateProducts(products);
							processPayment();
						}}>Enviar pago</button
					>
				</div>
				<form method="dialog" class="modal-backdrop">
					<button name="closeModal9">close</button>
				</form>
			</dialog>
		{/if}
	</div>
</section>
