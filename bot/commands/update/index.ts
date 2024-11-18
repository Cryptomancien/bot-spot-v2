import * as Exchange from '../../services/exchange';
import * as Cycle from '../../database/cycle';
import {type CycleType, type OrderType, Status} from '../../types';

export default async function (dryRun: boolean) {
    // Get last BTC price in USDT
    const lastPrice = (await Exchange.getLastPrice()).lastPriceNumber as number;

    // Read running cycles from database
    const uncompletedCycles = Cycle.listUncompleted() as Array<CycleType>
    for (const cycle of uncompletedCycles) {

        const {id: cycleId, status, order_buy_id, order_sell_price, quantity, order_sell_id}: CycleType = cycle;

        switch(status) {
            case Status.ORDER_BUY_PLACED:
                const buy_order = await Exchange.getOrder(order_buy_id as string)

                if (buy_order.isActive) {
                    console.log(`Buy order ${order_buy_id} still active`);
                    continue;
                }

                console.log(`Buy order ${order_buy_id} filled`);
                console.log(`Start updating cycle ${cycle.id}`);

                if (!dryRun) {
                    Cycle.updateStatus(cycleId as number, Status.ORDER_BUY_FILLED);
                }

                if (lastPrice > Number(order_sell_price)) {
                    // TODO: this should be a configurable constant ------v 
                    const newSellPrice = Number(cycle.order_sell_price) + 100
                    if (!dryRun) {
                        Cycle.updateOrderSellPrice(Number(cycle.id), newSellPrice)
                    }
                }

                if (!dryRun) {
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
                break;

            case Status.ORDER_SELL_PLACED:
                const sell_order = await Exchange.getOrder(order_sell_id as string)
                if (sell_order.isActive) {
                    console.log(`Sell order ${order_sell_id} still active`);
                    continue;
                }
            
                // Even in --dry-run mode, this should be updated in database
                Cycle.updateStatus(
                    Number(cycleId),
                    Status.COMPLETED
                );

                console.log(`Cycle ${cycleId} successfully completed`);
                break;
        }
    }

    process.exit();
}