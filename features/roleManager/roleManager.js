module.exports = roleManager = (bot) => {
    // On member join
    bot.on("guildMemberAdd", async message => {

        let embed = {
            author: {
                name: `Welcome to ${message.guild.name}`,
                icon_url: message.guild.iconURL()
            },
            description: `You joined to ${message.guild.name} server, now you have to choose role you want to get`,
            color: 'RANDOM',
            timestamp: new Date(),
            footer: {
                text: message.user.nickname,
                icon_url: message.client.user.avatarURL(),
            },
            thumbnail: {
                url: message.guild.iconURL()
            },
            fields: [{
                name: "Roles list",
                value: message.guild.roles.cache.map((e) => `${e.name}`).join(', ')
            },
                {
                    name: "What to do next?",
                    value: `Write command /role <Role name>`
                }]
        }

        let channelName = `welcome_${message.user.username}`

        await message.guild.channels.create(channelName,{type: 'text'})
        let newChannel = message.guild.channels.cache.find(x => x.name === channelName)

        newChannel.send({embed})
    })
}

