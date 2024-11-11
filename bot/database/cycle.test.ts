import {expect, test} from 'bun:test'
import * as Cycle from './cycle'
import {type CycleType, Status} from '../types';

test.skip('list all cycles', () => {
    const cycles = Cycle.list()
    expect(cycles).toBeArray();
});

test.skip('update cycle status', () => {
    const id = 2;
    const status = Status.COMPLETED
    Cycle.updateStatus(id, status);

    const cycle = Cycle.getById(id) as CycleType;
    expect(cycle.status).toBe(status);
});

test.skip('list all uncompleted cycles', () => {
    const cycles = Cycle.listUncompleted();
    console.log(cycles)
});

test('list all completed cycles', () => {
    const cycles = Cycle.listCompleted();
    console.log(cycles)
});