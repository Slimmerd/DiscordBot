const {Command} = require('discord.js-commando');
const discord = require('discord.js');

module.exports = class StatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'status',
            group: 'owner',
            memberName: 'status',
            description: 'Установить статус бота',
            ownerOnly: true,
            args: [
                {
                    key: 'status',
                    prompt: 'Какой статус вы хотите установить?',
                    type: 'string',
                    default: 'online',
                    oneOf: ['online', 'dnd', 'invisible', 'idle'],
                },
            ],
            hidden: true
        });
    }

    run(message, {status}) {
        const newStatus = (status) => {
            this.client.user.setStatus(status);
        }

        switch (status) {
            case "online":
                newStatus("online")
                break

            case "dnd":
                newStatus("dnd")
                break

            case "invisible":
                newStatus("invisible")
                break

            case "idle":
                newStatus("idle")
                break
        }


        message.channel.type !== "dm" ? message.delete() : null // Check If not DM

        return message.direct(new discord.MessageEmbed()
            .setColor('#073b88')
            .setTitle(`Установлен статус`)
            .setAuthor(message.client.user.username, message.client.user.avatarURL())
            .addFields(
                {
                    name: 'Статус',
                    value: status,
                },
                {
                    name: 'Статус на сервере',
                    value: message.client.user.presence.status,
                },
            )
            .setTimestamp()
            .setFooter(message.client.user.username, message.client.user.avatarURL())
        );

    }
};