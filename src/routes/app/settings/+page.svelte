<script>
	export let data;

	let { supabase, taxes } = data;
	$: ({ supabase, taxes } = data);

	import { toast } from 'svelte-sonner';

	function getDecimal(number) {
		number = number.toString().split('.')[1];
		if (number.length < 2) {
			return number + '0';
		}
		return number;
	}

	let formatOptions = {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: 2
	};

	let formatCurrency = new Intl.NumberFormat('es-AR', formatOptions);

	async function updateTax(taxId, taxAmount) {
		const formData = new URLSearchParams();
		formData.append(`taxId`, taxId);
		formData.append('taxAmount', taxAmount);
		const response = await fetch('?/updateTax', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formData
		}).then(() => {
			toast.success('Impuesto actualizado correctamente!');
			setTimeout(() => {
				toast('Para ver los cambios, recarga la página.');
			}, 1000);
		});
	}

	async function editTax(taxId, taxAmount) {
		let input = document.getElementById(taxId);
		let inputValue = input.value;
		let button = document.getElementById('button' + taxId);
		if (input.disabled) {
			button.classList.remove('btn-ghost');
			button.classList.add('btn-success');
			button.innerHTML = `<iconify-icon icon="fluent:save-24-filled" />`;
			input.disabled = false;
		} else {
			if (taxId !== 1 && inputValue.length > 2) {
				toast.error('El valor debe ser menor a 3 caracteres!');
				return;
			}
			if (taxId !== 1) {
				await updateTax(taxId, inputValue / 100);
			} else if (taxId === 1) {
				await updateTax(taxId, inputValue);
			}
			button.classList.remove('btn-success');
			button.classList.add('btn-ghost');
			button.innerHTML = `<iconify-icon icon="solar:pen-bold" />`;
			input.disabled = true;
		}
	}

	let editing = false;
</script>

<svelte:head>
	<title>Ajustes</title>
</svelte:head>

<section class="bg-neutral w-full p-5 min-h-screen">
	<div
		class="bg-base-100 rounded-box flex-col min-h-[calc(100vh-6rem)] overflow-hidden flex shadow-2xl shadow-primary/5"
	>
		<div class="prose mx-auto mt-10">
			<h2>Impuestos</h2>
		</div>
		<div class="grid sm:grid-cols-3 lg:grid-cols-5 gap-5 m-10">
			{#each taxes as taxes, index}
				{#if index > 0}
					<div
						class="border border-secondary rounded-box min-w-[10rem] p-5 relative shadow-xl hover:border-accent/10 transition-all hover:-translate-y-[1.5px] hover:scale-[1.01]"
					>
						<button
							name="tax{taxes.id}"
							id="button{taxes.id}"
							class="btn btn-square btn-sm btn-ghost absolute top-2 right-2"
							on:click={() => {
								editTax(taxes.id, taxes.amount);
							}}
						>
							<iconify-icon icon="solar:pen-bold" />
						</button>
						<p class="font-bold capitalize">{taxes.tax}</p>
						<!-- <p>{formatCurrency.format(getDecimal(taxes.amount))}</p> -->
						<div class="relative mt-2">
							<input
								aria-label="set tax"
								id={taxes.id}
								type="number"
								class="input input-bordered w-[4.5rem] pr-[2rem]"
								disabled
								value={taxes.amount * 100}
							/>
							<span class="absolute inset-y-0 left-[45px] flex items-center">%</span>
						</div>
					</div>
				{:else}
					<div
						class="border border-secondary rounded-box min-w-[10rem] p-5 relative shadow-xl hover:border-accent/10 transition-all hover:-translate-y-[1.5px] hover:scale-[1.01]"
					>
						<button
							name="taax{taxes.id}"
							id="button{taxes.id}"
							class="btn btn-square btn-sm btn-ghost absolute top-2 right-2"
							on:click={() => {
								editTax(taxes.id);
							}}
						>
							<iconify-icon icon="solar:pen-bold" />
						</button>
						<p class="font-bold capitalize">{taxes.tax}</p>
						<!-- <p>{formatCurrency.format(getDecimal(taxes.amount))}</p> -->
						<div class="relative mt-2">
							<span class="absolute inset-y-0 left-[13px] flex items-center">$</span>
							<input
								aria-label="set tax"
								id={taxes.id}
								type="number"
								class="input input-bordered w-[5rem] pl-[2rem]"
								disabled
								value={taxes.amount}
							/>
						</div>
					</div>
				{/if}
			{/each}
		</div>
		<div class="divider" />
		<h1 class="mx-auto btn w-[4rem] p-0 mb-5 btn-ghost btn-sm">
			<iconify-icon icon="ic:round-construction" />
			WIP
		</h1>
	</div>
</section>

<style>
	input[disabled] {
		background: none;
		border: 1px solid transparent;
		cursor: default;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button,
	input[type='number'] {
		-webkit-appearance: none;
		margin: 0;
		-moz-appearance: textfield !important;
	}
</style>
