<script>
	import { getTime } from '$lib/helpers';

	export let data;

	let { supabase, taxes } = data;
	$: ({ supabase, taxes } = data);

	let currentPage = 1;
	let perPage = '6';
	let pageData = [];
	let loading = true;
	let next;
	let totalPages;
	let isSearch = false;

	let userList = [];
	let uniqueUserList = [];

	const sells = {
		load: async function () {
			loading = true;
			const { data: newData, count: cant } = await supabase
				.from('sells')
				.select('*, profiles ( * )', { count: 'exact' })
				.range((currentPage - 1) * parseInt(perPage), currentPage * parseInt(perPage) - 1)
				.order('id', { ascending: true });
			if (newData) {
				if (newData.length < parseInt(perPage)) {
					next = false;
					totalPages = currentPage;
				} else {
					next = true;
					totalPages = Math.ceil(cant / parseInt(perPage));
				}
				pageData = newData;
			}
			loading = false;
			isSearch = false;
		}
	};

	sells.load();
</script>

<svelte:head>
	<title>Ventas</title>
</svelte:head>

<section class="bg-neutral w-full p-5 min-h-screen">
	<h1 class="font-semibold mb-5 text-2xl">Ventas</h1>
	<div
		class="bg-base-100 rounded-box min-h-[calc(100vh-6rem)] flex flex-col overflow-auto p-10 shadow-2xl shadow-primary/5"
	>
		<h1 class="mx-auto mb-8 font-bold text-2xl">Ventas del comercio</h1>
		{#if pageData.length > 0}
			<table class="table border-separate rounded-box border border-secondary overflow-hidden">
				<!-- head -->
				<thead class="leading-10">
					<tr class="bg-secondary/25">
						<th class="rounded-md rounded-tl-[0.8rem]">ID</th>
						<th class="rounded-md">Precio</th>
						<th class="rounded-md">Cantidad</th>
						<th class="rounded-md">Vendedor</th>
						<th class="rounded-md rounded-tr-[0.8rem]">Fecha</th>
					</tr>
				</thead>
				<tbody>
					{#each pageData as item, index}
						<tr
							class="hover:bg-secondary/50 hover:border transition ease-in-out hover:scale-[1.003] {index &
							1
								? 'bg-secondary/25'
								: ''}"
						>
							<td class="rounded-md {index === pageData.length - 1 ? 'rounded-bl-[0.8rem]' : ''}"
								>{item.sell_id}</td
							>
							<td class="rounded-md">{item.price}</td>
							<td class="rounded-md">{item.product_amount}</td>
							<td class="rounded-md {index === pageData.length - 1 ? 'rounded-br-[0.8rem]' : ''}"
								>{item.profiles.first_name} {item.profiles.last_name}</td
							>
							<td class="rounded-md">{getTime(item.created_at)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if pageData.length <= 0 && !loading}
			<span class="loading loading-spinner loading-lg" />
		{/if}
	</div>
</section>
