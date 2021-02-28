const {Command} = require('discord.js-commando');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            memberName: 'ban',
            group: 'moder',
            description: 'Bans a tagged member.',
            guildOnly: true,
            userPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'userToBan',
                    prompt:
                        'Please mention the user you want to ban with @ or provide his ID.',
                    type: 'string'
                },
                {
                    key: 'reason',
                    prompt: 'Why do you want to ban this user?',
                    type: 'string'
                },
                {
                    key: 'daysDelete',
                    prompt:
                        'How many days worth of messages do you want to delete from this user?',
                    type: 'integer',
                    validate: function validate(daysDelete) {
                        return daysDelete < 31 && daysDelete > 0;
                    }
                }
            ]
        });
    }

    async run(message, {userToBan, reason, daysDelete}) {
        await message.delete()
        const extractNumber = /\d+/g;
        const userToBanID = userToBan.match(extractNumber)[0];
        const user =
            message.mentions.members.first() ||
            (await message.guild.members.fetch(userToBanID));
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
        user
            .ban({days: daysDelete, reason: reason})
            .then(() => {
                message.channel.send({
                    embed: {
                        title: `⛔️ **${userToBan}** banned`,
                        fields: [
                            {
                                name: '⚠️ Reason:',
                                value: reason
                            }
                        ],
                        color: '#13be43',
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
                            title: `❌ Something went wrong when trying to ban this user`,
                            description: 'I probably do not have the permission to ban him',
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