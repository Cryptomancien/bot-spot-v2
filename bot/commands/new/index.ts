import { styleText } from 'node:util';
import * as Exchange from '../../exchange';
import {getAmountPlayable} from './_utils.ts';

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

    const amountPlayable = await getAmountPlayable();
    console.log(`ℹ️ Amount playable = ${amountPlayable}`)


}