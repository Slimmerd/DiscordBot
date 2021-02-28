const {Command} = require('discord.js-commando');

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            memberName: 'mute',
            group: 'moder',
            description: "Mute user",
            userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: "userName",
                    prompt: 'Please mention the user you want to mute with @ or provide his ID.',
                    type: 'string',
                },
                {
                    key: 'muteReason',
                    prompt: 'Please provide reason for muting user',
                    type: "string",
                    default: 0
                },
                {
                    key: "muteTime",
                    prompt: 'How long in mutes user should be muted?',
                    type: "string",
                    default: 0
                }
            ]
        });
    }

    async run(message, {userName, muteReason, muteTime}) {
        await message.delete()
        let user = message.mentions.members.first()
        let mutedRole = message.guild.roles.cache.find(x => x.name === "Muted");

        if (user.id === message.author.id) return message.channel.send({
            embed: {
                title: `❌ You can\'t mute yourself`,
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

        if (!mutedRole) return message.channel.send({
            embed: {
                title: `❌ Cannot find role 'Muted", please create role "Muted"`,
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

        if (muteReason === 0) muteReason = "Unspecified"
        if (muteTime === 0) muteTime = "Forever"

        await message.channel.send({
            embed: {
                title: `✅️️ **${user}** has been muted`,
                fields: [
                    {
                        name: '⚠️ Reason:',
                        value: muteReason
                    },
                    {
                        name: '⏱ Mute time:',
                        value: muteTime + 'minutes'
                    }],
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
        })

        await user.roles.add(mutedRole, `Muted by ${message.author.tag} for ${muteTime} minutes. Reason: ${muteReason}`);

        await user.send({
            embed: {
                title: `⛔️️ You were muted in **${message.guild.name}**`,
                fields: [
                    {
                        name: '⚠️ Reason:',
                        value: muteReason
                    },
                    {
                        name: '⏱ Mute time:',
                        value: muteTime + 'minutes'
                    }],
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

        if (muteTime > 0) {
            setTimeout(() => {
                user.roles.remove(mutedRole, `Temporary mute expired.`);
                message.channel.send({
                    embed: {
                        title: `🍻 **${user}** has been unmuted because mute time expired`,
                            description: `Quick remind, user was muted for the following reason: **\`${muteReason}\`**`,
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
            }, muteTime * 60000); // time in ms
        }
    }
};

