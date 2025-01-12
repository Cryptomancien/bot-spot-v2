import type {OrderType} from '../types.ts'

const baseURL = 'https://api.xeggex.com/api/v2';
const headers = {
    'Authorization': 'Basic ' + Buffer.from(process.env.API_PUBLIC + ":" + process.env.API_SECRET).toString('base64'),
    'Content-Type': 'application/json'
};


export async function getLastPrice() {
    try {
        const url = `${baseURL}/market/${'get by symbol'.replaceAll(' ', '')}/BTC_USDT`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        return Error( (error as Error).message);
    }
}

export async function checkConnection() {
    try {
        const url = `${baseURL}/market/${'get by symbol'.replaceAll(' ', '')}/BTC_USDT`;
        const response = await fetch(url);
        return response.ok
    } catch (error) {
        return Error( (error as Error).message);
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

export async function createOrder(order: OrderType) {
    try {
        const url = `${baseURL}/${'create order'.replaceAll(' ', '')}`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                symbol: order.symbol,
                side: order.side,
                price: order.price,
                quantity: order.quantity
            })
        });
        return await response.json();
    } catch (error) {
        return Error( (error as Error).message);
    }
}

export async function getOrder(orderId: string) {
    try {
        const url = `${baseURL}/${'get order'.replaceAll(' ', '')}/${orderId}`;
        const response = await fetch(url, {
            headers
        });
        return await response.json();
    } catch (error) {
        return Error( (error as Error).message);
    }
}

export async function cancelOrder(orderId: string) {
    try {
        const url = `${baseURL}/${'cancel order'.replaceAll(' ', '')}`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                id: orderId,
            })
        })
        return await response.json();
    } catch (error) {
        return Error( (error as Error).message);
    }
}