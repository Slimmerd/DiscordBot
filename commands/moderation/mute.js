const {Command} = require('discord.js-commando');

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            memberName: 'mute',
            group: 'moder',
            description: "Mute user",
            userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
            args: [
                {
                    key: "userName",
                    prompt: 'Please mention the user you want to mute with @ or provide his ID.',
                    type: 'string',
                },
                {
                    key: 'muteReason',
                    prompt: 'Please provide reason for muting user',
                    type: "string",
                    default: 0
                },
                {
                    key: "muteTime",
                    prompt: 'How long in mutes user should be muted?',
                    type: "string",
                    default: 0
                }
            ]
        });
    }

    async run(message, {userName, muteReason, muteTime}) {
        let user = message.mentions.members.first()
        let mutedRole = message.guild.roles.cache.find(x => x.name === "Muted");

        if (user.id === message.author.id) return message.channel.send("You cannot mute yourself");
        if (!mutedRole) return message.channel.send(`Cannot find role 'Muted", please create role "Muted"`);

        if (muteReason === 0) muteReason = "Unspecified"
        if (muteTime === 0) muteTime = "Forever"

        await message.channel.send(`${user} has been muted for the following reason: ${muteReason} for ${muteTime} minutes.`)

        await user.roles.add(mutedRole, `Muted by ${message.author.tag} for ${muteTime} minutes. Reason: ${muteReason}`);

        await user.send(`Hello there. You have been muted from ${message.guild.name} for ${muteTime} minutes. Reason: ${muteReason}`);

        if (muteTime > 0) {
            setTimeout(() => {
                user.roles.remove(mutedRole, `Temporary mute expired.`);
                message.channel.send(`${user} has been unmuted because mute time expired`)
            }, muteTime * 60000); // time in ms
        }
    }
};

