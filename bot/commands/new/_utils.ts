import * as Exchange from '../../services/exchange';

type Asset = {
    asset: string;
    available: string;
}

export async function getAmountPlayable() {
    const balances = await Exchange.getBalances();
    const balanceUSDT = balances.find((asset: Asset) => asset.asset === 'USDT');
    const available = balanceUSDT.available;

    let percent = String(process.env.PERCENT_AVAILABLE) as unknown as number;
    percent = parseInt(String(percent));

    return ((percent * available) / 100).toFixed(2)
}