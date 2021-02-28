const db = require('quick.db');

module.exports = voteForRole = async (message, role) => {
    const foundRole = message.guild.roles.cache.find(x => x.name === role);
    if (!foundRole) return message.channel.send(`Cannot find role ${role}`);

    let voteProcess = {
        author: {
            name: `User ${message.author.username} asking for permissions`,
            icon_url: message.client.user.avatarURL()
        },
        title: `User asking for ${foundRole.name}, you can vote to assign permission to him `,
        fields: [
            {
                "name": "✅",
                "value": "Assign role to the user"
            },
            {
                "name": "❌",
                "value": "Reject user's request"
            }]
    }

    let res = await findTextChannel(message, foundRole)
    let test = 500

    if (res) {
        message.reply(`Voting for assign role ${foundRole.name} has been started`)
        await res?.send({embed: voteProcess}).then(async (msg) => {
            await msg.react('✅')
            await msg.react('❌')

            const filter = (reaction) => {
                return ['✅', '❌'].includes(reaction.emoji.name)
            };


            await msg.awaitReactions(filter, {time: 6000, errors: ['time']})
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
                    console.warn(votes)

                    if (votes['✅'] > votes['❌']) {
                        // console.warn('✅ Accepted')
                        await message.guild.member(message.author).roles.add(foundRole, `Test`);
                        return test = 'Accepted'
                    } else {
                        // console.warn('❌ Declined')
                        return test = 'Declined'
                    }
                })
        })
    }
    return test
}

const findTextChannel = (message, role) => {
    const key = `roles_${message.guild.id}`
    let as = db.get(key).find(() => role.id)

    let roleChannel = as[role.id];
    const foundChannel = message.guild.channels.cache.find(x => x.id === roleChannel)

    if (!foundChannel) {
        message.channel.send(`❌ Cannot find channel for role ${role.name}`)
         return false
    } else {
        return foundChannel
    }
}
