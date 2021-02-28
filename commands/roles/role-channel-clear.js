const {Command} = require('discord.js-commando');

module.exports = class RoleChannelClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role-channel-clear',
            aliases: ['rc-clear'],
            memberName: 'role-channel-clear',
            group: 'roles',
            description: "Choose role to remove assigned channel",
            userPermissions: ['MANAGE_CHANNELS'],
            clientPermissions: ['MANAGE_CHANNELS'],
            guildOnly: true,
            args: [
                {
                    key: "roleName",
                    prompt: 'What is the chosen role?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, {roleName,roleChannel}) {


        return message.direct('Voting for assign role ${roleName} has been started')
        return message.direct('Vote process finished. You have got role ${roleName}')
        return message.direct('Vote process finished. You have not got role ${roleName}')
    }
};