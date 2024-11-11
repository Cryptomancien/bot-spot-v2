import {MongoClient} from 'mongodb';
import {Database} from 'bun:sqlite';


const db = new Database('storage/db.sqlite', {create: true});


// mongodb connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const database = client.db('bot_spot');
const collection = database.collection('trades');
const query = {};
const cyclesOldDB = collection.find(query);

for await (const cycleOldDB of cyclesOldDB) {
    const {
        status,
        order_buy_quantity: quantity,
        order_buy_id,
        order_buy_price,
        order_sell_price,
        order_sell_id,
    } = cycleOldDB


    const query = `SELECT * FROM cycles WHERE order_buy_id = '${order_buy_id}'`;
    const cycleNewDB = db.prepare(query).get();

    if ( ! cycleNewDB) {
        const keys =  '(status, quantity, order_buy_price, order_buy_id, order_sell_price, order_sell_id)';
        const values = `( '${status}', ${quantity}, ${order_buy_price}, '${order_buy_id}', ${order_sell_price}, '${order_sell_id}' )`;
        const query = `INSERT INTO cycles ${keys} VALUES ${values};`
        db.prepare(query).run();
    }
}

process.exit()