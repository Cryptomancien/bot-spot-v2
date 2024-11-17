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
# Menu
bun run main.ts

# Check requirement
bun run main.ts -c

# Start new cycle
bun run main.ts -n

# Update running cycles
bun run main.ts -u

# Start local server, port 8080
bun run main.ts -s
```