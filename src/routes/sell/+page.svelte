<script>

    export let data;

    let { supabase} = data;
    $: ({ supabase} = data);

    let currentPage = 1;
    const perPage = 5;
    let pageData = [];
    let loading = true
    let next

    async function loadData() {
      const { data: newData, error } = await supabase
        .from('stock')
        .select()
        .range((currentPage - 1) * perPage, currentPage * perPage - 1); //esto ni idea bien que hace, es un copy je
      if (error) {
        console.error(error);
        return
      }
      if (newData.length < perPage) {
        next = false
      } else {
        next = true
      }
      pageData = newData;
      loading = false
    }

    loadData();

    function nextPage() {
      loading = true
      pageData = []
      currentPage++;
      loadData();
    }

    function prevPage() {
      if (currentPage > 1) {
        loading = true
        pageData = []
        currentPage--;
        loadData();
      }
    }
  </script>

  {#if pageData.length > 0}
  <section class="flex">
      {#each pageData as item}
        <div class="card w-96 bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">{item.product}</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      {/each}
    </section>
  {/if}
{#if !loading}
  {#if currentPage > 1}
  <button on:click={prevPage} class="btn btn-square">Anterior</button>
  {/if}
  {#if next === true}
  <button on:click={nextPage} class="btn btn-square">Siguiente</button>
  {/if}
{/if}

  {#if loading}
  <p><span class="loading loading-spinner loading-xl" /></p>
  {/if}