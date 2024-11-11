import type {CycleType} from '../types';
import {Status} from '../types'
import {Database} from 'bun:sqlite';
import db from '../services/db'

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
        '${cycle.order_buy_price}',
        '${cycle.order_buy_id}',
        '${cycle.order_sell_price}'
    )`;

    db.prepare(query).run();

}

export function getById(id: number) {
    const query = `SELECT * FROM cycles WHERE id = '${id}' LIMIT 1`;
    return db.query(query).get();
}

export function updateStatus(id: number, status: Status) {
    const query = `UPDATE cycles SET status = '${status}' WHERE id = '${id}'`;
    db.prepare(query).run();
}

export async function updateTargetSell(id: number, price: number): Promise<void> {

}

export async function updateOrderSellId(id: number, idOrderSell: string): Promise<void> {

}

export function list() {
    return db.query('SELECT * FROM cycles ORDER BY id DESC').all();
}

export function listUncompleted() {
    const query = `SELECT * FROM cycles WHERE status != '${Status.COMPLETED}'`;
    return db.query(query).all();
}

export function listCompleted() {
    const query = `SELECT * FROM cycles WHERE status = '${Status.COMPLETED}'`;
    return db.query(query).all();
}