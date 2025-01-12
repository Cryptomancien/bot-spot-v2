import { Exchange } from '../../services/exchange';
import * as Cycle from '../../database/cycle';
import { type CycleType, type Order, type OrderError, Status } from '../../types';
import { computeNewSellPrice } from '../../services/core';
import { styleText } from 'node:util';

export default async function () {
    const isConnected = await Exchange.checkConnection();
    if (isConnected instanceof Error || !isConnected) {
        console.error('No connection found.');
        process.exit(1);  
    }

    const lastPriceResponse = await Exchange.getLastPrice();
    if (lastPriceResponse instanceof Error) {
        console.error(lastPriceResponse as Error);
        process.exit(1);
    }
    const lastPrice = lastPriceResponse.lastPriceNumber;
    console.log(`ℹ️ Last price = ${lastPrice}`);

    const uncompletedCycles = Cycle.listUncompleted() as Array<CycleType>
    for (const cycle of uncompletedCycles) {

        const {id: cycleId, status, order_buy_id, order_sell_price, quantity, order_sell_id}: CycleType = cycle;

        if (status === Status.ORDER_BUY_PLACED) {
            const order = await Exchange.getOrder(order_buy_id as string)
            if (order instanceof Error) {
                console.error(order as Error);
                continue;
            }

            if (order.hasOwnProperty("error")) {
                console.error(order);
                continue;
            }

            if ((order as Order).isActive) {
                console.log(`Buy order ${order_buy_id} still active`);
            } else {
                console.log(styleText('green', `Buy order ${order_buy_id} filled`));

                console.log(`Start updating cycle ${cycle.id}`);

                Cycle.updateStatus(cycleId as number, Status.ORDER_BUY_FILLED);

                if ( lastPrice > Number(order_sell_price) ) {
                    const newSellPrice = computeNewSellPrice(Number(cycle.order_sell_price));
                    Cycle.updateOrderSellPrice(Number(cycle.id), newSellPrice)
                }

                let price = Cycle.getById(Number(cycleId)) as string;
                price = String(order_sell_price);

                const orderSell = await Exchange.createOrder({
                    symbol: Exchange.getTicker(),
                    side: 'sell',
                    price,
                    quantity: String(quantity)
                });

                if (orderSell instanceof Error) {
                    console.error(orderSell as Error);
                    continue;
                }

                Cycle.updateOrderSellId(
                    Number(cycleId),
                    String((orderSell as Order).id)
                );

                Cycle.updateStatus(
                    Number(cycleId),
                    Status.ORDER_SELL_PLACED
                );
            }
        } else if (status === Status.ORDER_SELL_PLACED) {
            const order = await Exchange.getOrder(order_sell_id as string)
            if (order instanceof Error) {
                console.error(order as Error);
                continue;
            }

            if (order.hasOwnProperty("error")) {
                console.error(order);
                continue;
            }

            if ((order as Order).isActive) {
                console.log(`Sell order ${order_sell_id} still active`);
            } else {
                Cycle.updateStatus(
                    Number(cycleId),
                    Status.COMPLETED
                );

                console.log(styleText('green', `Cycle ${cycleId} successfully completed`));
            }
        }
    }

    process.exit();
}