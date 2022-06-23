require('dotenv').config()
const { login, getKeys, revokeKey, createKey, getCookie, getIP } = require('./utils')

async function getNewAPI(game, email, password, whitelist = [], fixedIp = ''){
    try {
        if (!email || !password) {
            if(!process.env.email || !process.env.password) {
                throw new Error('email and password are required')
            }else {
                email = process.env.email
                password = process.env.password
            }
            
        }

        if (!game) {
            throw new Error('game id is required')
        }

        if (game === 'cr') game = 'clashroyale'
        if (game === 'coc') game = 'clashofclans'
        if (game === 'bs') game = 'brawlstars'

        if (game !== 'clashroyale' && game !== 'clashofclans' && game !== 'brawlstars') {
            throw new Error('game id must be either "clashroyale", "clashofclans", "brawlstars", "cr", "coc" or "bs"')
        }

        const baseUrl = `https://developer.${game}.com/api`

        // login
        const loginResponse = await login({ baseUrl, email, password })
        if (loginResponse?.error) {
            throw new Error(loginResponse)
        }

        // get cookie
        const cookie = await getCookie(loginResponse)

        // get current keys:
        const savedKeys = await getKeys({ baseUrl, cookie })

        // get current IP
        const ip = fixedIp || await getIP()

        // check if exists a key with the same IP:
        const keyWithSameIP = savedKeys.find(key => key.cidrRanges.includes(ip))

        let validApiKey
        if (keyWithSameIP) {
            validApiKey = keyWithSameIP
        } else {
            // revoke the first key which is not whitelisted
            if (savedKeys.length === 10) {
                const keyToRevoke = savedKeys.find(key => !whitelist.includes(key.name))
                await revokeKey({ baseUrl, cookie, keyToRevoke })
            }

            // create new key
            const newKey = await createKey({ baseUrl, cookie, ips: [ip] })
            if (newKey?.error) {
                throw new Error(newKey)
            }

            validApiKey = newKey.key
        }

        return {
            name: validApiKey.name,
            description: validApiKey.description,
            ipRange: validApiKey.cidrRanges,
            key: validApiKey.key
        }
    } catch (error) {
        throw error 
    }
}

module.exports={getNewAPI}