import { styleText } from 'node:util';

import {checkBalanceUSDT, checkDB, checkDotenv, checkKeys} from './_utils';

export default async function () {
    await checkDotenv();
    await checkKeys();
    await checkDB();
    await checkBalanceUSDT();

    console.log(styleText('green', "\nEverything look's like good \nYou can run a new cycle or update not completed ones"));
}