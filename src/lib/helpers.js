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

export function getTime(utc) {
    const dateObj = new Date(utc);
    const timezone = 'America/Argentina/Buenos_Aires';
    const formatter = new Intl.DateTimeFormat('es-AR', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const argentinaTime = formatter.format(dateObj);
    return argentinaTime;
}

export function timeAgo(timestamp) {
    const argentinaTime = new Date(timestamp);
    const now = new Date();
    const timeDifferenceMs = now - argentinaTime;
    const yearsAgo = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24 * 365));
    const daysAgo = Math.floor((timeDifferenceMs / (1000 * 60 * 60 * 24)) % 365);
    const hoursAgo = Math.floor((timeDifferenceMs / (1000 * 60 * 60)) % 24);
    const minutesAgo = Math.floor((timeDifferenceMs / (1000 * 60)) % 60);
    let timeAgoMessage = 'Ultima vez hace ';
    if (yearsAgo > 0) {
        timeAgoMessage += `${yearsAgo} año${yearsAgo > 1 ? 's' : ''}`;
    } else if (daysAgo > 0) {
        timeAgoMessage += `${daysAgo} día${daysAgo > 1 ? 's' : ''}`;
        if (hoursAgo > 0) {
            timeAgoMessage += ` y ${hoursAgo} hora${hoursAgo > 1 ? 's' : ''}`;
        }
    } else if (hoursAgo > 0) {
        timeAgoMessage += `${hoursAgo} hora${hoursAgo > 1 ? 's' : ''}`;
        if (minutesAgo > 0) {
            timeAgoMessage += ` y ${minutesAgo} minuto${minutesAgo > 1 ? 's' : ''}`;
        }
    } else {
        timeAgoMessage += `${minutesAgo} minuto${minutesAgo > 1 ? 's' : ''}`;
    }
    return timeAgoMessage;
}