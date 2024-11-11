import type {CycleType} from '../types';
import {Status} from '../types'
import {Database} from 'bun:sqlite';

const db = new Database('storage/db.sqlite', {create: true});

export async function startCycle(cycle: CycleType) {
    const query =
    `INSERT INTO cycles 
    (
        status,
        quantity,
        order_buy_price,
        order_buy_id,
        order_sell_price
    ) 
    VALUES (
        '${Status.ORDER_BUY_PLACED}', 
        '${cycle.quantity}',
        '${cycle.order_buy_target}',
        '${cycle.order_buy_id}',
        '${cycle.order_sell_target}'
    )`;

    db.prepare(query).run();

}

export async function getById(id: number) {
    const query = `SELECT * FROM cycles WHERE id = '${id}' LIMIT 1`;
    return db.query(query).get();
}

export async function updateStatus(id: number, status: Status): Promise<void> {
    const query = `UPDATE cycles SET status = '${status}' WHERE id = '${id}'`;
    db.prepare(query).run();
}

export async function updateTargetSell(id: number, price: number): Promise<void> {

}

export async function updateOrderSellId(id: number, idOrderSell: string): Promise<void> {

}

export async function list() {
    return db.query('SELECT * FROM cycles').all();
}