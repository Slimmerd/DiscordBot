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
            args: [
                {
                    key: 'userToCheck',
                    prompt:
                        'Please mention the user you want to check with @ or provide his ID.',
                    type: 'string',
                    default: 0
                },
            ]
        });
    }

    run(message, {userToCheck}) {
        message.channel.type !== "dm" ? message.delete() : null // Check If not DM

        let user = message.mentions.users.first() || message.author;

        return message.say(new discord.MessageEmbed()
            //All Fields are Optional Pick Any some

            .setAuthor(user.username, user.avatarURL()) //Heading With Username & Their Avatar
            .setTitle('User Information')
            .setColor('RANDOM') //You Can Use HexColour Ex:- #000000

            .setThumbnail(user.avatarURL()) //Add Any Image URl || ThumbNail

            //All Feilds Are Just Examples pick Some & add as you like
            .addField('Tag', user.tag) //The Discord "tag" for this user || Ex:- Sai Chinna#6718
            .addField('Username', user.username, true) //The username of the user || Ex:- Sai Chinna
            .addField('Discrim', user.discriminator, true) //A discriminator/tag based on username for the user Ex:- 0001
            .addField('Name on server', message.guild.member(user).displayName, true) //The ID of the last message sent by the user, if one was sent
            .addField('ID', user.id) //The ID of the User/author
            .addField('Status', user.presence.status, true) //The presence status of this user
            .addField('Game', user.presence.game, true) //The presence of this user
            .addField('Created At', user.createdAt, false) //The time the user was created || .createdTimestamp - The timestamp the user was created at
            .addField('Flags', user.flags.toArray().map((e) => `${e}`)
                .join(', ')) //The ID of the User/author

            .addField('Last Message', user.lastMessage, true) //The Message object of the last message sent by the user, if one was sent
            .addField('Last Message ID', user.lastMessageID, true) //The ID of the last message sent by the user, if one was sent
            // .addField('‎', '‎', true)

            .addField('Roles', message.guild.member(user).roles.cache.map((e) => `${e}`)
                .join(', '), false) // Roles of user in the guild
            .addField('Permissions', new discord.Permissions(message.guild.member(user).permissions.bitfield).toArray().join(', ')) //Permissions of user in the guild


            .addField('Bot', message.author.bot, false) //Returns True If Message Author = Bot || False If Message Author not Bot.
            .setFooter(`Requested By ${message.author.tag}`, message.guild.iconURL()) //Change To Anything As You Wish
            .setTimestamp() //The timestamp of this embed
        )
    }
}