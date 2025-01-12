import fs from 'fs/promises';
import { styleText } from 'node:util';
import { Exchange } from '../../services/exchange';
import db from '../../services/db'

export async function checkDotenv() {
    const dotenvFileExists = await fs.exists('.env');
    if (!dotenvFileExists) {
        console.error(styleText('red', '.env not found'));
        console.error(styleText('cyan', 'Copy/paste .env.example -> .env'))
        process.exit(1);
    }
    console.log(styleText('green', '✅  .env ok'));
}

export async function checkKeys() {
    if (process.env.EXCHANGE === 'MEXC') {
        if (!process.env.MEXC_API_KEY) {
            console.error(styleText('red', 'MEXC_API_KEY not found'));
            process.exit(1);
        }
        console.log(styleText('green', '✅  MEXC_API_KEY ok'));

        if (!process.env.MEXC_SECRET) {
            console.error(styleText('red', 'MEXC_SECRET not found'));
            process.exit(1);
        }
        console.log(styleText('green', '✅  MEXC_SECRET ok')); 
    } else {
        if (!process.env.API_PUBLIC) {
            console.error(styleText('red', 'API_PUBLIC not found'));
            process.exit(1);
        }
        console.log(styleText('green', '✅  API_PUBLIC ok'));

        if (!process.env.API_SECRET) {
            console.error(styleText('red', 'API_SECRET not found'));
            process.exit(1);
        }
        console.log(styleText('green', '✅  API_SECRET ok'));3
    }
}

export async function checkDB() {
    function addColumnIfNotExists(tableName: string, columnName: string, columnDefinition: string) {
        // Retrieve the list of columns in the specified table
        const stmt = db.prepare(`PRAGMA table_info(${tableName})`);
        const columns = stmt.all();

        // Check if the column already exists
        // @ts-ignore
        const columnExists = columns.some((col) => col.name === columnName);

        // If the column doesn't exist, add it to the table
        if (!columnExists) {
            db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
        }
    }

    db.query('CREATE TABLE IF NOT EXISTS cycles (id INTEGER PRIMARY KEY NOT NULL);').run();

    addColumnIfNotExists('cycles', 'status', 'VARCHAR(50)');
    addColumnIfNotExists('cycles', 'quantity', 'REAL');
    addColumnIfNotExists('cycles', 'order_buy_price', 'REAL');
    addColumnIfNotExists('cycles', 'order_buy_id', 'VARCHAR(50)');
    addColumnIfNotExists('cycles', 'order_sell_price', 'REAL');
    addColumnIfNotExists('cycles', 'order_sell_id', 'VARCHAR(50)');

    console.log(styleText('green', '✅  database ok'));
}

export async function checkBalanceUSDT() {
    const balances = await Exchange.getBalances() as Array<any> | Error

    if ( balances instanceof Error) {
        console.error(styleText('red', 'Error get balances'));
        console.error(styleText('cyan', 'Check keys in .env'));
        process.exit(1);
    }

    console.log(styleText('green', '✅  keys ok'));

    const balanceUSDT = balances.find(asset => asset.asset === 'USDT')
    const availableUSDT = parseFloat(balanceUSDT.available)

    if (!availableUSDT) {
        console.error(styleText('red', 'Balance USDT empty'));
        console.error(styleText('cyan', 'Fill your USDT address on the exchange'));
        process.exit(1);
    }

    console.log(styleText('green', '✅  USDT wallet ok'));
}

export async function checkUpdateAvailable() {
    const {default: project} = await import('../../../package.json', {
        assert: {
            type: 'json'
        }
    });

    let localVersion = parseFloat(project.version);

    const url = 'https://raw.githubusercontent.com/Cryptomancien/bot-spot-v2/refs/heads/master/package.json';

    const response = await fetch(url);
    const json = await response.json();

    const onlineVersion = parseFloat(json.version)

    if (onlineVersion > localVersion) {
        console.log(styleText('cyan', '\nUpdate available'));
        console.log('git pull');
        console.log('bun update')
    } else {
        console.log(styleText('green', '✅  Project updated'));
    }
}