import {test, expect} from 'bun:test'
import * as Cycle from './cycle'
import {type Cycle as CycleType, Status} from '../types.ts'

test('list all cycles', async () => {
    const cycles = await Cycle.list()
    expect(cycles).toBeArray();
});