<script>

  export let data;

  let { supabase} = data;
  $: ({ supabase} = data);

  let currentPage = 1;
  const perPage = 6;
  let pageData = [];
  let loading = true
  let next
  let totalPages;
  let isSearch = false

  let finalPrice = 0;

  let products = []
  let uniqueProducts = []

  async function loadData() {
    loading = true
    const { data: newData, count: cant } = await supabase
      .from('stock')
      .select('*',{ count: "exact" })
      .range((currentPage - 1) * perPage, currentPage * perPage - 1);
    if (newData.length < perPage) {
      next = false
      totalPages = currentPage;
    } else {
      next = true
      totalPages = Math.ceil(cant / perPage);
    }
    pageData = newData;
    loading = false
    isSearch = false
  }

  async function searchData(input) {
    loading = true
    let inputEl = document.getElementById("search")
    if (input === "") {
      inputEl.style.border = "1px solid red"
      loading = false
      return
    }
    inputEl.style.removeProperty("border")
    const { data: newData, count: cant } = await supabase
      .from('stock')
      .select('*',{ count: "exact" })
      .textSearch('product', `'${input}'`)
    pageData = newData;
    isSearch = true
    loading = false
  }

  loadData()

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

  function goToFirstPage() {
  if (currentPage > 1) {
    loading = true;
    pageData = [];
    currentPage = 1;
    loadData();
  }
}

function goToLastPage() {
  if (currentPage < totalPages) {
    loading = true;
    pageData = [];
    currentPage = totalPages;
    loadData();
  }
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages) {
    loading = true;
    pageData = [];
    currentPage = page;
    loadData();
  }
}

// let productDiv = document.getElementById("sel"+product.id)
//   let productEl = document.getElementById(product.id)
//   if (document.getElementById("quantity"+product.id)) {
//       let el = document.getElementById("quantity"+product.id)
//       let int = parseInt(el.innerHTML)
//       el.innerHTML = int + 1
//     } else {
//       const node = document.createElement("p");
//       node.style.position = "absolute"
//       node.style.top = "20px"
//       node.style.right = "25px"
//       node.style.fontSize = "1.5rem"
//       node.style.fontWeight = "600"
//       const textnode = document.createTextNode("1");
//       node.setAttribute("id", "quantity"+product.id)
//       node.appendChild(textnode);
//       productDiv.appendChild(node)
//     }
//     productEl.style.border = '1px solid white'

function addProduct(product) {
  products.push(product)
  console.log("agregar")
  console.log(products)
  products = products
  uniqueProducts = [...new Set(products)];
  getFinalPrice()
}

function removeProduct(product) {
  let productToDelete = products.findIndex((el) => el.id === product.id);
  products.splice(productToDelete, 1);
  console.log("borrar")
  console.log(products)
  uniqueProducts = [...new Set(products)];
  getFinalPrice()
  // products = products.filter((id) => id !== product.id);
}

function getAmount(product) {
  let count = 0;
  products.forEach(el => {
    if (el === product) {
      count++
    }
  });
  return count;
}

function getFinalPrice() {
  let price = 0;
  products.forEach(el => {
    price = price + el.value
  });
  finalPrice = price
}

function deleteProduct(product) {
  products = products.filter(item => item.id !== product.id);
  products = products
  uniqueProducts = [...new Set(products)];
  getFinalPrice()
}

function processPayment() {
  products = []
  uniqueProducts = []
  finalPrice = 0
}

</script>
<section class="mt-5 flex items-end justify-center gap-2">
<div class="form-control">
  <label class="label" for="search">
    <span class="label-text text-lg pl-[0.8rem]">Busqueda</span>
  </label>
  <input type="text" class="input input-bordered" disabled={loading} name="search" id="search">
