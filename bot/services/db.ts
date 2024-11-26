import { Database } from 'bun:sqlite';
import path from 'node:path';
import fs from 'fs/promises';

const folder = path.resolve(process.env.HOMEPATH as string, 'cryptomancien/bot-v2');
await fs.mkdir(folder, { recursive: true });

const pathDB = path.resolve(folder, 'db.sqlite');

const db = new Database(pathDB, { create: true });

// Create new cycles table if not exists
const query = `
  CREATE TABLE IF NOT EXISTS cycles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status VARCHAR(20) NOT NULL,
    quantity REAL NOT NULL,
    order_buy_price REAL NOT NULL,
    order_buy_id VARCHAR(255) NOT NULL,
    order_sell_price REAL NOT NULL,
    order_sell_id VARCHAR(255)
  );
`;

db.prepare(query).run();

export default db;
