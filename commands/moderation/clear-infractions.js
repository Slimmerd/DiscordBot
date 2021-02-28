const db = require('quick.db');
const infractions = require('./infractions');

const {Command} = require('discord.js-commando');

module.exports = class InfractionsClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'infractions-clear',
            aliases: ['warnings-clear'],
            memberName: 'infractions-clear',
            group: 'moder',
            description: "Clears warns for particular user",
            userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            guildOnly: true,
            args: [
                {
                    key: "userName",
                    prompt: 'Please mention the user you want to clear infractions with @ or provide his ID.',
                    type: 'string',
                },
            ]
        });
    }

    async run(message,{userName}){
        const user = message.mentions.users.first()

        if(user.id === message.author.id) return message.channel.send('You can\'t clear your own warnings');

        if(infractions === null) return message.channel.send(`**${user.username} has no warnings**`);

        db.delete(`warnings_${message.guild.id}_${user.id}`);

        return message.channel.send('Success!')
    }
}