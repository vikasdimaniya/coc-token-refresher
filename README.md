## What is this?

This is an module to generate a fresh API key for Supercell games for your current IP. It supports [Clash Royale](https://developer.clashroyale.com), [Clash of Clans](https://developer.clashofclans.com) and [Brawl Stars](https://developer.brawlstars.com).

## Why?

Those API's has a limitation of **one API key per IP** and a maximum of 10 API keys per user. This is fine if you are using a single IP, but if you are using multiple IPs, you will need to generate a new API key for each IP.

## How to use it?

You can use this module by simply adding it to your project and pass game name, your email and password.
```
const CTR = require('coc-token-refresher')
async function f(){
    try{
        let response = await CTR.getNewAPI("clashroyale","yourmail","yourpassword")
        console.log(response)
    }catch(err){
        console.log(err)
    }
};
f();
```
Or If you don't want to show your email and password in the code, you can set environment variables for your email and password, they will load automatically. Example:   

TERMINAL:   
```
//On Windows
set email="your@email.com"
set password="yourPassword"

//On MAC 
export email="your@email.com"
export password="yourPassword"
```
JavaScript:   
```
const CTR = require('coc-token-refresher')
async function f(){
    try{
        let response = await CTR.getNewAPI("clashroyale")
        //This is enough. If this doesn't work for you, then can use the below code.
        //let response = await CTR.getNewAPI("clashroyale",process.env.email,process.env.password)
        console.log(response)
    }catch(err){
        console.log(err)
    }
};
f();
```
It will return a JSON object like this: 
```json
{
  "name": "Key generated at 8/2/2022 6:19:26 p. m.",
  "description": "Key for non-commercial use",
  "ipRange": [
    "xx.xx.xx.xx"
  ],
  "key": "your_key"
}
```
    Supported game IDs: clashroyale, clashofclans, brawlstars, cr, coc, bs

## How it works?

This module login into the game developer portal with your credentials, check if exists a key for your IP and if not, **delete the first key** and generate a new one for your IP. Otherwise, it will return the existing key. The logic is inspired on [TheLearneer/supercell-api](https://github.com/TheLearneer/supercell-api). The IP is obtained from [ipify](https://api.ipify.org/).

## Optional parameters
### `whitelist`
You can send a whitelist array of API key-names to avoid deleting them. Example:
```json
{
  "game": "coc",
  "email": "yourmail",
  "password": "yourpassword",
  "whitelist": [
    "important-key-1",
    "important-key-2"
  ]
}
```

### `fixedIp`
You can set a fixed IP to use instead of the current one. Example:
```json
{
  "game": "bs",
  "email": "yourmail",
  "password": "yourpassword",
  "fixedIp": "11.22.33.44"
}
```

## Contributing

Any contributions you make are greatly appreciated. If you have a suggestion that would make this better, please fork the repo and create a Pull Request. You can also simply [open an issue](https://github.com/marsidev/get-sc-key/issues/new).