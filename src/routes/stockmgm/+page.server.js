import {fail} from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
let st=0
let fin=7






export const load = async ({ locals: { supabase, getSession } }) => {
     const session = await getSession()
     if (!session) {
         throw redirect(303, '/')
     }
    const { data: datos } = await supabase.from('stock').select()
     .range(st,fin)
    return {
        datos,
    }
}
export const actions = {
    
    addProduct: async ({ request, url, locals: { supabase } }) => {  
        const { data } = await supabase.from("stock");
        const formData = await request.formData()
        const producto = formData.get('producto')
        const quantity = formData.get('amount')
        const value = formData.get('value')
         if(!producto || !quantity){
             return fail(500, { message: 'Debes introducir el correo y contraseña', success: false});
         }else{
            
            const {error} = await supabase
            .from("stock")
            .insert({product:producto, quantity:quantity, value:value})
            return {stock: data ?? [],}
         }
    },
    deleteProduct: async ({request ,url ,locals: {supabase}  }) =>{
        const { data } = await supabase.from("stock");
        const formData = await request.formData()
        const id = formData.get('ide')
        const { error } = await supabase
        .from("stock")
        .delete(id)
        .eq('id',id)
        return {stock: data ?? []};

    },
    updateProduct: async ({ request, url, locals: { supabase } }) => {
        const { data } = await supabase.from("stock");
        const formData = await request.formData()
        const id = formData.get('ide')
        const producto = formData.get('producto')
        const quantity = formData.get('amount')
        if(!producto || !quantity){
            return fail(500, { message: 'Debes introducir el correo y contraseña', success: false});
        }else{
            const { error } = await supabase

            .from("stock")
            .update({ product: producto, quantity:quantity })
            .eq('id',id)
            return {stock: data ?? []}}
        },

        advance: async () => {
            fin+=7
            st+=7
            return;
        },
        goback: async () => {
            if (st===0){
                return;
            }else{
                fin-=7
                st-=7
                return;
            }
        },
}
