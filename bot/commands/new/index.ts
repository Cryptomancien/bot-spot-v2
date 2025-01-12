import { Exchange } from '../../services/exchange';
import * as Cycle from '../../database/cycle';
import { styleText } from 'node:util';
import { computePrices, getAmountPlayable } from '../../services/core';
import { type Order } from '../../types';


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

    const [ priceInput, priceOutput ] = computePrices(lastPrice);
    console.log(`ℹ️ Price input = ${priceInput}`);
    console.log(`ℹ️ Price output = ${priceOutput}`);

    const balances = await Exchange.getBalances();
    if (balances instanceof Error) {
        console.error(balances as Error);
        process.exit(1);
    }

    const amountPlayableUSDT = getAmountPlayable(balances);
    console.log(`ℹ️ Amount playable in USD = ${amountPlayableUSDT}`);

    let amountPlayable = (amountPlayableUSDT / priceInput).toFixed(8);
    console.log(`ℹ️ Amount playable = ${amountPlayable}`);

    // create order in exchange
    const order = await Exchange.createOrder({
        symbol: Exchange.getTicker(),
        side: 'buy',
        price: String(priceInput),
        quantity: String(amountPlayable),
    });

    if (order.hasOwnProperty('error')) {
        console.error('error !');
        console.error(order);
        process.exit(1);
    }

    console.log(order)
    console.log(`ℹ️ Order successfully placed`);

    // insert in db
    const cycleID = Cycle.insert({
        quantity: parseFloat(amountPlayable),
        order_buy_price: priceInput,
        order_buy_id: (order as Order).id,
        order_sell_price: priceOutput
    });
    console.log(styleText('green', 'Cycle successfully inserted in database'));

    process.exit();
}