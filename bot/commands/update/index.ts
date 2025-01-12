import * as Exchange from '../../services/exchange';
import * as Cycle from '../../database/cycle';
import {type CycleType, type OrderType, Status} from '../../types';
import {styleText} from 'node:util';
import {checkConnection} from "../../services/exchange";

export default async function () {
    const isConnected = await checkConnection();
    if ( ! isConnected ) {
        console.error('No connection found.');
        process.exit(1);
    }

    const lastPrice = (await Exchange.getLastPrice()).lastPriceNumber as number;

    const uncompletedCycles = Cycle.listUncompleted() as Array<CycleType>
    for (const cycle of uncompletedCycles) {

        const {id: cycleId, status, order_buy_id, order_sell_price, quantity, order_sell_id}: CycleType = cycle;

        if (status === Status.ORDER_BUY_PLACED) {
            const order = await Exchange.getOrder(order_buy_id as string)

            if (order.isActive) {
                console.log(`Buy order ${order_buy_id} still active`);

            } else {
                console.log(styleText('green', `Buy order ${order_buy_id} filled`));

                console.log(`Start updating cycle ${cycle.id}`);

                Cycle.updateStatus(cycleId as number, Status.ORDER_BUY_FILLED);

                if ( lastPrice > Number(order_sell_price) ) {
                    const newSellPrice = Number(cycle.order_sell_price) + 100
                    Cycle.updateOrderSellPrice(Number(cycle.id), newSellPrice)
                }

                let price = Cycle.getById(
                    Number(cycleId)
                ) as string;
                price = String(order_sell_price);

                const orderSell: OrderType = await Exchange.createOrder({
                    symbol: 'BTC_USDT',
                    side: 'sell',
                    price,
                    quantity: String(quantity)
                });

                Cycle.updateOrderSellId(
                    Number(cycleId),
                    String(orderSell.id)
                );

                Cycle.updateStatus(
                    Number(cycleId),
                    Status.ORDER_SELL_PLACED
                );
            }
        } else if (status === Status.ORDER_SELL_PLACED) {
            const order = await Exchange.getOrder(order_sell_id as string)
            if (order.isActive) {
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