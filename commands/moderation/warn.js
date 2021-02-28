const {Command} = require('discord.js-commando');
const db = require('quick.db');

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            memberName: 'warn',
            group: 'moder',
            description: "Warn user",
            userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            guildOnly: true,
            args: [
                {
                    key: "userName",
                    prompt: 'Please mention the user you want to warn with @ or provide his ID.',
                    type: 'string',
                },
                {
                    key: "warnReason",
                    prompt: 'Why do you want to warn this user?',
                    type: 'string',
                    default: 0
                }
            ]
        });
    }

    async run(message, {userName, warnReason}) {
        const user = message.mentions.users.first()

        if (user.bot) return message.channel.send('You can\'t warn bots');
        if (message.author.id === user.id) return message.channel.send('You can\'t warn yourself');
        if (message.guild.owner.id === user.id) return message.channel.send('You can\'t warn the server\'s owner');

        if (warnReason === 0) warnReason = 'Unspecified'

        let warnings = db.get(`warnings_${message.guild.id}_${user.id}`);

        if (warnings === 3) return message.channel.send(`${user} has already reached three warnings`);

        if (warnings === null) {
            db.set(`warnings_${message.guild.id}_${user.id}`, 1);
            user.send(`You were warned in ${message.guild.name} for the following reason: \`${warnReason}\``)
            await message.channel.send(`**${user.username}** has been warned`)
        }

        if (warnings !== null) {
            db.add(`warnings_${message.guild.id}_${user.id}`, 1)
            user.send(`You were warned in ${message.guild.name} for the following reason: \`${warnReason}\``)
            await message.channel.send(`**${user.username}** has been warned`)
        }
    }
}