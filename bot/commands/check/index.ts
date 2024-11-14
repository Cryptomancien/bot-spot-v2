import { styleText } from 'node:util';

import {checkBalanceUSDT, checkDB, checkDotenv, checkKeys, checkUpdateAvailable} from './_utils';

export default async function () {
    await checkDotenv();
    await checkKeys();
    await checkDB();
    await checkBalanceUSDT();
    await checkUpdateAvailable();
    console.log(styleText('green', "\nEverything look's like good \nYou can run a new cycle or update not completed ones"));
    process.exit();
}