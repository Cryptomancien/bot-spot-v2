const baseURL = 'https://api.xeggex.com/api/v2';
const headers = {
    'Authorization': 'Basic ' + Buffer.from(process.env.API_PUBLIC + ":" + process.env.API_SECRET).toString('base64')
};


export async function getLastPrice() {
    try {
        const url = `${baseURL}/market/${'get by symbol'.replaceAll(' ', '')}/BTC_USDT`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function getBalances() {
    try {
        const url = `${baseURL}/balances`;
        const response = await fetch(url, {
            headers
        });
        return await response.json();
    } catch (error) {
        return Error( (error as Error).message);
    }
}