import * as Exchange from '../../services/exchange';
import {getAmountPlayable} from './_utils.ts';
import * as Cycle from '../../database/cycle'

export default async function (dryRun: boolean) {
    // Get last BTC price in USDT
    const lastPrice = (await Exchange.getLastPrice()).lastPriceNumber;
    console.log(`ℹ️ Last price = ${lastPrice}`);

    // Read BUY_OFFSET from .env and computes a lower buy price (in percent if BUY_OFFSET ends with a % sign)
    let buyOffset: string | number = String(process.env.BUY_OFFSET);
    const buyOffsetPercent = buyOffset.endsWith('%');
    buyOffset = parseFloat(buyOffset);
    buyOffset = Math.abs(buyOffset);
    
    const priceInput = (buyOffsetPercent) ? lastPrice / (1 + (buyOffset / 100.0)) : lastPrice - buyOffset;
    console.log(`ℹ️ Price input = ${priceInput}`);
 
    // Read SELL_OFFSET from .env and computes a higher buy price (in percent if SELL_OFFSET ends with a % sign)
    let sellOffset: string | number = String(process.env.SELL_OFFSET);
    const sellOffsetPercent = sellOffset.endsWith('%');
    sellOffset = parseFloat(sellOffset);
    sellOffset = Math.abs(sellOffset);

    const priceOutput = (sellOffsetPercent) ? lastPrice * (1 + (sellOffset / 100.0)) : lastPrice + sellOffset;
    console.log(`ℹ️ Price output = ${priceOutput}`);

    // Get available USDT amount from Exchange and compute a bag for this trade
    const amountPlayableUSDT = await getAmountPlayable();
    console.log(`ℹ️ Amount playable in USD = ${amountPlayableUSDT}`);

    // Convert playable amount into BTC (at computed buy price)
    let amountPlayableBTC: Number | String = (parseFloat(amountPlayableUSDT) / priceInput).toFixed(6);
    amountPlayableBTC = String(amountPlayableBTC);
    console.log(`ℹ️ Amount playable in BTC = ${amountPlayableBTC}`);

    if (!dryRun) {
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

        // Store order in db
        const cycleID = Cycle.insert({
            quantity: parseFloat(amountPlayableBTC.toString()),
            order_buy_price: priceInput,
            order_buy_id: order.id,
            order_sell_price: priceOutput
        });
        console.log(`ℹ️ Cycle successfully inserted in database`);
    }
    process.exit();
}