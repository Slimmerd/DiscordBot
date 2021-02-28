const discord = require('discord.js');
const {Command} = require('discord.js-commando');

module.exports = class PruneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prune',
            aliases: ['pr'],
            group: 'misc',
            memberName: 'prune',
            description: 'Clears chat',
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'amount',
                    prompt: 'How much messages you want to delete',
                    type: 'integer',
                    validate: text => text <= 100,
                },
            ],
        });
    }

    //FIX: Real amount and delete more than 100
    async run(message, {amount}) {
        await message.delete()

        const {guild} = message
        const {name} = guild
        const icon = guild.iconURL()

        return message.channel.bulkDelete(amount, true).then(() => {
            message.say(new discord.MessageEmbed()
                .setAuthor(name, icon)
                .setTitle(`♻️ Chat was cleared`)
                .setDescription(`Deleted: ${amount}`)
                .setColor('#22c633')
                .setTimestamp()
                .setFooter(message.client.user.username, message.client.user.avatarURL())
            ).then(msg => msg.delete({timeout: 5000}))
        })
    }
};