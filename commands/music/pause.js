const {Command} = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            aliases: ['ps'],
            memberName: 'pause',
            group: 'music',
            description: 'Pause the current playing song!',
            guildOnly: true
        });
    }

    run(message) {
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply(':no_entry: Please join a voice channel and try again!');
        }

        if (
            typeof message.guild.musicData.songDispatcher == 'undefined' ||
            message.guild.musicData.songDispatcher == null
        ) {
            return message.reply(':x: There is no song playing right now!')
        } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
            return message.reply(
                `:no_entry: You must be in the same voice channel as the bot's in order to use that!`
            )
        }

        message.reply(
            ':pause_button: Song was paused! To unpause, use the resume command'
        );

        message.guild.musicData.songDispatcher.pause();
    }
};