function getExchange() {
    if (process.env.EXCHANGE == 'MEXC') {
        console.log("Using MexC");
        return import('./mexc.ts')
    } else {
        console.log("Using default exchange");
        return import('./xeggex.ts')
    }
}

export const Exchange = await getExchange();
