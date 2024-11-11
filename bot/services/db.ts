import {Database} from 'bun:sqlite';

const db = new Database('storage/db.sqlite', {create: true});

export default db;