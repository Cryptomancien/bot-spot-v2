import { computePrices, getAmountPlayable, getAmountAvailableUSDT } from "../../services/core";
import { Exchange } from "../../services/exchange";

export default async function () {
    // Check if connection with Exchange works as expected
    const isConnected = await Exchange.checkConnection();
    if (isConnected instanceof Error || !isConnected) {
        console.error('No connection found.');
        process.exit(1);  
    } else {
        console.log('ℹ️ Connected to Exchange');
    }
   
    // Get exchange data for the current ticker
    if (Exchange.getExchangeInfo) {
      let infos = await Exchange.getExchangeInfo();
      console.log(`Exchange info for ${Exchange.getTicker()}`);
      console.log(infos);
    }

    // Get current price of current ticker
    let lastPriceResponse = await Exchange.getLastPrice();
    if (lastPriceResponse instanceof Error) {
        console.error('Exchange.getLastPrice() returned an Error');
        console.error(lastPriceResponse as Error);
        process.exit(1);
    }
    const lastPrice = lastPriceResponse.lastPriceNumber;
    console.log(`ℹ️ Last ${Exchange.getTicker()} price = ${lastPrice}`);    

    // Get account balances
    const balances = await Exchange.getBalances();
    if (balances instanceof Error) {
        console.error('Exchange.getBalances() returned an Error');
        console.error(balances as Error);
        process.exit(1);
    }
    balances.forEach(element => {
        console.log(`ℹ️ Free ${element.asset} Balance = ${element.available}`);    
    });

    // compute buy/sell prices
    const [ priceInput, priceOutput ] = computePrices(lastPrice);
    console.log(`ℹ️ Computed Price Input = ${priceInput} / Output = ${priceOutput}`);

    // determine playable amount in target token from available USDT
    let amountAvailableUSDT = getAmountAvailableUSDT(balances);
    console.log(`ℹ️ Available USDT = ${amountAvailableUSDT}`);
    
    let amountPlayableUSDT  = getAmountPlayable(balances);
    console.log(`ℹ️ Playable USDT = ${amountPlayableUSDT}`);
   
    let amountPlayable = (amountPlayableUSDT / priceInput).toFixed(8);
    console.log(`ℹ️ Playable = ${amountPlayable}`);

    // create order in exchange
    const order = await Exchange.createOrder({
        symbol: Exchange.getTicker(),
        side: 'buy',
        price: String(priceInput),
        quantity: amountPlayable,
    });

    if (order instanceof Error) {
        console.error('Exchange.createOrder() returned an Error');
        console.error(order as Error);
        process.exit(1);
    }

    if ("error" in order) {
        console.error('Exchange.createOrder() returned an Error');
        console.error(order);
        process.exit(1);
    }

    console.log('ℹ️ Order Created');
    console.log(order);

    // check order in exchange
    const checkedOrder = await Exchange.getOrder(order.id);

    if (checkedOrder instanceof Error) {
        console.error('Exchange.getOrder() returned an Error');
        console.error(checkedOrder as Error);
    } else if ("error" in checkedOrder) {
        console.error('Exchange.getOrder() returned an Error');
        console.error(checkedOrder);
    } else {
        console.log('ℹ️ Order Read Successfully from Exchange');
        console.log(checkedOrder);    
    }

    // print a list of open trades
    const trades = await Exchange.getTrades();
    console.log('ℹ️ List of Open Orders');
    console.log(trades);

    // cancel order
    const cancelledOrder = await Exchange.cancelOrder(order.id);

    if (cancelledOrder instanceof Error) {
        console.error('Exchange.cancelOrder() returned an Error');
        console.error(cancelledOrder as Error);
    } else if ("error" in cancelledOrder) {
        console.error('Exchange.cancelOrder() returned an Error');
        console.error(cancelledOrder);
    } else {
        console.log('ℹ️ Order Cancelled Successfully');
        console.log(cancelledOrder);    
    }

    process.exit();
}