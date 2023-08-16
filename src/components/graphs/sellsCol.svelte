<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3-scale';

	import Column from '$lib/Column.svelte';
	import AxisX from '$lib/AxisX.svelte';
	import AxisY from '$lib/AxisY.svelte';

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	let arr = [];
	let loaded = false;

	const sells = {
		load: async function () {
			const { data: res } = await supabase.from('stock').select('product, quantity');
			res.forEach((d) => {
				let obj = {
					product: d.product,
					quantity: d.quantity
				};
				arr.push(obj);
			});
			arr.sort((a, b) => b.quantity - a.quantity);
			loaded = true;
			return;
		}
	};

	sells.load();
</script>

{#if loaded}
	<div class="chart-container">
		<!-- El padding es puramente estetico((((creo)))), capaz sea mejor sacarlo y hacerlo aparte con el tailwind -->
		<LayerCake
			padding={{ top: 0, bottom: 20, left: 35 }}
			x={'product'}
			y={'quantity'}
			xScale={scaleBand().paddingInner(0.02).round(true)}
			data={arr}
		>
			<Svg>
				<Column />
				<AxisX gridlines={false} />
				<AxisY gridlines={false} />
			</Svg>
		</LayerCake>
	</div>
{/if}

<style>
	.chart-container {
		width: 100%;
		height: 250px;
		position: relative;
	}
</style>
