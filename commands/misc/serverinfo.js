const discord = require('discord.js');
const {Command} = require('discord.js-commando');

module.exports = class ServerInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            aliases: ['si'],
            group: 'misc',
            memberName: 'serverinfo',
            description: 'Информация о сервере',
            guildOnly: true,
        });
    }

    run(message) {
        const {guild} = message
        const {
            id,
            name,
            region,
            memberCount,
            owner,
            afkTimeout,
            roles,
            verificationLevel,
            createdAt,
            emojis,
            premiumSubscriptionCount
        } = guild
        const icon = guild.iconURL()

        const embed = new discord.MessageEmbed()
            .setColor('#db1b38')
            .setTitle(`ID: ${id}`)
            .setAuthor(name, icon)
            .setThumbnail(icon)
            .addFields(
                {
                    name: 'Уровень защиты',
                    value: verificationLevel
                },
                {
                    name: 'Регион',
                    value: region,
                    inline: true
                },
                {
                    name: 'Участники',
                    value: memberCount,
                    inline: true
                },
                {
                    name: 'Бустеров',
                    value: premiumSubscriptionCount,
                    inline: true
                },
                {
                    name: "Каналов",
                    value: guild.channels.cache.size
                },
                {
                    name: 'Создан',
                    value: createdAt,
                },
                {
                    name: 'Создатель',
                    value: owner.user.tag,
                },
                {
                    name: 'АФК счетчик',
                    value: `${afkTimeout / 60} минут`,
                },
                {name: '\u200B', value: '\u200B'},
                {
                    name: 'Роли',
                    value: roles.cache
                        .map((e) => `${e}`)
                        .join(', '),
                },
                {
                    name: 'Emoji',
                    value: emojis.cache
                        .map((e) => `${e} **-** \`:${e.name}:\``)
                        .join(', '),
                }
            )
            .setTimestamp()
            .setFooter(message.client.user.username, message.client.user.avatarURL())

        message.channel.type !== "dm" ? message.delete() : null // Check If not DM
        return message.say(embed)
    }
};