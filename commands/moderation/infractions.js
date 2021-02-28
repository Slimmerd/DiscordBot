const db = require('quick.db');
const {Command} = require('discord.js-commando');

module.exports = class InfractionsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'infractions',
            aliases: ['warnings'],
            memberName: 'infractions',
            group: 'moder',
            description: "List warns for particular user",
            userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            guildOnly: true,
            args: [
                {
                    key: "userName",
                    prompt: 'Please mention the user you want to check with @ or provide his ID.',
                    type: 'string',
                },
            ]
        });
    }

    async run(message, {userName}) {
        const user = message.mentions.users.first() //|| message.author;

        let warnings = await db.get(`warnings_${message.guild.id}_${user.id}`);

        if (warnings === null) warnings = 0;

        return message.channel.send(`**${user.username}** has *${warnings}* warning(s)`);
    }
}
