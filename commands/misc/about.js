const {Command} = require('discord.js-commando');

module.exports = class WhoMadeMeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            aliases: ['botinfo'],
            memberName: 'about',
            group: 'misc',
            description: "Learn about the bot and it's creator!",
            throttling: {
                usages: 1,
                duration: 10
            },
        });
    }

    //FIX: Finish about command
    async run(message) {
        await message.delete()
        return message.channel.send(
            'Made by {} with :heart: full code is available on GitHub {}'
        );
    }
};