<script>
	import { parseMoney, formatMoney, getTime, timeAgo } from '$lib/helpers';

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

	const users = {
		load: async function () {
			loading = true;
			const { data: newData, count: cant } = await supabase
				.from('profiles')
				.select(
					'full_name, avatar_url, users ( id, email, last_sign_in_at, created_at ), sells ( * )',
					{ count: 'exact' }
				)
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
		},
		sells: function (user) {
			let price = 0;
			user.sells.forEach((el) => {
				price += parseMoney(el.price);
			});
			return formatMoney(price);
		},
		products: function (user) {
			let sellsCount = user.sells.length;
			return sellsCount;
		}
	};

	users.load();
</script>

<svelte:head>
	<title>Team</title>
</svelte:head>
<section class="bg-neutral w-full p-5 min-h-screen">
	<div
		class="bg-base-100 rounded-box min-h-[calc(100vh-6rem)] flex flex-col overflow-auto p-10 shadow-2xl shadow-primary/5"
	>
		<h1 class="mx-auto mb-8 font-bold text-2xl">Miembros del equipo</h1>
		{#if pageData.length > 0}
			<table class="table border-separate rounded-box border border-secondary overflow-hidden">
				<!-- head -->
				<thead class="leading-10">
					<tr class="bg-secondary/25">
						<th class="rounded-md rounded-tl-[0.8rem]">Nombre</th>
						<th class="rounded-md">Email</th>
						<th class="rounded-md">Ganancia</th>
						<th class="rounded-md">Ventas totales</th>
						<th class="rounded-md">Ultima vez</th>
						<th class="rounded-md rounded-tr-[0.8rem]">Fecha de creacion</th>
					</tr>
				</thead>
				<tbody>
					{#each pageData as item, index}
						<tr
							class="hover:bg-secondary/50 transition ease-in-out {index & 1
								? 'bg-secondary/25'
								: ''}"
						>
							<td class="rounded-md {index === pageData.length - 1 ? 'rounded-bl-[0.8rem]' : ''}">
								<div class="flex items-center space-x-3">
									{#if item.avatar_url}
										<div class="avatar">
											<div class="mask mask-circle w-12 h-12">
												<img src={item.avatar_url} alt="Avatar" />
											</div>
										</div>
									{:else}
										<div class="avatar placeholder">
											<div class="bg-secondary text-neutral-content rounded-full w-12">
												<span class="uppercase"
													>{item.full_name.charAt(0)}</span
												>
											</div>
										</div>
									{/if}
									<div>
										<div class="font-bold">{item.full_name} </div>
									</div>
								</div>
							</td>
							<td class="rounded-md">{item.users.email}</td>
							<td class="rounded-md">{users.sells(item)}</td>
							<td class="rounded-md">{users.products(item)}</td>
							<td class="rounded-md">{timeAgo(item.users.last_sign_in_at)}</td>
							<td class="rounded-md {index === pageData.length - 1 ? 'rounded-br-[0.8rem]' : ''}"
								>{getTime(item.users.created_at)}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if pageData.length <= 0 && !loading}
			<span class="loading loading-spinner loading-lg" />
		{/if}
	</div>
</section>
