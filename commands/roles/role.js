const voteForRole = require("@features/roleManager/voteForRole")

const {Command} = require('discord.js-commando');

module.exports = class RoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role',
            memberName: 'role',
            group: 'roles',
            description: "Choose role",
            guildOnly: true,
            args: [
                {
                    key: "roleName",
                    prompt: 'What is the chosen role?',
                    type: 'string',
                }
            ],
            throttling: {
                usages: 1,
                duration: 60
            },
        });
    }

    async run(message, {roleName}) {
        await message.delete()
        await voteForRole(message, roleName).then(msg => {
            // console.warn(msg)
            if (msg === 'Accepted') {
                let embed = {
                    title: `✅ Vote process finished`,
                    description: `You have got role ${roleName}`,
                    color: '#13be43',
                    timestamp: Date.now(),
                    footer: {
                        icon_url: message.client.user.avatarURL(),
                        text: message.client.user.username
                    },
                    author: {
                        name: message.guild.name,
                        icon_url: message.guild.iconURL()
                    },
                    thumbnail: {
                        url: message.guild.iconURL()
                    },
                    fields: [
                        {
                            name: "✅️ Access to channels:",
                            value: "Now you have access to the channels that your role has access"
                        },
                        {
                            name: "⚠️ Please read and accept rules:",
                            value: "If you have not accepted it before"
                        },
                        {
                            name: "🛂 You can obtain more roles:",
                            value: "You can start another vote process for other available role by using:```\/role <RoleName>```"
                        }
                    ]
                }
                message.reply({embed})

                setTimeout(() => {
                    let channelName = `welcome_${message.author.username}`
                    let foundChannel = message.guild.channels.cache.find(x => x.name === channelName)
                    foundChannel?.delete()
                }, 10000)
            } else if (msg === 500) {
                return 0
            } else {
                let embed = {
                    title: `❌ Vote process finished`,
                    description: `You have **NOT** got role ${roleName}`,
                    color: '#be1313',
                    timestamp: Date.now(),
                    footer: {
                        icon_url: message.client.user.avatarURL(),
                        text: message.client.user.username
                    },
                    author: {
                        name: message.guild.name,
                        icon_url: message.guild.iconURL()
                    },
                    thumbnail: {
                        url: message.guild.iconURL()
                    },
                    fields: [
                        {
                            name: "1️⃣️ Contact server administrator:",
                            value: "He will help you to obtain the role"
                        },
                        {
                            name: "2️⃣ Try again:",
                            value: "You can start vote process again with command ```\/role <RoleName>```"
                        }
                    ]
                }
                return message.reply({embed})
            }
        })
    }
}
