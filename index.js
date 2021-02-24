const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()

client.on('ready', ()=>{
    console.log('The client is ready')

})

client.login(process.env.TOKEN)
