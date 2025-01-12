export enum Status {
    ORDER_BUY_PLACED  = 'order_buy_placed',
    ORDER_BUY_FILLED  = 'order_buy_filled',
    ORDER_SELL_PLACED = 'order_sell_placed',
    COMPLETED         = 'completed'
}

export type CycleType = {
    id?: number;
    status?: Status;
    quantity?: number;
    order_buy_price?: number;
    order_buy_id?: string;
    order_sell_price?: number;
    order_sell_id?: string;
};

export type OrderType = {
    symbol: string;
    side: 'buy' | 'sell';
    price: string;
    quantity: string;
};

// Types returned by exchanges, technically, exchanges returns lots of other data
export type LastPrice = {
    lastPriceNumber: number;
};

export type Asset = {
    asset: string;
    available: string;
};

export type Balances = Array<
    {
        asset: string;
        available: string;
    }
>;

export type Order = {
    id: string;
    isActive?: boolean;
};

export type OrderError = {
    code: number;
    error: string;
}