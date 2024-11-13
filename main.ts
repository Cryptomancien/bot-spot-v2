import check from './bot/commands/check';
import server from './bot/commands/server'
import startNewCycle from './bot/commands/new';
import update from './bot/commands/update';

function menu() {
    console.log('\nSimple Trading Bot v2 \n');
    console.log('--check      -c    Check config \n');
    console.log('--new        -n    Start new cycle \n');
    console.log('--update     -n    Update running cycles \n');
    console.log('--server     -s    Run server \n');
}

const lastArg = Bun.argv.at(-1);

switch (lastArg) {
    case '-c':
    case '--check':
        await check();
        break;
    case '-n':
    case '--new':
        await startNewCycle();
        break;
    case '-u':
    case '--update':
        await update();
        break;
    case '-s':
    case '--server':
        server();
        break;
    default:
        menu();
}