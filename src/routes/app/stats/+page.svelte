<script>
    import { LayerCake, Svg } from 'layercake';
    import { scaleBand } from 'd3-scale';
  
    import Bar from '$lib/Bar.svelte';
    import AxisX from '$lib/AxisX.svelte';
    import AxisY from '$lib/AxisY.svelte';
  
    // This example loads csv data as json using @rollup/plugin-dsv
    // import data from '$lib/groups.js';
    const xKey = 'quantity';
    const yKey = 'product';
    export let data;
    
    let { supabase  } = data;
    $: ({ supabase  } = data);
    let arr=[];
    const sells = {
		load: async function () {
			const { data} = await supabase
				.from('stock')
				.select('product, quantity');
                // console.log(await data)
                data.forEach(d => {
                    let obj={
                        product: d.product,
                        quantity: d.quantity
                    };
                    arr.push(obj);
                    
                });
                arr.forEach(d => {
                    d[xKey] = +d[xKey];
                });
                console.log(arr);
                return data, arr
            }
        };
        
	sells.load();

  </script>
  
  <style>
    /*
      The wrapper div needs to have an explicit width and height in CSS.
      It can also be a flexbox child or CSS grid element.
      The point being it needs dimensions since the <LayerCake> element will
      expand to fill it.
    */
    .chart-container {
      width: 100%;
      height: 250px;
    }
  </style>
  
  <div class="chart-container">
    <LayerCake
      padding={{ top: 0, bottom: 20, left: 35 }}
      x={xKey}
      y={yKey}
      yScale={scaleBand().paddingInner(0.05)}
      xDomain={[0, null]}
      data={arr}
    >
      <Svg>
        <AxisX
          gridlines={true}
          baseline={true}
          snapTicks={true}
        />
        <AxisY
          gridlines={false}
        />
        <Bar/>
      </Svg>
    </LayerCake>
  </div>