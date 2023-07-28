
/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
    return {};
};
export const actions = {
    updateProducts: async ({ request, locals: { supabase, getSession } }) => { 
        const session = await getSession()
        async function updateQuantity(product) {
            const { error } = await supabase
                .from('stock')
                .update({ quantity: product.quantity })
                .eq('id', product.id)    
            return error
        } 
        async function addSell(price, amount) {
            const { error } = await supabase
                .from('sells')
                .insert({ price: price, id: session.user.id, product_amount: amount })  
            return error
        } 
        try {
            const data = await request.formData();
            let products = JSON.parse(data.get("products"))
            let price = data.get("price")
            await addSell(price, products.length)
            products.forEach(async product => {
                await updateQuantity(product)
            });
            return {
              status: 200,
              body: { message: 'Enviado correctamente' },
            };
          } catch (error) {
            return {
              status: 500,
              body: { error: 'Internal server error' },
            };
          }
    }
}
