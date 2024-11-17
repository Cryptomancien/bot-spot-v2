# Simple Trading Bot V2

![alt text](https://pbs.twimg.com/media/GYvhSB1WcAA1Z61?format=png&name=medium "Title")

## Required

<ul>
    <li><a href="https://git-scm.com" target="_blank">Git</a></li>
    <li><a href="https://bun.sh" target="_blank">Bun</a></li>
    <li><a href="https://code.visualstudio.com" target="_blank">VSC</a></li>
    <li><a href="https://cmder.app" target="_blank">Cmder</a> if you use Windows</li>
</ul>

## Install

``` bash
git clone https://github.com/Cryptomancien/bot-spot-v2.git
cd bot-spot-v2
bun install
cp .env.example .env
```

## Config

- Create an account on <a href="https://xeggex.com?ref=63becde7b77440cd1b35f620">XeggeX</a>
- Enable 2FA
- Create API key
- Fill USDT
- Change keys in .env

## Launch

``` bash
bun run main.ts
```

A menu will appear
```
Simple Trading Bot v2
--check      -c    Check config
--new        -n    Start new cycle
--update     -n    Update running cycles
--server     -s    Run server
```

Then check the setup.
``` bash
bun run main.ts -c
```
```
✅  .env ok
✅  API_PUBLIC ok
✅  API_SECRET ok
✅  database ok
✅  keys ok
✅  USDT wallet ok
✅  Project updated

Everything look's like good
You can run a new cycle or update not completed ones
```

Once it's done, you have 2 commands to run every day (or every week or what ever)
``` bash
bun run main.ts -n
```

Once it's done, you can update uncompleted ones.
``` bash
bun run main.ts -u
```

```
Buy order xxx still active
Buy order xxx still active
Buy order xxx still active
Buy order xxx still active
Buy order xxx still active
Buy order xxx still active
```

Enjoy
