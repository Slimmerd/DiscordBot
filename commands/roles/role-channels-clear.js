const {Command} = require('discord.js-commando');
const db = require('quick.db');

module.exports = class RoleChannelsClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role-channels-clear',
            aliases: ['rcs-clear'],
            memberName: 'role-channels-clear',
            group: 'roles',
            description: "Clear all assigned role channels",
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    }

    async run(message, {roleName, roleChannel}) {
        await message.delete()
        let key = `roles_${message.guild.id}`

        let deleteState = await db.delete(key)

        if (deleteState) {
            let check = await db.has(key)
            if (check) {
                let embed = {
                    title: `❌ [ERROR] All assigned channels **NOT** deleted`,
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
                return message.channel.send({embed})
            } else {
                let embed = {
                    title: `🗑 All assigned channels deleted`,
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

                return message.channel.send({embed})
            }
        } else {
            let embed = {
                title: `⛔️ Database is empty`,
                description: 'There is no assigned roles for your guild',
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
            return message.channel.send({embed})
        }
    }
};