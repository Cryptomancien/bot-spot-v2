import type { LastPrice, Balances, Order, OrderError, OrderType } from '../types.ts'

const baseURL = 'https://api.mexc.com';
const headers = {
    'X-MEXC-APIKEY': process.env.MEXC_API_KEY,
    'Content-Type': 'application/json'
};

export const TICKER='BTCUSDT'

export function getTicker(): string {
    let t = process.env.TICKER;
    if (t) return t;
    return TICKER;
}

export async function getExchangeInfo(symbol: string): Promise<any | Error> {
    try {
        const url = `${baseURL}/api/v3/exchangeInfo?symbol=${getTicker()}`;
        const response = await fetch(url, { headers: headers as HeadersInit });
        return await response.json();
    } catch (error) {
        return Error( (error as Error).message);
    }
}

export async function checkConnection(): Promise<Boolean | Error> {
    try {
        const url = `${baseURL}/api/v3/ping`;
        const response = await fetch(url, { headers: headers as HeadersInit });
        return response.ok;
    } catch (error) {
        return Error( (error as Error).message);
    }   
}

export async function getLastPrice(): Promise<LastPrice | Error> {
    try {
        const url = `${baseURL}/api/v3/ticker/price?symbol=${getTicker()}`;
        const response = await fetch(url, { headers: headers as HeadersInit });
        let data = await response.json();
        return { lastPriceNumber: data.price };
    } catch (error) {
        return Error( (error as Error).message);
    }
}

export async function getBalances(): Promise<Balances | Error> {
    try {
        let parameters = {
            timestamp: Date.now().toString()
        }
        
        const url = makeSignedUrl('/api/v3/account', parameters);
        const response = await fetch(url, { headers: headers as HeadersInit });
        
        let data = (await response.json()).balances;
  
        // map MEXC balances to default exchange balances
        return data.map((item: { asset: any; free: any; }) => {
            return { 
              asset: item.asset, 
              available: item.free
            } 
        });
    } catch (error) {
        return Error((error as Error).message);
    }
}

export async function createOrder(order: OrderType): Promise<Order | OrderError | Error> {
    try {
        let parameters = {
            symbol: order.symbol,
            side: order.side.toUpperCase(),
            type: 'LIMIT',
            quantity: order.quantity,
            price: order.price,
            timestamp: Date.now().toString()
        }

        const url = makeSignedUrl('/api/v3/order', parameters);
        const response = await fetch(url, { method: 'POST', headers: headers as HeadersInit });
        
        let data: { code?: number; msg?: string; orderId?: string } = await response.json();
        
        // Handle error
        if (data.hasOwnProperty("code") && data.hasOwnProperty("msg")) {
            return { 
                code: data.code, 
                error: data.msg 
            } as OrderError;
        }

        return { ...data, id: data.orderId } as Order;
    } catch (error) {
        return Error((error as Error).message);
    }
}

export async function getOrder(orderId: string): Promise<Order | OrderError | Error> {
    try {
        let parameters = {
            symbol: getTicker(),
            orderId: orderId,
            timestamp: Date.now().toString()
        };

        const url = makeSignedUrl('/api/v3/order', parameters);
        const response = await fetch(url, { headers: headers as HeadersInit });
        
        let data: { code?: number; msg?: string; orderId?: string; status?: string } = await response.json();

        // Handle error
        if (data.hasOwnProperty("code") && data.hasOwnProperty("msg")) {
            return { 
                code: data.code, 
                error: data.msg 
            } as OrderError;
        }

        return { ...data, id: data.orderId, isActive: data.status !== "FILLED" } as Order;
    } catch (error) {
        return Error((error as Error).message);
    }
}

export async function cancelOrder(orderId: string): Promise<Order | OrderError | Error> {
    try {
        let parameters = {
            symbol: getTicker(),
            orderId: orderId,
            timestamp: Date.now().toString()
        };
        
        const url = makeSignedUrl('/api/v3/order', parameters);
        const response = await fetch(url, { method: 'DELETE', headers: headers as HeadersInit })
        
        let data: { code?: number; msg?: string; orderId?: string; } = await response.json();

        // Handle error
        if (data.hasOwnProperty("code") && data.hasOwnProperty("msg")) {
            return { 
                code: data.code, 
                error: data.msg 
            } as OrderError;
        }

        return { ...data, id: data.orderId } as Order;
    } catch (error) {
        return Error((error as Error).message);
    }
}

export async function getTrades() {
    try {
        let parameters = {
            symbol: getTicker(),
            timestamp: Date.now().toString()
        };
        
        const url = makeSignedUrl('/api/v3/openOrders', parameters);
        const response = await fetch(url, { headers: headers as HeadersInit })
        
        return await response.json();
    } catch (error) {
        return Error((error as Error).message);
    } 
}

function makeSignedUrl(endpoint: string, parameters: Record<string, string>): string {
    let urlParams = new URLSearchParams(parameters).toString();

    const hasher = new Bun.CryptoHasher("sha256", process.env.MEXC_SECRET);
    hasher.update(urlParams);

    return `${baseURL}${endpoint}?${urlParams}&signature=${hasher.digest("hex")}`;  
}