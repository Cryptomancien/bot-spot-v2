import fs from 'fs/promises'
import { styleText } from 'node:util';
import {Database} from 'bun:sqlite'
import * as Exchange from '../exchange'

export default async function () {

    // check dotenv file
    const dotenvFileExists = await fs.exists('.env');
    if ( ! dotenvFileExists) {
        console.log(styleText('red', '.env not found'));
        console.log(styleText('cyan', 'Copy/paste .env.example -> .env'))
        return;
    }
    console.log(styleText('green', '✅  .env found'));

    // check API keys
    if ( ! process.env.API_PUBLIC) {
        console.log(styleText('red', 'API_PUBLIC not found'));
        return;
    }
    console.log(styleText('green', '✅  API_PUBLIC found'));

    if ( ! process.env.API_SECRET) {
        console.log(styleText('red', 'API_SECRET not found'));
        return;
    }
    console.log(styleText('green', '✅  API_SECRET found'));

    // check database
    const db = new Database('storage/db.sqlite', {create: true});
    const migration = await fs.readFile('bot/database/migration.sql', 'utf-8');
    db.query(migration).run();


    // check USDT balance
    const balances = await Exchange.getBalances() as Array<any> | Error

    if ( balances instanceof Error) {
        console.log(styleText('red', 'Error get balances'));
        console.log(styleText('cyan', 'Check keys in .env'));
        return;
    }

    console.log(styleText('green', '✅  keys ok'));

    const balanceUSDT = balances.find(asset => asset.asset === 'USDT')
    const availableUSDT = parseFloat(balanceUSDT.available)

    if ( ! availableUSDT) {
        console.log(styleText('red', 'Balance USDT empty'));
        console.log(styleText('cyan', 'Fill your USDT address on the exchange'));
        return;
    }

    console.log(styleText('green', '✅  USDT wallet filled'));

    console.log(styleText('green', "\nEverything look's like good \nYou can run a new cycle or update not completed ones"));

}