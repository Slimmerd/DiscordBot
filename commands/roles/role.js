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
            ownerOnly: true,
            args: [
                {
                    key: "roleName",
                    prompt: 'What is the chosen role?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, {roleName}) {
        await voteForRole(message, roleName).then(msg => {
            console.warn(msg)
            if (msg === 'Accepted') {
                message.reply(`✅ Vote process finished. You have got role ${roleName}`)
                setTimeout(() => {
                    let channelName = `welcome_${message.author.username}`
                    let foundChannel = message.guild.channels.cache.find(x => x.name === channelName)
                    foundChannel?.delete()
                }, 10000)
            } else if (msg === 500){
                return 0
            }
            else {
                return message.reply(`❌ Vote process finished. You have not got role ${roleName}`)
            }
        })
    }
}
