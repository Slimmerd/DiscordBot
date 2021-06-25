const {db} = require("@util/dbInit");
const {Command} = require('discord.js-commando');

module.exports = class InfractionsClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'infractions-clear',
            aliases: ['warnings-clear'],
            memberName: 'infractions-clear',
            group: 'moder',
            description: "Clears warns for particular user",
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
                    prompt: 'Please mention the user you want to clear infractions with @ or provide his ID.',
                    type: 'string',
                },
            ]
        });
    }

    async run(message, {userName}) {
       await message.delete()

        const user = message.mentions.users.first()
        let key = `warnings_${message.guild.id}_${user.id}`

        if (user.id === message.author.id) return message.channel.send({
            embed: {
                title: `❌ You can\'t clear your own warnings`,
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

        let deleteState = await db.delete(key);

        if (deleteState) {
            let check = await db.has(key)

            if (!check) {
                return message.channel.send({
                        embed: {
                            title:
                                `✅ All infractions **${user.username}** deleted`,
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
                )
            } else {
                return message.channel.send({
                    embed: {
                        title: `❌ [ERROR] Infractions **NOT** deleted`,
                        color: '#be1313',
                        timestamp: Date.now(),
                        footer: {
                            icon_url: message.client.user.avatarURL(),
                            text: message.client.user.username
                        },
                        thumbnail: {
                            url: message.guild.iconURL()
                        },
                        author: {
                            name: message.guild.name,
                            icon_url: message.guild.iconURL()
                        },
                        fields: [
                            {
                                name: "⛔️ Contact bot developer:",
                                value: "Probably error in DB occurred"
                            }
                        ]
                    }
                })
            }
        } else {
            return message.channel.send({
                embed: {
                    title: `⛔️ Database is empty`,
                    description: `There is no infractions for **${user.username}**`,
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
    }
}