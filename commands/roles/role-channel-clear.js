const {Command} = require('discord.js-commando');
const {db} = require("@util/dbInit");

module.exports = class RoleChannelClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role-channel-clear',
            aliases: ['rc-clear'],
            memberName: 'role-channel-clear',
            group: 'roles',
            description: "Choose role to remove assigned channel",
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: "roleName",
                    prompt: 'What is the role name?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, {roleName}) {
        await message.delete()

        const key = `roles_${message.guild.id}`
        let chosenRole = message.mentions.roles.first() || message.guild.roles.cache.find(x => x.name === roleName);
        if (!chosenRole) return message.channel.send(`Cannot find role ${roleName}`);

        // Check if role is in DB or not
        let check = db.get(key).find((x) => x[chosenRole.id])

        if (check) {
            let updatedData = await db.get(key).filter((x, y) => x[y] === x[chosenRole.id])

            await db.set(key, updatedData); // update DB

            let embed = {
                title: `✅ Role ${chosenRole.name} deleted`,
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
        } else {
            let embed = {
                title: `❌Role ${chosenRole.name} is not assigned to any channel`,
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