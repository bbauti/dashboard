<script>
import { toast } from 'svelte-sonner';

import { fly } from 'svelte/transition';
    
import { fade } from 'svelte/transition';
    
import { enhance } from '$app/forms';
export let form
export let data;
let ide;
let { datos, supabase} = data;
$: ({datos, supabase} = data);
let producto="";
let amount=0;
let selected = [];
let current
$: success = form?.success;


</script>






	<!-- Modal -->
    <dialog id="crear" class="modal">
        <div class="modal-box w-fit">
            <form method="dialog">
                <button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2"
                    ><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
                >
            </form>
            <form method="post" action="?/addProduct" class="prose" use:enhance>
                                            
            <h2>Crea un producto</h2>
            <label for="producto"><h3>Nombre</h3></label>
                <input type="text" class="input input-bordered {success === true
                    ? 'input-success'
                    : success === false
                    ? 'input-error'
                    : ''}" name="producto" id="producto" placeholder="nombre" bind:value={producto}> <br>
                    <label for="amount"><h3>Cantidad</h3></label>
                <input type="number" class="input input-bordered{success === true
                    ? 'input-info'
                    : success === false
                    ? 'input-error'
                    : ''}" name="amount" id="amount" bind:value={amount}>  <br>
                <button type="submit" class="btn btn-primary font-normal normal-case mt-2"><iconify-icon icon="twemoji:plus" id="mail" class="icon " /> </button>
                <button type="reset" class="btn btn-error font-normal normal-case mt-2"><iconify-icon icon="fluent:arrow-reset-48-regular" id="mail" class="icon " /> </button>
            </form>
            
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
    	<!-- Modal update -->
        <dialog id="update" class="modal">
            <div class="modal-box w-fit">
                <form method="dialog">
                    <button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2"
                        ><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
                    >
                </form>
                <form method="post" action="?/updateProduct" class="prose" use:enhance>
                        <h2>Actualizar</h2>                  
                        <label for="producto"><h3>Nombre</h3></label>
                    <input type="text" id="producto" class="input input-bordered {success === true
                        ? 'input-success'
                        : success === false
                        ? 'input-error'
                        : ''}" name="producto" placeholder="nombre" bind:value={producto}>
                    <input style="display:none;" type="text"id="ide" name="ide"   bind:value={current}><br>
                    <label for="amount"><h3>Cantidad</h3></label>
                    <input type="number" class="input input-bordered{success === true
                        ? 'input-primary'
                        : success === false
                        ? 'input-error'
                        : ''}" name="amount" id="amount" bind:value={producto.quantity}>    <br>
                    <button type="submit" class="btn btn-primary font-normal normal-case mt-2"><iconify-icon icon="mingcute:pencil-2-fill" id="mail" class="icon " /> </button>
                    <button type="reset" class="btn btn-error font-normal normal-case mt-2"><iconify-icon icon="fluent:arrow-reset-48-regular" id="mail" class="icon " /> </button>
                </form>
                
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    
    <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">CONTROL DE <strong>STOCK</strong></h1>
            <p class="py-6 underline">Aca vas a poder: Crear, Modificar,Eliminar o Agregar cualquier producto que necesites.</p>
            <a class="btn btn-primary" href="#footer">llevame a la <strong>tabla</strong></a>
          </div>
        </div>
      </div>
    

    



    <div class="overflow-x-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>

              </th>

                  <th class="text-lg">Producto</th>
                  
                  <th class="text-lg">Cantidades</th>
                  <th>     
                      <button class="btn justify-start font-bold" onclick="crear.showModal()"><iconify-icon icon="twemoji:plus" id="mail" class="icon" /></button>
                    </th>
                    <th></th>
                </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            {#each datos as producto}
            <tr>
              <th >
                <label class="text-center">
                    <form method="post" action="?/deleteProduct">
                         <input style="display:none;" type="text"id="ide" name="ide"   bind:value={producto.id}>
                        <input type="submit" class="p-3 bg-error text-lg" value="&#128465;">
                    </form>
                </label>
              </th>
              <div>
                  <div>
                    <div class="p-8 text-base font-bold">{producto.product}</div>
                  </div>
                </div>
              <td class="p-8 text-base font-bold">
                {producto.quantity}
              </td>
              <td>
                <button class="btn justify-center bg-primary font-bold" on:click={()=> current=producto.id} onclick="update.showModal()"><iconify-icon icon="mingcute:pencil-2-fill" id="mail" class="icon " /></button>
              
            </td>
            </tr>
            {/each}
           
          <!-- foot -->
          <tfoot>
            <tr>
              <th>
              </th>
              <th id="footer">name</th>
              <th>

                  <div class="join">
                    <button class="join-item btn">«</button>
                    <button class="join-item btn">Page 22</button>
                    <button class="join-item btn">»</button>
                  </div>
              </th>
              <th>

              </th>
            </tr>
          </tfoot>
          
        </table>
      </div>
            
    <div class="prose ">
        
        {#if success ===false}
        <h1 class="text-rose-950">COMPLETA LOS CAMPOS PELELE</h1>
        {/if}
        
    </div>

