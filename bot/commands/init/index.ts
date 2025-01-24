import fs from 'node:fs/promises'

async function validatePremium() {
    const CUSTOMER_ID = process.env.CUSTOMER_ID as string;

    if (!CUSTOMER_ID) {
        console.error('\nNo customer id provided \n')
        console.log('Add in .env CUSTOMER_ID=your_customer_id ')
        process.exit()
    }

    const serverValidator = process.env.SERVER_VALIDATOR as string || 'https://validator.cryptomancien.com'

    const response = await fetch(serverValidator, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            CUSTOMER_ID,
        })
    })

    const result = await response.json()
    if ( ! result) {
        console.error('customer id not found or subscription not found')
        process.exit()
    }
}

async function createDotEnvIfNotExists() {
    const dotenvExists = await fs.exists('.env')
    if (dotenvExists) {
        return
    }

    const content = 'CUSTOMER_ID=\n\nAPI_PUBLIC=\nAPI_SECRET=\n\nBUY_OFFSET=-500\nSELL_OFFSET=500\nPERCENT_AVAILABLE=6'

    await fs.writeFile('.env', content, 'utf8')
}

export default async function() {
    await validatePremium()
    await createDotEnvIfNotExists()
}