CREATE TABLE IF NOT EXISTS cycles (
    id INTEGER PRIMARY KEY NOT NULL,
    status VARCHAR(50),
    quantity REAL,
    order_buy_target REAL,
    order_buy_id VARCHAR(100),
    order_sell_target REAL,
    order_sell_id VARCHAR(100)
);
