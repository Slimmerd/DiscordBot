const {Command} = require('discord.js-commando');

module.exports = class ClearQueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clearqueue',
            aliases: ['cq'],
            memberName: 'clearqueue',
            group: 'music',
            description: 'Skip all songs in queue!',
            guildOnly: true
        });
    }

    run(message) {
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply(':no_entry: Please join a voice channel and try again!')
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
        if (!message.guild.musicData.queue) {
            return message.reply(':x: There are no songs in queue!')
        }
        message.guild.musicData.queue.length = 0; // clear queue
        message.guild.musicData.loopSong = false;
        message.guild.musicData.loopQueue = false;
        message.guild.musicData.songDispatcher.end();
    }
};