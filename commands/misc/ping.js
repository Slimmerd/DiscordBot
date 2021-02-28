const discord = require('discord.js');
const {Command} = require('discord.js-commando');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'misc',
            memberName: 'ping',
            description: 'Returns Bot and Server latency',
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    }

    async run(message) {
        const embed = new discord.MessageEmbed()
            .setThumbnail(`https://images.emojiterra.com/google/android-pie/512px/23f1.png`)
            .setColor(0xffcc00)
            .setTitle('Ping')
            .addField(`Calculating`, ('...1 ...2 ...3'), false)
            .setFooter(message.client.user.username, message.client.user.avatarURL())
            .setTimestamp();

        message.channel.type !== "dm" ? await message.delete() : null // Check If not DM

        return message.reply(embed).then(result => {
            const ping = result.createdTimestamp - message.createdTimestamp

            result.edit(
                new discord.MessageEmbed()
                    .setThumbnail(`https://images.emojiterra.com/google/android-pie/512px/23f1.png`)
                    .setColor(0xffcc00)
                    .setTitle('Ping')
                    .addField('Bot latency:', `${ping} ms`)
                    .addField('API latency:', `${this.client.ws.ping} ms`)
                    .setFooter(message.client.user.username, message.client.user.avatarURL())
                    .setTimestamp()
            )
        });
    }

};
