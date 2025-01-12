import check from './bot/commands/check';
import server from './bot/commands/server'
import startNewCycle from './bot/commands/new';
import update from './bot/commands/update';
import cancel from './bot/commands/cancel';
import test from './bot/commands/test';

function menu() {
    console.log('\nSimple Trading Bot v2 \n');
    console.log('--check          -c        Check config \n');
    console.log('--new            -n        Start new cycle \n');
    console.log('--update         -u        Update running cycles \n');
    console.log('--cancel=:id     -cc=:id   Cancel cycle by id \n');
    console.log('--server         -s        Run server \n');
    console.log('--test           -t        Test exchange integration (create then cancel order)\n')
    process.exit();
}

let lastArg = Bun.argv.at(-1);

if (lastArg?.includes('--cancel') || lastArg?.includes('-cc')) {
    lastArg = 'cancel'
}

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
    case 'cancel':
        await cancel()
        break
    case '-s':
    case '--server':
        server();
        break;
    case '-t':
    case '--test':
        test()
        break;
    default:
        menu();
}