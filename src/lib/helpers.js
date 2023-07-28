export function formatMoney(val) {
    let formatOptions = {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: 2
	};
	let formatCurrency = new Intl.NumberFormat('es-AR', formatOptions);
    return formatCurrency.format(val);
}

export function parseMoney(val) {
    let num = 0
    num = val.replace(/[^0-9]/g,"");
    let dec = num.substr(-2)
    num = parseInt(num.toString().slice(0, -2))
    if (dec > 50) {
        num += 1
    } 
    return num
}