const {db} = require("@util/dbInit");
const {Command} = require('discord.js-commando');

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            memberName: 'warn',
            group: 'moder',
            description: "Warn user",
            userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: "userName",
                    prompt: 'Please mention the user you want to warn with @ or provide his ID.',
                    type: 'string',
                },
                {
                    key: "warnReason",
                    prompt: 'Why do you want to warn this user?',
                    type: 'string',
                    default: 0
                }
            ]
        });
    }

    async run(message, {userName, warnReason}) {
        await message.delete()
        const user = message.mentions.users.first()

        if (user.bot) return message.channel.send({
            embed: {
                title: `❌ You can\'t warn bots`,
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

        if (message.author.id === user.id) return message.channel.send({
            embed: {
                title: `❌ You can\'t warn yourself`,
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

        if (message.guild.owner.id === user.id) return message.channel.send({
            embed: {
                title: `❌ You can\'t warn the server\'s owner`,
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


        if (warnReason === 0) warnReason = 'Unspecified'

        let warnings = await db.get(`warnings_${message.guild.id}_${user.id}`);

        if (warnings === 3) return message.channel.send({
            embed: {
                title: `⚠️ **${user}** has already reached three warnings`,
                color: '#f1d112',
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

        let userWarned = {
            embed: {
                title: `⛔️️ You were warned in **${message.guild.name}**`,
                description: `For the following reason: **\`${warnReason}\`**`,
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

        let chatNotifyWarned = {
            embed: {
                title: `✅️️ **${user.username}** has been warned`,
                description: `For the following reason: **\`${warnReason}\`**`,
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
        }

        if (warnings === null) {
            await db.set(`warnings_${message.guild.id}_${user.id}`, 1);
            user.send(userWarned)
            await message.channel.send(chatNotifyWarned)
        }

        if (warnings !== null) {
            await db.add(`warnings_${message.guild.id}_${user.id}`, 1)
            user.send(userWarned)
            await message.channel.send(chatNotifyWarned)
        }
    }
}