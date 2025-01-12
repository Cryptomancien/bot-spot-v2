import * as Exchange from '../bot/services/exchange'

const trades = await Exchange.getTrades();
console.log(trades);