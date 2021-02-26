const discord = require('discord.js');
const {Command} = require('discord.js-commando');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'misc',
            memberName: 'ping',
            description: 'Возвращает задержку бота и API',
        });
    }

    async run(message) {
        const embed = new discord.MessageEmbed()
            .setThumbnail(`https://images.emojiterra.com/google/android-pie/512px/23f1.png`)
            .setColor(0xffcc00)
            .setTitle('Пинг')
            .addField(`Идет подсчет`, ('1 2 3'), false)
            .setFooter(message.client.user.username, message.client.user.avatarURL())
            .setTimestamp();

        message.channel.type !== "dm" ? message.delete() : null // Check If not DM

        return message.reply(embed).then(result => {
            const ping = result.createdTimestamp - message.createdTimestamp

            result.edit(
                new discord.MessageEmbed()
                    .setThumbnail(`https://images.emojiterra.com/google/android-pie/512px/23f1.png`)
                    .setColor(0xffcc00)
                    .setTitle('Пинг')
                    .addField('Задержка бота:', `${ping} мс`)
                    .addField('API задержка:', `${this.client.ws.ping} мс`)
                    .setFooter(message.client.user.username, message.client.user.avatarURL())
                    .setTimestamp()

            )
        });
    }

};
