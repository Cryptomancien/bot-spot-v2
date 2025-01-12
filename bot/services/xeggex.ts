import type { Balances, LastPrice, Order, OrderType } from '../types.ts'

const baseURL = 'https://api.xeggex.com/api/v2';
const headers = {
    'Authorization': 'Basic ' + Buffer.from(process.env.API_PUBLIC + ":" + process.env.API_SECRET).toString('base64'),
    'Content-Type': 'application/json'
};

export const TICKER='BTC_USDT'

export function getTicker() {
    let t = process.env.TICKER;
    if (t) return t;
    return TICKER;
}

export async function checkConnection(): Promise<Boolean | Error> {
    try {
        const url = `${baseURL}/market/${'get by symbol'.replaceAll(' ', '')}/${getTicker()}`;
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        return Error( (error as Error).message);
    }
}

export async function getLastPrice(): Promise<LastPrice | Error> {
    try {
        const url = `${baseURL}/market/${'get by symbol'.replaceAll(' ', '')}/${getTicker()}`;
        const response = await fetch(url);
        return await response.json() as LastPrice;
    } catch (error) {
        return Error((error as Error).message);
    }
}

export async function getBalances(): Promise<Balances | Error> {
    try {
        const url = `${baseURL}/balances`;
        const response = await fetch(url, {
            headers
        });
        return await response.json() as Balances;
    } catch (error) {
        return Error((error as Error).message);
    }
}

export async function createOrder(order: OrderType): Promise<Order | Error> {
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
        return await response.json() as Order;
    } catch (error) {
        return Error((error as Error).message);
    }
}

export async function getOrder(orderId: string): Promise<Order | Error> {
    try {
        const url = `${baseURL}/${'get order'.replaceAll(' ', '')}/${orderId}`;
        const response = await fetch(url, {
            headers
        });
        return await response.json() as Order;
    } catch (error) {
        return Error((error as Error).message);
    }
}

export async function cancelOrder(orderId: string): Promise<Order | Error> {
    try {
        const url = `${baseURL}/${'cancel order'.replaceAll(' ', '')}`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                id: orderId,
            })
        })
        return await response.json() as Order;
    } catch (error) {
        return Error((error as Error).message);
    }
}

export async function getTrades() {
    try {
        const url = `${baseURL}/${'get orders'.replaceAll(' ', '')}`;
        const response = await fetch(url, {
            method: 'GET',
            headers,
        });
        return await response.json();
    } catch (error) {
        return Error( (error as Error).message);
    }
}