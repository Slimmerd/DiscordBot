const {Command} = require('discord.js-commando');

module.exports = class UnMuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            memberName: 'unmute',
            group: 'moder',
            description: "Unmute user",
            userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: "userName",
                    prompt: 'Please mention the user you want to unmute with @ or provide his ID.',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, {userName}) {
        await message.delete()
        let user = message.mentions.members.first()
        let mutedRole = message.guild.roles.cache.find(x => x.name === "Muted");

        if (user.roles.cache.has(mutedRole)) return message.channel.send({
            embed: {
                title: `⚠️ **${user}** is not muted`,
                color: '#be1313',
                timestamp: Date.now(),
                thumbnail: {
                    url: message.guild.iconURL()
                },
                footer: {
                    icon_url: message.client.user.avatarURL(),
                    text: message.client.user.username
                },
                author: {
                    name: message.guild.name,
                    icon_url: message.guild.iconURL()
                }
            }
        });

        await user.roles.remove(mutedRole);

        return message.channel.send({
            embed: {
                title: `🍻 **${user}** has been unmuted`,
                color: '#be1313',
                timestamp: Date.now(),
                thumbnail: {
                    url: message.guild.iconURL()
                },
                footer: {
                    icon_url: message.client.user.avatarURL(),
                    text: message.client.user.username
                },
                author: {
                    name: message.guild.name,
                    icon_url: message.guild.iconURL()
                }
            }
        })
    }
};






