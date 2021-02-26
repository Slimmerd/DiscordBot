const discord = require('discord.js');
const {Command} = require('discord.js-commando');

module.exports = class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rolename',
            aliases: ['rn'],
            group: 'misc',
            memberName: 'rolename',
            description: 'Информация о роли',
            guildOnly: true,
            args: [
                {
                    key: 'roleToCheck',
                    prompt:
                        'Please mention the user you want to check with @ or provide his ID.',
                    type: 'string',
                    default: 0
                },
            ]
        });
    }

    async run(message, {roleToCheck}) {
        // code starts here
        try {
            const
                roleName = message.guild.roles.cache.find(r => (r.name === roleToCheck.toString()) || (r.id === roleToCheck.toString()))
            console.log(roleName)

            const
                perms = new discord.Permissions(roleName.permissions.bitfield).toArray()

            const
                embed = new discord.MessageEmbed()
                    .setColor(roleName.color)
                    .setTitle(roleName.name)
                    .addFields(
                        {
                            name: 'Role ID: ',
                            value: roleName.id,
                            inline: true
                        },
                        {
                            name: 'Role Name: ',
                            value: roleName.name,
                            inline: true
                        },
                        {
                            name: 'Mentionable: ',
                            value: roleName.mentionable ? 'Yes' : 'No',
                            inline: true
                        },
                        {
                            name: 'Role Permissions: ',
                            value: perms.join(', ')
                        }
                            .setFooter(message.client.user.username, message.client.user.avatarURL())
                            .setTimestamp()
                    )

            await
                message.channel.send(embed)

        } catch
            (e) {
            return message.channel.send('Role Doesn\'t Exist').then(() => console.log(e))
        }

    }
}