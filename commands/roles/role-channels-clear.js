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
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['ADMINISTRATOR'],
            guildOnly: true
        });
    }

    async run(message, {roleName,roleChannel}) {
        let key = `roles_${message.guild.id}`

        await db.delete(key)

        let check = await db.has(key)
        if (check) {
            return message.channel.send('❌ [ERROR] All assigned channels **NOT** deleted')
        } else {
            return message.channel.send('🗑 All assigned channels deleted')
        }

    }
};