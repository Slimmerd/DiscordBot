const { Command } = require('discord.js-commando');

module.exports = class LoopQueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'loopqueue',
            memberName: 'loopqueue',
            aliases: ['lpq'],
            group: 'music',
            description: 'Loop the queue x times! - (the default is 1 time)',
            guildOnly: true,
            args: [
                {
                    key: 'numOfTimesToLoop',
                    default: 1,
                    type: 'integer',
                    prompt: 'How many times do you want to loop the queue?'
                }
            ]
        });
    }

    run(message) {
        if (!message.guild.musicData.isPlaying) {
            return message.reply(':x: There is no song playing right now!')
        } else if (
            message.member.voice.channel.id !== message.guild.me.voice.channel.id
        ) {
            return message.reply(
                `:no_entry: You must be in the same voice channel as the bot's in order to use that!`
            )
        } else if (message.guild.musicData.queue.length === 0) {
            return message.reply(`:x: I can't loop over an empty queue!`)
        } else if (message.guild.musicData.loopSong) {
            return  message.reply(
                ':x: Turn off the **loop** command before using the **loopqueue** command'
            )
        }

        if (message.guild.musicData.loopQueue) {
            message.guild.musicData.loopQueue = false;
            message.channel.send(
                ':repeat: The queue is no longer playing on **loop**'
            );
        } else {
            message.guild.musicData.loopQueue = true;
            message.channel.send(':repeat: The queue is now playing on **loop**');
        }
    }
};