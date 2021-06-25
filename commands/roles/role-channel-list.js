const {Command} = require('discord.js-commando');
const assignedRoles = require('@util/assignedRoles')

module.exports = class RoleChannelListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role-channels-list',
            aliases: ['rcs-list'],
            memberName: 'role-channels-list',
            group: 'roles',
            description: "Look for assigned channels",
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    }

    async run(message) {
        await message.delete()
        let desc = await assignedRoles(message)

        let embed = {
            "title": "All assigned roles to channels on this server",
            "description": `${desc.join('\n')}`,
            "color": 'RANDOM',
            "timestamp": Date.now(),
            "footer": {
                "icon_url": message.client.user.avatarURL(),
                "text": message.client.user.username
            },
            "thumbnail": {
                "url": message.guild.iconURL()
            },
            "author": {
                "name": message.guild.name,
                "icon_url": message.guild.iconURL()
            },
            "fields": [
                {name: '\u200B', value: '\u200B'},
                {
                    "name": "♻️ Clear all roles:",
                    "value": "To clear all assigned roles use: ```\/rcs-clear```"
                },
                {
                    "name": "🛠 Clear particular role:",
                    "value": "To clear particular role use: ```\/rc-clear <@rolename>```"
                },
                {
                    "name": "🛂 Assign role to channel:",
                    "value": "To assign role to channel use: ```\/rc <@rolename> <#rolechannel>```"
                }
            ]
        }

        return message.channel.send({embed})
        // message.channel.send(`\`\`\`\n${assignedRoles.join('\n')}\n\`\`\``) // Pass values in code block
    }
};