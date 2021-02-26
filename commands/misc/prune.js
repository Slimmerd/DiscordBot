const discord = require('discord.js');
const {Command} = require('discord.js-commando');

module.exports = class PruneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prune',
            aliases: ['pr'],
            group: 'misc',
            memberName: 'prune',
            description: 'Чистка чата',
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            args: [
                {
                    key: 'amount',
                    prompt: 'Как много сообщений вы хотите удалить',
                    type: 'integer',
                    validate: text => text <= 100,
                },
            ],
        });
    }

    run(message, {amount}) {
        const {guild} = message
        const {name} = guild
        const icon = guild.iconURL()

        return message.channel.bulkDelete(amount, true).then(() => {
            message.say(new discord.MessageEmbed()
                .setAuthor(name, icon)
                .setTitle(`♻️ Сообщения были удалены`)
                .setDescription(`Удалено ${amount} штук`)
                .setColor('#22c633')
                .setTimestamp()
                .setFooter(message.client.user.username, message.client.user.avatarURL())
            ).then(msg => msg.delete({timeout: 5000}))
        })
    }
};