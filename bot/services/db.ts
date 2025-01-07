import {Database} from 'bun:sqlite';
import path from 'node:path';
import fs from 'fs/promises';

const folder = path.resolve(process.env.HOMEPATH as string ?? process.env.HOME, 'cryptomancien/bot-v2');
await fs.mkdir(folder, {recursive: true});

const pathDB = path.resolve(folder, 'db.sqlite');

const db = new Database(pathDB, {create: true});

export default db;