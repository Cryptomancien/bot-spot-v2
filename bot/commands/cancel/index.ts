import * as Cycle from '../../database/cycle';
import * as Exchange from '../../services/exchange'

export default async function () {
    const lastArg = process.argv.at(-1);
    if ( ! lastArg?.includes('=') ) {
        throw new Error('id not found');
    }

    const arrayArg = lastArg?.split('=');

    const cycleId = arrayArg.at(1) as string;

    const cycle = Cycle.getById(Number(cycleId));

    // @ts-ignore
    const {order_buy_id} = cycle;

    const response = await Exchange.cancelOrder(order_buy_id);
    console.log(response);

    Cycle.deleteCycleById(Number(cycleId));

    process.exit();
}