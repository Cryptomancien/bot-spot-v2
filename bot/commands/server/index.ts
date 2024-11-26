import { styleText } from 'node:util';
import express from 'express';
import nunjucks from 'nunjucks';
import * as Cycle from '../../database/cycle';
import type { CycleType } from '../../types.ts';

const app = express();

nunjucks.configure('bot/commands/server/views', {
  autoescape: true,
  express: app,
  watch: true
});

app.get('/', async (request, response) => {
  const cycles = Cycle.list();

  let buyTotal = 0;
  let sellTotal = 0;

  const uncompletedCycles = Cycle.listUncompleted() as Array<CycleType>;
  const completedCycles = Cycle.listCompleted() as Array<CycleType>;

  for (const cycle of completedCycles) {
    const buy = cycle.order_buy_price * cycle.quantity;
    const sell = cycle.order_sell_price * cycle.quantity;

    buyTotal += buy;
    sellTotal += sell;
  }

  let percent = 0;
  if (sellTotal > 0) {
    percent = ((sellTotal - buyTotal) / buyTotal) * 100;
  }

  const data = {
    cycles,
    buyTotal,
    sellTotal,
    percent,
    uncompletedCycles,
    completedCycles
  };

  response.render('index.html', data);
});

export default function () {
  app.listen(8080, () => {
    console.log(styleText('green', '\nStarting local server'));
    console.log('http://localhost:8080 \n');
    console.log('Ctrl + c to exit');
  });
}
