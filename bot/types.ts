export enum Status {
    ORDER_BUY_PLACED = 'order_buy_placed',
    ORDER_SELL_PLACED = 'order_sell_placed',
    COMPLETED = 'completed'
}

export type CycleType = {
    id: number;
    status: Status;
    quantity: number;
    order_buy_target: number;
    order_buy_id: string;
    order_sell_target: number;
    order_sell_id: string;
};