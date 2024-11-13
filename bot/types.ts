export enum Status {
    ORDER_BUY_PLACED = 'order_buy_placed',
    ORDER_BUY_FILLED = 'order_buy_filled',
    ORDER_SELL_PLACED = 'order_sell_placed',
    COMPLETED = 'completed'
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
    id?: string;
    symbol: 'BTC_USDT';
    side: 'buy' | 'sell';
    price: string;
    quantity: string;
    isActive?: boolean
}