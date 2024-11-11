import fs from 'fs/promises';
import {styleText} from 'node:util';
import {Database} from 'bun:sqlite';
import * as Exchange from '../../exchange';

export async function checkDotenv() {
    const dotenvFileExists = await fs.exists('.env');
    if ( ! dotenvFileExists) {
        console.log(styleText('red', '.env not found'));
        console.log(styleText('cyan', 'Copy/paste .env.example -> .env'))
        process.exit();
    }
    console.log(styleText('green', '✅  .env ok'));
}

export async function checkKeys() {
    if ( ! process.env.API_PUBLIC) {
        console.log(styleText('red', 'API_PUBLIC not found'));
        process.exit();
    }
    console.log(styleText('green', '✅  API_PUBLIC ok'));

    if ( ! process.env.API_SECRET) {
        console.log(styleText('red', 'API_SECRET not found'));
        process.exit();
    }
    console.log(styleText('green', '✅  API_SECRET ok'));
}



export async function checkDB() {
    const db = new Database('storage/db.sqlite', {create: true});

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
    addColumnIfNotExists('cycles', 'order_buy_target', 'REAL');
    addColumnIfNotExists('cycles', 'order_buy_id', 'VARCHAR(50)');
    addColumnIfNotExists('cycles', 'order_sell_target', 'REAL');
    addColumnIfNotExists('cycles', 'order_sell_id', 'VARCHAR(50)');

    console.log(styleText('green', '✅  database ok'));
}

export async function checkBalanceUSDT() {
    const balances = await Exchange.getBalances() as Array<any> | Error

    if ( balances instanceof Error) {
        console.log(styleText('red', 'Error get balances'));
        console.log(styleText('cyan', 'Check keys in .env'));
        process.exit();
    }

    console.log(styleText('green', '✅  keys ok'));

    const balanceUSDT = balances.find(asset => asset.asset === 'USDT')
    const availableUSDT = parseFloat(balanceUSDT.available)

    if ( ! availableUSDT) {
        console.log(styleText('red', 'Balance USDT empty'));
        console.log(styleText('cyan', 'Fill your USDT address on the exchange'));
        process.exit();
    }

    console.log(styleText('green', '✅  USDT wallet ok'));
}