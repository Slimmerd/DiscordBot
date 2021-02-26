const {Command} = require('discord.js-commando');

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            memberName: 'join',
            aliases: ['summon'],
            group: 'music',
            guildOnly: true,
            clientPermissions: ['SPEAK', 'CONNECT'],
            description:
                'Allows an Admin to summon the bot to your voice-channel when music is playing.'
        });
    }

    async run(message) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply(':no_entry: Please join a voice channel and try again!')
        }
        if (message.guild.musicData.isPlaying !== true) {
            return message.reply(':x: Nothing is Playing')
        }
        try {
            await voiceChannel.join()
        } catch {
            return message.reply(
                ':x Something went wrong while attempting to move channels'
            )
        }
    }
}