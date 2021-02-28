const db = require('quick.db');

module.exports = voteForRole = async (message, role) => {
    const foundRole = message.guild.roles.cache.find(x => x.name === role);
    let foundRoleEmbed = {
        title: `❌ Cannot find role ${role}`,
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
        fields: [
            {
                name: "⛔️ Contact server administrator:",
                value: "This role is not available to obtain"
            }
        ]
    }

    if (!foundRole) {
        message.channel.send({embed: foundRoleEmbed})
        return 500
    }


    let voteProcess = {
        author: {
            name: `User ${message.author.username} asking for permissions`,
            icon_url: message.client.user.avatarURL()
        },
        title: `User asking for ${foundRole.name}, you can vote to assign permission to him `,
        thumbnail: {
            url: message.author.avatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        color: 'RANDOM',
        fields: [
            {
                name: "⏱",
                value: "You have 60 seconds"
            },
            {
                name: "✅",
                value: "Assign role to the user",
                inline: true
            },
            {
                name: "❌",
                value: "Reject user's request",
                inline: true
            }],
        footer: {
            text: message.client.user.username,
            icon_url: message.client.user.avatarURL(),
        },
        timestamp: new Date(),
    }

    let res = await findTextChannel(message, foundRole)
    let test = 500

    if (res) {
        let embedUserNotify = {
            author: {
                name: message.guild.name,
                icon_url: message.guild.iconURL()
            },
            title: `⏱ Voting for assign role ${foundRole.name} has been started`,
            thumbnail: {
                url: message.guild.iconURL()
            },
            color: 'RANDOM',
            fields: [
                {
                    name: "⏱",
                    value: "You have to wait 60 seconds"
                },
                {
                    name: "❗️",
                    value: "If you got rejected, you can start vote again",
                    inline: true
                }],
            footer: {
                text: message.client.user.username,
                icon_url: message.client.user.avatarURL(),
            },
            timestamp: new Date(),
        }
        message.reply({embed: embedUserNotify})
        await res?.send({embed: voteProcess}).then(async (msg) => {
            await msg.react('✅')
            await msg.react('❌')

            const filter = (reaction) => {
                return ['✅', '❌'].includes(reaction.emoji.name)
            };
            msg.delete({timeout: 65000})

            await msg.awaitReactions(filter, {time: 60000, errors: ['time']})
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '✅') {
                        message.reply('you reacted with a thumbs up.');
                    } else {
                        message.reply('you reacted with a thumbs down.');
                    }
                })
                .catch(async collected => {
                    // console.log(`After a minute, only ${collected.size} reacted.`);
                    // collected.map(s => res.send(`Collected ${s._emoji.name} ${s.count - 1}`))

                    let votes = {
                        '✅': 0,
                        '❌': 0
                    }
                    collected.map(emoji => {
                        votes[emoji._emoji.name] = emoji.count - 1
                    })

                    if (votes['✅'] > votes['❌']) {
                        await message.guild.member(message.author).roles.add(foundRole, `Approved to obtain this role by vote process`);
                        return test = 'Accepted'
                    } else {
                        return test = 'Declined'
                    }
                })
        })

    }
    return test
}

const findTextChannel = (message, role) => {
    const key = `roles_${message.guild.id}`
    let as = db.get(key).find(x => x[role.id])

    if (as) {
        let roleChannel = as[role.id];
        const foundChannel = message.guild.channels.cache.find(x => x.id === roleChannel)

        if (!foundChannel) {
            let embed = {
                title: `❌ Cannot find channel for role ${role.name}`,
                description: "Did you make mistake?",
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
                fields: [
                    {name: '\u200B', value: '\u200B'},
                    {
                        name: "⛔️ Try again:",
                        value: "```\/role <RoleName>```"
                    }
                ]
            }

            message.channel.send({embed})
            return false
        } else {
            return foundChannel
        }
    } else {
        let embed = {
            title: `❌ Cannot find assigned channel for role ${role.name}`,
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
            fields: [
                {
                    name: "⛔️ Contact server administrator:",
                    value: "This role is not available to obtain"
                }
            ]
        }

        message.channel.send({embed})
        return false
    }
}
