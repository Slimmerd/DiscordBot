const {Command} = require('discord.js-commando');
const {db} = require("@util/dbInit");

module.exports = class RoleChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role-channel',
            aliases: ['rc'],
            memberName: 'role-channel',
            group: 'roles',
            description: "Choose role channel",
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
                    prompt: 'Please mention the role with @',
                    type: 'string',
                },
                {
                    key: "roleChannel",
                    prompt: 'Please mention the channel with #',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, {roleName, roleChannel}) {
        await message.delete()

        let chosenRole = message.mentions.roles.first()
        let chosenChannel = message.mentions.channels.first()
        const key = `roles_${message.guild.id}`

        let assignedRoles = await db.get(key)

        if (assignedRoles === null) {
            db.set(key, [{[chosenRole.id]: chosenChannel.id}]);

            let embed = {
                title: `✅ For **${chosenRole.name}** role channel **${chosenChannel.name}** has been assigned`,
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

        let duplicateCheck = await db.get(key).then(e => e.find( (x) =>  x[chosenRole.id]))


        console.warn('[WARN] Duplicates:', duplicateCheck)

        if (duplicateCheck) {
            let textChannel = this.client.channels.cache.get(duplicateCheck[chosenRole.id]).name

            let embed = {
                title: `❌ For role **${chosenRole.name}** text channel **${textChannel}** already assigned`,
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
        } else if (assignedRoles !== null) {
            db.push(key, {[chosenRole.id]: chosenChannel.id})

            let embed = {
                title: `✅ For **${chosenRole.name}** role channel **${chosenChannel.name}** has been assigned`,
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
    }
};