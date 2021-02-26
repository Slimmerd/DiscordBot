require('module-alias/register')
require('dotenv').config()
const path = require('path')
const {Structures} = require('discord.js');
const Commando = require('discord.js-commando')

Structures.extend('Guild', Guild => {
    class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.musicData = {
                queue: [],
                isPlaying: false,
                nowPlaying: null,
                songDispatcher: null,
                skipTimer: false, // only skip if user used leave command
                loopSong: false,
                loopQueue: false,
                volume: 1
            };
        }

        resetMusicDataOnError() {
            this.musicData.queue.length = 0;
            this.musicData.isPlaying = false;
            this.musicData.nowPlaying = null;
            this.musicData.loopSong = false;
            this.musicData.loopQueue = false;
            this.musicData.songDispatcher = null;
        }
    }

    return MusicGuild;
});

const client = new Commando.CommandoClient({
    owner: process.env.OWNER,
    commandPrefix: process.env.PREFIX,
    invite: 'https://discord.gg/nKgb9C5'
})


client.on('ready', async () => {
    console.log('The client is ready!')

    // client.api.applications(client.user.id).commands.post({
    //     data: {
    //         name: 'ping',
    //         description: 'ping pong!'
    //     }
    // })
    // client.api.applications(client.user.id).guilds('256778099780222978').commands.post({
    //     data: {
    //         name: 'test',
    //         description: 'Пробуем новые API дискорда'
    //     }
    // })

    // let globalCommands = await client.api.applications(client.user.id).commands.get()
    // console.warn(globalCommands)
    // client.api.applications(client.user.id).commands('814631878397001740').delete()
    // let guildCommands = await client.api.applications(client.user.id).guilds('256778099780222978').commands.get()
    // console.warn(guildCommands)
    // client.api.applications(client.user.id).guilds('256778099780222978').commands('814633612611813376').delete()


    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if (command === 'test'){
            // here you could do anything. in this sample
            // i reply with an api interaction
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Мы перейдем на такие команды после того как Discord.js добавит официальную поддержку этой возможности"
                    }
                }
            })
        }
    });


    client.registry.registerDefaultTypes()
        .registerDefaultGroups()
        .registerDefaultCommands({
            // help: false
            ping: false,
            prefix: false,
            eval: false
        })
        .registerGroups([
            ["misc", "⚙️ Misc"],
            ['owner', "♿️ Owner"],
            ["music", "🎵 Music"]
        ])
        .registerCommandsIn(path.join(__dirname, 'commands'))



    client.user.setActivity(`Используйте ${process.env.PREFIX}help`)
})

client.login(process.env.TOKEN)
