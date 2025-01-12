import type { NumberLiteralType } from 'typescript';
import { type Balances, type Asset } from '../types';

function isPercent(value: String) {
    return value.endsWith("%");
}

function percentValue(value: String) {
    // value is supposed to end with a % sign
    return parseFloat(value.slice(0, -1));
}

export function playAmount(available: number) {
    let percent: String | number | undefined;

    let playAvailable = process.env.PLAY_AVAILABLE;
    if (playAvailable) {
        if (isPercent(playAvailable)) {
            percent = percentValue(playAvailable);
        } else {
            return parseFloat(playAvailable);
        }
    }
    else {
        // PERCENT_AVAILABLE may be deprecated at some point
        let percentAvailable = process.env.PERCENT_AVAILABLE;
        if (percentAvailable) {
            percent = parseInt(percentAvailable);
        } else {
            return 0;
        }
    }

    return (available * percent) / 100.0;
}

export function getAmountAvailableUSDT(balances: Balances) {
    const balanceUSDT = balances.find((asset: Asset) => asset.asset === 'USDT');
    if (balanceUSDT) {
        return parseFloat(balanceUSDT.available);
    }
    return 0;
}

export function getAmountPlayable(balances: Balances) {
    return playAmount(getAmountAvailableUSDT(balances));
}

export function decrementValue(value: number, offsetEnv: string | undefined, defaultPercent: number): number {
    if (offsetEnv) {
        if (isPercent(offsetEnv)) {
            let updatePercent = Math.abs(percentValue(offsetEnv));
            return value / (1 + updatePercent / 100.0);
        } else {
            let updateOffset = Math.abs(parseFloat(offsetEnv));
            return value - updateOffset;
        }
    }
    else
      return value / (1 + defaultPercent / 100.0);
}

export function incrementValue(value: number, offsetEnv: string | undefined, defaultPercent: number): number {
    if (offsetEnv) {
        if (isPercent(offsetEnv)) {
            let updatePercent = Math.abs(percentValue(offsetEnv));
            return value * (1 + updatePercent / 100.0);
        } else {
            let updateOffset = Math.abs(parseFloat(offsetEnv));
            return value + updateOffset;
        }
    }
    else    
      return value * (1 + defaultPercent / 100.0);
}

export function computePrices(price: number): [ number, number ] {
    let buyOffsetEnv = process.env.BUY_OFFSET;
    let priceInput = decrementValue(price, buyOffsetEnv, 1);

    let sellOffsetEnv = process.env.SELL_OFFSET;
    let priceOutput = incrementValue(price, sellOffsetEnv, 1);

    return [ priceInput, priceOutput ];
}

export function computeNewSellPrice(price: number): number {
    let updateIncrementEnv = process.env.UPDATE_INCREMENT;
    return incrementValue(price, updateIncrementEnv, 0.1); // 0.1% +/- equals to $100 for a $100k BTC
}