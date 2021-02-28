const {Command} = require('discord.js-commando');
const db = require('quick.db');

module.exports = class RoleChannelListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role-channels-list',
            aliases: ['rcs-list'],
            memberName: 'role-channels-list',
            group: 'roles',
            description: "Look for assigned channels",
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['ADMINISTRATOR'],
            guildOnly: true,
        });
    }

    async run(message, {roleName,roleChannel}) {
        let chosenRole = message.mentions.roles.first()
        let chosenChannel = message.mentions.channels.first()
        const key = `roles_${message.guild.id}`
        console.warn(chosenRole.name)
        console.warn(chosenChannel.name)

        let assignedRoles = db.get(key)
        // console.warn(assignedRoles)

        if (assignedRoles === null) {
            db.set(key, [{[chosenRole.id] : chosenChannel.id}]);
            return  message.channel.send(`✅ For **${chosenRole.name}** role channel **${chosenChannel.name}** has been assigned`)
        }

        let duplicateCheck = db.get(key).find((x) => x[chosenRole.id])
        console.warn('s',duplicateCheck)
        //
        if (duplicateCheck){
            let textChannel = this.client.channels.cache.get(duplicateCheck[chosenRole.id]).name
            return message.channel.send(`❌ For role **${chosenRole.name}** text channel **${textChannel}** already assigned`)
        } else if (assignedRoles !== null) {
            db.push(key, {[chosenRole.id] : chosenChannel.id})
            return  message.channel.send(`✅ For **${chosenRole.name}** role channel **${chosenChannel.name}** has been assigned`)
        }
    }
};