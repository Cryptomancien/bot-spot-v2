import type { CycleType } from '../types';
import { Status } from '../types'
import db from '../services/db'

export function insert(cycle: CycleType) {

    const {quantity, order_buy_price, order_buy_id, order_sell_price} = cycle

    const query =
    `INSERT INTO cycles 
    (
        status,
        quantity,
        order_buy_price,
        order_buy_id,
        order_sell_price,
        order_sell_id
    ) 
    VALUES (
        '${Status.ORDER_BUY_PLACED}', 
        '${quantity}',
        '${order_buy_price}',
        '${order_buy_id}',
        '${order_sell_price}',
        ''
        ) RETURNING id`;

    return db.prepare(query).get();
}

export function getById(id: number) {
    const query = `SELECT * FROM cycles WHERE id = '${id}' LIMIT 1`;
    return db.query(query).get();
}

export function updateStatus(id: number, status: Status) {
    const query = `UPDATE cycles SET status = '${status}' WHERE id = '${id}'`;
    db.prepare(query).run();
}

export function updateOrderSellPrice(id: number, price: number) {
    const query = `UPDATE cycles SET order_sell_price = ${price} WHERE id = '${id}'`;
    db.prepare(query).run();
}

export function updateOrderSellId(id: number, orderSellId: string) {
    const query = `UPDATE cycles SET order_sell_id = '${orderSellId}' WHERE id = '${id}'`;
    db.prepare(query).run();
}

export function deleteCycleById(id: number) {
    const query = `DELETE FROM cycles WHERE id = ${id}`;
    return db.prepare(query).run();
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