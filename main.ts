import { parseArgs } from "util";

import check from './bot/commands/check';
import server from './bot/commands/server'
import startNewCycle from './bot/commands/new';
import updateCycles from './bot/commands/update';

function menu() {
    console.log('\nSimple Trading Bot v2.1');
    console.log('\nCommands: (c)heck, (n)ew, (u)pdate, (s)erve\n')
    console.log('   check                      Check config');
    console.log('   new        [--dry-run]     Start new cycle');
    console.log('   update     [--dry-run]     Update running cycles');
    console.log('   serve                      Run server');
    console.log('\nParameters:')
    console.log('   --dry-run                  Do not place order in Exchange (and do not change the database)')
    process.exit();
}

const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
        "dry-run": {
            type: 'boolean',
            default: false
        }
    },
    strict: true,
    allowPositionals: true,
});

const command = positionals.at(-1)
const dryRun = values["dry-run"] || false

switch (command) {
    case 'c':
    case 'check':
        await check();
        break;
    
    case 'n':
    case 'new':
        await startNewCycle(dryRun);
        break;
    
    case 'u':
    case 'update':
        await updateCycles(dryRun);
        break;
        
    case 's':
    case 'serve':
        server();
        break;

    default:
        menu();
}