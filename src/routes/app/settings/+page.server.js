
/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
    return {};
};
export const actions = {
    updateTax: async ({ request, locals: { supabase } }) => {  
        async function updateQuantity(taxId, taxAmount) {
            const { data, error } = await supabase
                .from('taxes')
                .update({ amount: taxAmount })
                .eq('id', taxId)
            return error
        } 
        try {
            const data = await request.formData();
            let taxId = data.get("taxId")
            let taxAmount = data.get("taxAmount")

            await updateQuantity(taxId, taxAmount)
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
