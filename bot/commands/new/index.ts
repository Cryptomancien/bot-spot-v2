import * as Exchange from '../../services/exchange';
import {getAmountPlayable} from './_utils.ts';
import * as Cycle from '../../database/cycle'


export default async function () {
    const lastPrice = (await Exchange.getLastPrice()).lastPriceNumber;
    console.log(`ℹ️ Last price = ${lastPrice}`);

    let buyOffset: string | number = String(process.env.BUY_OFFSET);
    buyOffset = parseInt(buyOffset);
    buyOffset = Math.abs(buyOffset);

    let sellOffset: string | number = String(process.env.SELL_OFFSET);
    sellOffset = parseInt(sellOffset);
    sellOffset = Math.abs(sellOffset);

    const priceInput = lastPrice - buyOffset;
    const priceOutput = lastPrice + sellOffset;

    console.log(`ℹ️ Price input = ${priceInput}`);
    console.log(`ℹ️ Price output = ${priceOutput}`);

    const amountPlayableUSDT = await getAmountPlayable();
    console.log(`ℹ️ Amount playable in USD = ${amountPlayableUSDT}`);

    let amountPlayableBTC: Number | String = (parseFloat(amountPlayableUSDT) / priceInput).toFixed(6);
    amountPlayableBTC = String(amountPlayableBTC);
    console.log(`ℹ️ Amount playable in BTC = ${amountPlayableBTC}`);

    // create order in exchange
    const order = await Exchange.createOrder({
        symbol: 'BTC_USDT',
        side: 'buy',
        price: String(priceInput),
        quantity: String(amountPlayableBTC),
    });

    if (order.hasOwnProperty('error')) {
        console.log('error !');
        console.log(order);
        process.exit();
    }

    console.log(order)
    console.log(`ℹ️ Order successfully placed`);

    // insert in db
    const cycleID = Cycle.insert({
        quantity: parseFloat(amountPlayableBTC.toString()),
        order_buy_price: priceInput,
        order_buy_id: order.id,
        order_sell_price: priceOutput
    });
    console.log(`ℹ️ Cycle successfully inserted in database`);

    process.exit();
}