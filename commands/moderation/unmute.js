const {Command} = require('discord.js-commando');

module.exports = class UnMuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            memberName: 'unmute',
            group: 'moder',
            description: "Unmute user",
            userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            args: [
                {
                    key: "userName",
                    prompt: 'Please mention the user you want to unmute with @ or provide his ID.',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, {userName}) {
        let user = message.mentions.members.first()
        let mutedRole = message.guild.roles.cache.find(x => x.name === "Muted");

        if(user.roles.cache.has(mutedRole)) return message.channel.send("This member isn't muted");

        await user.roles.remove(mutedRole);

        return message.channel.send(`${user} has been unmuted`)
    }
};






