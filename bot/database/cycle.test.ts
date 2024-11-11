import {expect, test} from 'bun:test'
import * as Cycle from './cycle'
import {type CycleType, Status} from '../types';

test.skip('list all cycles', async () => {
    const cycles = await Cycle.list()
    expect(cycles).toBeArray();
});

test('update cycle status', async () => {
    const id = 2;
    const status = Status.COMPLETED
    await Cycle.updateStatus(id, status);

    const cycle = await Cycle.getById(id) as CycleType;
    expect(cycle.status).toBe(status)
});