</div>
{#if loading}
  <button class="btn" disabled>Enviar</button>
{:else}
  <button class="btn" on:click={() => searchData(document.getElementById("search").value)}>Enviar</button>
{/if}
{#if isSearch}
  <button class="btn btn-square btn-error" on:click={() => {loadData(); document.getElementById("search").value = ""}}>
    <iconify-icon icon="lucide:x" />
  </button>
{/if}
</section>


{#if pageData.length > 0 && !loading}
<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 m-10">
    {#each pageData as item}
      <div id={item.id} class="card bg-base-200 shadow-xl">
        <div id="sel{item.id}" class="relative">
        </div>
        <div class="card-body">
          <h2 class="card-title">{item.product}</h2>
          <h2>{item.id}</h2>
          <p>{item.quantity}</p>
          <div class='card-actions flex justify-between mt-5'>
            <div class="">
              <button class="btn btn-success btn-square" on:click={addProduct(item)}>+</button>
              <button class="btn btn-error btn-square" on:click={removeProduct(item)}>-</button>
            </div>
            <div class="">
              <button class="btn btn-neutral">${item.value}</button>
            </div>
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

{#if !loading && !isSearch}
<div class="flex justify-center gap-2 mt-5 mb-10">
  <button on:click={goToFirstPage} disabled={currentPage === 1} class="btn" >1</button>
  <button on:click={prevPage} disabled={currentPage === 1} class="btn" ><iconify-icon icon="typcn:arrow-left"></iconify-icon></button>
  {#if currentPage >= 2}
    <button on:click={() => goToPage(currentPage - 1)} class="btn" >{currentPage - 1}</button>
  {/if}
  <button class="btn btn-primary">{currentPage}</button>
  {#if currentPage <= totalPages - 1}
    <button on:click={() => goToPage(currentPage + 1)} class="btn" >{currentPage + 1}</button>
  {/if}
  <button on:click={nextPage} disabled={currentPage === totalPages} class="btn" ><iconify-icon icon="typcn:arrow-right"></iconify-icon></button>
  <button on:click={goToLastPage} disabled={currentPage === totalPages} class="btn" >{totalPages}</button>
</div>
{/if}

{#if loading}
<span class="loading loading-spinner loading-xl text-6xl mx-auto flex items-center justify-center mt-40" />
{/if}

{#if products.length > 0}
<section class="w-full prose mx-auto max-w-max flex gap-5 flex-col">
    <h2 class="text-center mt-20 mb-10">Carrito</h2>
    {#each uniqueProducts as item, index}
      <div class="card w-96 min-h-[10rem] bg-secondary shadow-xl relative">
        <div class="card-body justify-between">
          <div class="flex justify-between items-center">
            <h2 class="m-0">{item.product}</h2>
            <h2 class="m-0">${getAmount(item) * item.value}</h2>
          </div>
          <div class="flex items-end justify-between">
            <button class="btn btn-xs cursor-default">x {getAmount(item)}</button>
            <div class="">
              <button class="btn btn-square btn-sm" on:click={addProduct(item)}>+</button>
              <button class="btn btn-square btn-sm" on:click={removeProduct(item)}>-</button>
              <button class="btn btn-square btn-sm btn-error text-bold" onclick="delete{item.id}.showModal()">
                <iconify-icon icon="lucide:x"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      {#if index === uniqueProducts.length - 1}
        <div class="divider"/>
      {/if}
      <dialog id="delete{item.id}" class="modal">
        <div class="modal-box w-fit">
          <form method="dialog">
            <button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2"
              ><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
            >
          </form>
          <h2 class="mt-0 text-error mr-5">Borrar producto del carrito?</h2>
          <form method="dialog">
            <button class="btn btn-error mx-auto" on:click={() => deleteProduct(item)}>Borrar</button>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    {/each}
    <footer class="flex flex-col">
      <div class="flex flex-row justify-between">
        <p class="font-bold m-0 text-xl">Total:<p>
        <p class="font-bold m-0 text-xl">${finalPrice}</p>
      </div>
      <div class="flex mt-5 mb-10">
        <button class="btn btn-primary btn-wide mx-auto" on:click={() => processPayment()}>Procesar pago</button>
      </div>
    </footer>
</section>
{/if}