const {Command} = require('discord.js-commando');

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            memberName: 'kick',
            group: 'moder',
            description: 'Kicks a tagged member.',
            guildOnly: true,
            userPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'userToKick',
                    prompt:
                        'Please mention the user you want to kick with @ or provide his ID.',
                    type: 'string'
                },
                {
                    key: 'reason',
                    prompt: 'Why do you want to kick this user?',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, {userToKick, reason}) {
        await message.delete()
        const extractNumber = /\d+/g;
        const userToKickID = userToKick.match(extractNumber)[0];
        const user =
            message.mentions.members.first() ||
            (await message.guild.members.fetch(userToKickID));
        if (user === undefined)
            return message.channel.send({
                embed: {
                    title: `⚠️️ Please try again with a valid user`,
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

        user.kick(reason)
            .then(() => {
                message.channel.send({
                    embed: {
                        title: `‼️ **${userToKick}** kicked`,
                        fields: [
                            {
                                name: '⚠️ Reason:',
                                value: reason
                            }
                        ],
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
            })
            .catch(err => {
                message.reply({
                        embed: {
                            title: `❌ Something went wrong when trying to kick this user`,
                            description: 'I probably do not have the permission to kick him',
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
                    }
                );
                return console.error(err);
            });
    }
};