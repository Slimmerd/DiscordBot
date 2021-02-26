const discord = require('discord.js');
const {Command} = require('discord.js-commando');

module.exports = class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            aliases: ['ui'],
            group: 'misc',
            memberName: 'userinfo',
            description: 'Информация о пользователе',
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
        });
    }

    //TODO:- Target user
    run(message) {
        message.channel.type !== "dm" ? message.delete() : null // Check If not DM

        return message.say(new discord.MessageEmbed()
                //All Fields are Optional Pick Any some

                .setAuthor(message.author.username, message.author.avatarURL()) //Heading With Username & Their Avatar
                .setTitle('UserInfo')
                .setColor('#FFFF00') //You Can Use HexColour Ex:- #000000

                .setThumbnail(message.author.avatarURL()) //Add Any Image URl || ThumbNail

                //All Feilds Are Just Examples pick Some & add as you like
                .addField('Tag', message.author.tag) //The Discord "tag" for this user || Ex:- Sai Chinna#6718
                .addField('Username', message.author.username, true) //The username of the user || Ex:- Sai Chinna
                .addField('Discrim', message.author.discriminator, true) //A discriminator/tag based on username for the user Ex:- 0001
                .addField('ID', message.author.id) //The ID of the User/author
                .addField('Status', message.author.presence.status, true) //The presence status of this user
                .addField('Game', message.author.presence.game, true) //The presence of this user
                .addField('Created At', message.author.createdAt, false) //The time the user was created || .createdTimestamp - The timestamp the user was created at
                .addField('Flags', message.author.flags.toArray().map((e) => `${e}`)
                    .join(', ')) //The ID of the User/author

                .addField('Last Message', message.author.lastMessage, true) //The Message object of the last message sent by the user, if one was sent
                .addField('Last Message ID', message.author.lastMessageID, true) //The ID of the last message sent by the user, if one was sent

                .addField('Bot', message.author.bot, false) //Returns True If Message Author = Bot || False If Message Author not Bot.
                .setFooter(`Requested By ${message.author.tag}`, message.guild.iconURL()) //Change To Anything As You Wish
                .setTimestamp() //The timestamp of this embed


            //FIX: .addField('Nick Name', message.guild.member(target).displayName) //Nick Name In That (message sent) server || Define target as message Author Ex:- let target = message.author; || Add This Line in Top
        )
    }
}