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
    console.log(`ℹ️ Amount playable = ${amountPlayableUSDT}`)



}