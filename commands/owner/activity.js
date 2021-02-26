const {Command} = require('discord.js-commando');
const discord = require('discord.js');

module.exports = class ActivityCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'activity',
            group: 'owner',
            memberName: 'activity',
            description: 'Установить активность бота',
            ownerOnly: true,
            args: [
                {
                    key: 'activity',
                    prompt: 'Какую активность вы хотите установить?',
                    type: 'string',
                    oneOf: ['twitch', 'music', 'watch', 'game'],
                },
                {
                    key: 'name',
                    prompt: 'Какое название вашей активности?',
                    type: 'string',
                },
            ],
            hidden: true
        });
    }

    run(message, {activity, name}) {

        const newActivity = (activity, name) => {
            if (activity !== 'STREAMING') {
                this.client.user.setActivity(name, {
                    type: activity
                })
            } else {
                this.client.user.setActivity(name, {
                    type: "STREAMING", url: "https://www.twitch.tv/nrkkkk_"
                })
            }
        }

        switch (activity) {
            case "game":
                newActivity("PLAYING", name)
                break

            case "watch":
                newActivity("WATCHING", name)
                break

            case "music":
                newActivity("LISTENING", name)
                break

            case "twitch":
                newActivity("STREAMING", name)
                break
        }

        message.channel.type !== "dm" ? message.delete() : null // Check If not DM

        return message.direct(new discord.MessageEmbed()
            .setColor('#1bdbbe')
            .setTitle(`Установлена активность`)
            .setAuthor(message.client.user.username, message.client.user.avatarURL())
            .addFields(
                {
                    name: 'Активность',
                    value: activity
                },
                {
                    name: 'Название',
                    value: name,
                },
            )
            .setTimestamp()
            .setFooter(message.client.user.username, message.client.user.avatarURL())
        );
    }
};