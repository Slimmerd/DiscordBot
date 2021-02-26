module.exports = function audit (bot, options) {
    // const description = {
    //     name: "auditlog",
    //     filename: "audit.js",
    //     version: "2.2.8"
    // }

    const eventType = {
        guildMemberAdd: "movement",
        guildMemberRemove: "movement",
        guildBanAdd: "movement",
        guildBanRemove: "movement",
        guildMemberUpdate: "auditlog",
        usernameChangedMsg: "auditlog",
        discriminatorChangedMsg: "auditlog",
        avatarChangedMsg: "auditlog",
        messageDelete: "auditmsg",
        messageUpdate: "auditmsg",
        voiceStateUpdate: "voice"
    }
    // console.log(`Module: ${description.name} | Loaded version ${description.version} from ("${description.filename}")`)

    let debugmode = false
    if (options && options.debugmode === true) debugmode = true

    const DiscordJSversion = require("discord.js").version
    if (DiscordJSversion.substring(0, 2) !== "12") console.error("This version of discord-lobby only run on DiscordJS V12 and up, please run \"npm i discord-auditlog@discord.js-v11\" to install an older version")
    if (DiscordJSversion.substring(0, 2) !== "12") return

    // Event Handlers
    /*
    COLORS
        :join:                         USER JOINED                 65280                    https://cdn.discordapp.com/emojis/435119354867220511.png
        :leave:                     USER LEFT                     16711680                https://cdn.discordapp.com/emojis/435119363595436042.png
        :kick:                         USER KICKED                 16748544                https://cdn.discordapp.com/emojis/435119368989573122.png
        :ban:                         USER BANNED                 16711901                https://cdn.discordapp.com/emojis/435119375138422811.png
        :unban:                        USER UNBANNED                16776960                https://cdn.discordapp.com/emojis/435462140900409344.png
        :nicknamechange:             NICKNAME UPDATE             29372                    https://cdn.discordapp.com/emojis/435119397237948427.png
        :usernamechange:             USERNAME UPDATE             29372                    https://cdn.discordapp.com/emojis/435119402279763968.png
        :avatarchange:                 AVATAR UPDATE                 29372                    https://cdn.discordapp.com/emojis/435119382910337024.png
        :discriminatorchange:         DISCRIMINATOR UPDATE         29372                    https://cdn.discordapp.com/emojis/435119390078271488.png
        :channeljoin:                 CHANNEL JOINED              3381555                    https://cdn.discordapp.com/emojis/435184638160404480.png
        :channelexit:                 CHANNEL LEFT                 10040115                https://cdn.discordapp.com/emojis/435174900227899393.png
        :channelchange:             CHANNEL SWITCH                 13421568                https://cdn.discordapp.com/emojis/435440286559371265.png
        :messageDelete:                MESSAGE DELETE                16711680                https://cdn.discordapp.com/emojis/619328827872641024.png
        :messageUpdate:                MESSAGE UPDATE                16737792                https://cdn.discordapp.com/emojis/619328813381320735.png
*/

    // MESSAGE DELETE V12
    bot.on("messageDelete", message => {
        if (message.author.bot === true) return
        if (message.channel.type !== "text") return
        if (debugmode) console.log(`Audit | messageDelete triggered`)
        let embed = {
            description: `
**Author : ** <@${message.author.id}> - *${message.author.tag}*
**Date : ** ${message.createdAt}
**Channel : ** <#${message.channel.id}> - *${message.channel.name}*
**Deleted Message : **
\`\`\`
${message.content.replace(/`/g, "'")}
\`\`\`
**Attachment URL : **
${message.attachments.map(x => x.proxyURL)}
`,
            image: {
                url: message.attachments.map(x => x.proxyURL)[0]
            },
            color: 16711680,
            timestamp: new Date(),
            footer: {
                text: `
            Deleted: `
            },
            author: {
                name: `
            MESSAGE DELETED `,
                icon_url: "https://cdn.discordapp.com/emojis/619328827872641024.png"
            }
        }
        if (message && message.member && typeof message.member.guild === "object") {
            send(bot, message.member.guild, options, embed, "messageDelete")
        } else {
            console.error(`Audit | messageDelete - ERROR - member guild id couldn't be retrieved`)
            console.error("author", message.author)
            console.error("member", message.member)
            console.error("content", message.content)
        }
    })

    // MESSAGE UPDATE V12
    bot.on("messageUpdate", (oldMessage, newMessage) => {
        if (oldMessage.author.bot === true) return
        if (oldMessage.channel.type !== "text") return
        if (newMessage.channel.type !== "text") return

        if (oldMessage.content === newMessage.content) return
        let embed = {
            description:
                `
**Author : ** <@${newMessage.member.user.id}> - *${newMessage.member.user.tag}*
**Date : ** ${newMessage.createdAt}
**Channel : ** <#${newMessage.channel.id}> - *${newMessage.channel.name}*
**Orignal Message : **
\`\`\`
${oldMessage.content.replace(/`/g, "'")}
\`\`\`
**Updated Message : **
\`\`\`
${newMessage.content.replace(/`/g, "'")}
\`\`\`
`,
            color: 16737792,
            timestamp: new Date(),
            footer: {
                text: "Edited : "
            },
            author: {
                name: "MESSAGE EDITED",
                icon_url: "https://cdn.discordapp.com/emojis/619328813381320735.png"
            }
        }
        send(bot, newMessage.member.guild, options, embed, "messageDelete")
    })

    // USER JOINED V12
    bot.on("guildMemberAdd", member => {
        if (debugmode) console.log(`Audit | guildMemberAdd triggered`)
        let embed = {
            description: `<@${member.user.id}> - *${member.user.id}*\nUser Created on: ${new Date(member.user.createdTimestamp).toDateString()}`,
            url: member.user.displayAvatarURL(),
            color: 65280,
            timestamp: new Date(),
            footer: {
                text: `${member.nickname || member.user.username}`
            },
            thumbnail: {
                url: member.user.displayAvatarURL()
            },
            author: {
                name: `USER JOINED : ${member.user.tag}`,
                icon_url: "https://cdn.discordapp.com/emojis/435119354867220511.png"
            }
        }
        send(bot, member.guild, options, embed, "guildMemberAdd")
    })

    // USER LEFT V12
    bot.on("guildMemberRemove", member => {
        if (debugmode) console.log(`Audit} | guildMemberRemove triggered`)
        let embed = {
            description: `<@${member.user.id}> - *${member.user.id}*`,
            url: member.user.displayAvatarURL(),
            color: 16711680,
            timestamp: new Date(),
            footer: {
                text: `${member.nickname || member.user.username}`
            },
            thumbnail: {
                url: member.user.displayAvatarURL()
            },
            author: {
                name: `USER LEFT : ${member.user.tag}`,
                icon_url: "https://cdn.discordapp.com/emojis/435119363595436042.png"
            },
            fields: [{
                name: "Nickname",
                value: `**${member.nickname || member.user.username}**`,
                inline: true
            }]
        }
        send(bot, member.guild, options, embed, "guildMemberRemove")
    })
    // USER KICKED
    // Not very doable

    // USER BANNED V12
    bot.on("guildBanAdd", (banguild, banuser) => {
        if (debugmode) console.log(`Audit | guildBanAdd triggered`)
        let embed = {
            description: `<@${banuser.id}> - *${banuser.id}*`,
            url: banuser.displayAvatarURL(),
            color: 16711901,
            timestamp: new Date(),
            footer: {
                text: `${banuser.username}`
            },
            thumbnail: {
                url: banuser.displayAvatarURL()
            },
            author: {
                name: `USER BANNED : ${banuser.tag}`,
                icon_url: "https://cdn.discordapp.com/emojis/435119375138422811.png"
            }
        }
        send(bot, banguild, options, embed, "guildBanAdd")
    })

    // USER UNBANNED V12
    bot.on("guildBanRemove", (banguild, banuser) => {
        if (debugmode) console.log(`Audit | guildBanRemove triggered`)
        let embed = {
            description: `<@${banuser.id}> - *${banuser.id}*`,
            url: banuser.displayAvatarURL(),
            color: 16776960,
            timestamp: new Date(),
            footer: {
                text: `${banuser.username}`
            },
            thumbnail: {
                url: banuser.displayAvatarURL()
            },
            author: {
                name: `USER UNBANNED : ${banuser.tag}`,
                icon_url: "https://cdn.discordapp.com/emojis/435462140900409344.png"
            }
        }
        send(bot, banguild, options, embed, "guildBanRemove")
    })

    // USER NICKNAME UPDATE V12
    bot.on("guildMemberUpdate", (oldMember, newMember) => {
        if (debugmode) console.log(`Audit | guildMemberUpdate:nickname triggered`)
        if (oldMember.nickname !==
            newMember.nickname) {
            let embed = {
                description: `<@${newMember.user.id}> - *${newMember.user.id}*`,
                url: newMember.user.displayAvatarURL(),
                color: 29372,
                timestamp: new Date(),
                footer: {
                    text: `${newMember.nickname || newMember.user.username}`
                },
                thumbnail: {
                    url: newMember.user.displayAvatarURL()
                },
                author: {
                    name: `NICKNAME CHANGED: ${newMember.user.tag}`,
                    icon_url: "https://cdn.discordapp.com/emojis/435119397237948427.png"
                },
                fields: [{
                    name: "Old Nickname",
                    value: `**${oldMember.nickname || oldMember.user.username}**`,
                    inline: true
                },
                    {
                        name: "New Nickname",
                        value: `**${newMember.nickname || newMember.user.username}**`,
                        inline: true
                    }
                ]
            }
            send(bot, newMember.guild, options, embed, "guildMemberUpdate")
        }
    })


    // MEMBER ROLE (Groups) UPDATE V12
    bot.on("guildMemberUpdate", (oldMember, newMember) => {
        if (debugmode) console.log(`Audit | guildMemberUpdate:roles triggered`)

        // Initialize option if empty
        if (!options) {
            options = {}
        }

        if (options[newMember.guild.id]) {
            options = options[newMember.guild.id]
        }

        // Add default empty list
        if (typeof options.excludedroles === "undefined") options.excludedroles = new Array([])
        if (typeof options.trackroles === "undefined") options.trackroles = false
        if (options.trackroles !== false) {
            const oldMemberRoles = oldMember.roles.cache.keyArray()
            const newMemberRoles = newMember.roles.cache.keyArray()


            // Check inspired by https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848
            const oldRoles = oldMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !newMemberRoles.includes(x))
            const newRoles = newMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !oldMemberRoles.includes(x))

            const roleChanged = (newRoles.length || oldRoles.length)

            if (roleChanged) {
                let roleAdded = ""
                if (newRoles.length > 0) {
                    for (let i = 0; i < newRoles.length; i++) {
                        if (i > 0) roleAdded += ", "
                        roleAdded += `<@&${newRoles[i]}>`
                    }
                }

                let roleRemoved = ""
                if (oldRoles.length > 0) {
                    for (let i = 0; i < oldRoles.length; i++) {
                        if (i > 0) roleRemoved += ", "
                        roleRemoved += `<@&${oldRoles[i]}>`
                    }
                }
                let embed = {
                    description: `<@${newMember.user.id}> - *${newMember.user.id}*`,
                    url: newMember.user.displayAvatarURL(),
                    color: 29372,
                    timestamp: new Date(),
                    footer: {
                        text: `${newMember.nickname || newMember.user.username}`
                    },
                    thumbnail: {
                        url: newMember.user.displayAvatarURL()
                    },
                    author: {
                        name: `ROLES CHANGED: ${newMember.user.tag}`,
                        icon_url: "https://cdn.discordapp.com/emojis/435119397237948427.png"
                    },
                    fields: [{
                        name: "ROLES REMOVED",
                        value: `**${roleRemoved} **`,
                        inline: true
                    },
                        {
                            name: "ROLES ADDED: ",
                            value: `**${roleAdded} **`,
                            inline: true
                        }
                    ]
                }
                send(bot, newMember.guild, options, embed, "guildMemberUpdate")
            }
        }
    })

    // USER UPDATE AVATAR, USERNAME, DISCRIMINATOR V12
    bot.on("userUpdate", (oldUser, newUser) => {
        if (debugmode) console.log(`Audit | userUpdate triggered`)

        // Log quand le user change de username (et possiblement discriminator)
        let usernameChangedMsg = null
        let discriminatorChangedMsg = null
        let avatarChangedMsg = null

        // search the member from all guilds, since the userUpdate event doesn't provide guild information as it is a global event.
        bot.guilds.cache.forEach(function (guild, guildid) {
            guild.members.cache.forEach(function (member, memberid) {
                if (newUser.id === memberid) {
                    // var member = bot.guilds.get(guildid).members.get(member.id)

                    // USERNAME CHANGED V12
                    if (oldUser.username !== newUser.username) {
                        if (debugmode) console.log(`Audit | userUpdate:USERNAME triggered`)

                        usernameChangedMsg = {
                            description: `<@${newUser.id}> - *${newUser.id}*`,
                            url: newUser.displayAvatarURL(),
                            color: 29372,
                            timestamp: new Date(),
                            footer: {
                                text: `${member.nickname || member.user.username}`
                            },
                            thumbnail: {
                                url: newUser.displayAvatarURL()
                            },
                            author: {
                                name: `USERNAME CHANGED: ${newUser.tag}`,
                                icon_url: "https://cdn.discordapp.com/emojis/435119402279763968.png"
                            },
                            fields: [{
                                name: "Old Username",
                                value: `**${oldUser.username}**`,
                                inline: true
                            },
                                {
                                    name: "New Username",
                                    value: `**${newUser.username}**`,
                                    inline: true
                                }
                            ]
                        }
                    }

                    // DISCRIMINATOR CHANGED V12
                    if (oldUser.discriminator !== newUser.discriminator) {
                        if (debugmode) console.log(`Audit | userUpdate:DISCRIMINATOR triggered`)

                        discriminatorChangedMsg = {
                            description: `<@${newUser.id}> - *${newUser.id}*`,
                            url: newUser.displayAvatarURL(),
                            color: 29372,
                            timestamp: new Date(),
                            footer: {
                                text: `${member.nickname || member.user.username}`
                            },
                            thumbnail: {
                                url: newUser.displayAvatarURL()
                            },
                            author: {
                                name: `DISCRIMINATOR CHANGED: ${newUser.tag}`,
                                icon_url: "https://cdn.discordapp.com/emojis/435119390078271488.png"
                            },
                            fields: [{
                                name: "Old Discriminator",
                                value: `**${oldUser.discriminator}**`,
                                inline: true
                            },
                                {
                                    name: "New Discriminator",
                                    value: `**${newUser.discriminator}**`,
                                    inline: true
                                }
                            ]
                        }
                    }

                    // AVATAR CHANGED V12
                    if (oldUser.avatar !== newUser.avatar) {
                        if (debugmode) console.log(`Audit | userUpdate:AVATAR triggered`)

                        avatarChangedMsg = {
                            description: `<@${newUser.id}> - *${newUser.id}*`,
                            url: newUser.displayAvatarURL(),
                            color: 29372,
                            timestamp: new Date(),
                            footer: {
                                text: `${member.nickname || member.user.username}`
                            },
                            thumbnail: {
                                url: newUser.displayAvatarURL()
                            },
                            author: {
                                name: `AVATAR CHANGED: ${newUser.tag}`,
                                icon_url: "https://cdn.discordapp.com/emojis/435119382910337024.png"
                            },
                            image: {
                                url: oldUser.displayAvatarURL()
                            },
                            fields: [{
                                name: "Old Avatar",
                                value: ":arrow_down:"
                            }]
                        }
                    }

                    if (usernameChangedMsg) send(bot, guild, options, usernameChangedMsg, "usernameChangedMsg")
                    if (discriminatorChangedMsg) send(bot, guild, options, discriminatorChangedMsg, "discriminatorChangedMsg")
                    if (avatarChangedMsg) send(bot, guild, options, avatarChangedMsg, "avatarChangedMsg")
                }
            })
        })
    })

    // CHANNEL JOIN LEAVE SWITCH V12
    bot.on("voiceStateUpdate", (oldState, newState) => {
        if (debugmode) console.log(`Audit | voiceStateUpdate triggered`)
        let oldChannelName, embed, newChannelName

        // SET CHANNEL NAME STRING
        let oldparentname = "unknown"
        let oldchannelname = "unknown"
        let oldchanelid = "unknown"
        if (oldState && oldState.channel && oldState.channel.parent && oldState.channel.parent.name) oldparentname = oldState.channel.parent.name
        if (oldState && oldState.channel && oldState.channel.name) oldchannelname = oldState.channel.name
        if (oldState && oldState.channelID) oldchanelid = oldState.channelID

        let newparentname = "unknown"
        let newchannelname = "unknown"
        let newchanelid = "unknown"
        if (newState && newState.channel && newState.channel.parent && newState.channel.parent.name) newparentname = newState.channel.parent.name
        if (newState && newState.channel && newState.channel.name) newchannelname = newState.channel.name
        if (newState && newState.channelID) newchanelid = newState.channelID

        if (oldState.channelID) {
            if (typeof oldState.channel.parent !== "undefined") {
                oldChannelName = `${oldparentname}\n\t**${oldchannelname}**\n*${oldchanelid}*`
            } else {
                oldChannelName = `-\n\t**${oldparentname}**\n*${oldchanelid}*`
            }
        }
        if (newState.channelID) {
            if (typeof newState.channel.parent !== "undefined") {
                newChannelName = `${newparentname}\n\t**${newchannelname}**\n*${newchanelid}*`
            } else {
                newChannelName = `-\n\t**${newchannelname}**\n*${newchanelid}*`
            }
        }

        // JOINED V12
        if (!oldState.channelID && newState.channelID) {
            if (debugmode) console.log(`Audit | voiceStateUpdate:JOINED triggered`)
            embed = {
                description: `<@${newState.member.user.id}> - *${newState.member.user.id}*`,
                url: newState.member.user.displayAvatarURL(),
                color: 3381555,
                timestamp: new Date(),
                footer: {
                    text: `${newState.member.nickname || newState.member.user.username}`
                },
                thumbnail: {
                    url: newState.member.user.displayAvatarURL()
                },
                author: {
                    name: `Joined channel : ${newState.member.user.tag}`,
                    icon_url: "https://cdn.discordapp.com/emojis/435184638160404480.png"
                },
                fields: [{
                    name: "Joined channel",
                    value: `${newChannelName}`
                }]
            }
        }


        // LEFT V12
        if (oldState.channelID && !newState.channelID) {
            if (debugmode) console.log(`Audit | voiceStateUpdate:LEFT triggered`)
            embed = {
                url: newState.member.user.displayAvatarURL(),
                color: 10040115,
                timestamp: new Date(),
                footer: {
                    text: `${newState.member.nickname || newState.member.user.username}`
                },
                thumbnail: {
                    url: newState.member.user.displayAvatarURL()
                },
                author: {
                    name: `Left channel : ${newState.member.user.tag}`,
                    icon_url: "https://cdn.discordapp.com/emojis/435174900227899393.png"
                },
                fields: [{
                    name: "Left channel",
                    value: `${oldChannelName}`
                }]
            }
        }


        // SWITCH V12
        if (oldState.channelID && newState.channelID) {
            // False positive check
            if (oldState.channelID !== newState.channelID) {
                if (debugmode) console.log(`Audit | voiceStateUpdate:SWITCH triggered`)

                embed = {
                    description: `<@${newState.member.user.id}> - *${newState.member.user.id}*`,
                    url: newState.member.user.displayAvatarURL(),
                    color: 13421568,
                    timestamp: new Date(),
                    footer: {
                        text: `${newState.member.nickname || newState.member.user.username}`
                    },
                    thumbnail: {
                        url: newState.member.user.displayAvatarURL()
                    },
                    author: {
                        name: `Switched channel : ${newState.member.user.tag}`,
                        icon_url: "https://cdn.discordapp.com/emojis/435440286559371265.png"
                    },
                    fields: [{
                        name: "Left channel",
                        value: `${oldChannelName}`,
                        inline: true
                    },
                        {
                            name: "Joined channel",
                            value: `${newChannelName}`,
                            inline: true
                        }
                    ]
                }
            }
        }


        // SEND
        if (embed) {
            send(bot, newState.guild, options, embed, "voiceStateUpdate")
        }
    })


    // SEND FUNCTION V12
    function send(bot, guild, options, msg, movement) {
        let embed = ""

        if (debugmode) console.log(`Audit | send - configured options:`, options)

        // Initialize option if empty
        if (!options) {
            options = {}
        }

        // Initialize if options are multi-server
        if (options[guild.id]) {
            options = options[guild.id]
        }

        if (debugmode) console.log(`Audit | send - specifics options:`, options)

        // Add default channel
        if (typeof options.auditlog === "undefined") options.auditlog = "audit-log"
        if (typeof options.auditmsg === "undefined") options.auditmsg = false
        if (typeof options.movement === "undefined") options.movement = "in-out"
        if (typeof options.voice === "undefined") options.voice = false


        if (debugmode) console.log(`Audit | send - computed options:`, options)

        const channelName = (options[eventType[movement]])
        if (channelName) {
            // define channel object
            const channel = guild.channels.cache.find(val => val.name === channelName) || guild.channels.cache.find(val => val.id === channelName)
            if (channel) {
                if (channel.permissionsFor(bot.user).has("SEND_MESSAGES") && channel.permissionsFor(bot.user).has("SEND_MESSAGES")) {
                    if (typeof msg === "object") {
                        // Embed
                        if (channel.permissionsFor(bot.user).has("EMBED_LINKS")) {
                            embed = msg
                            channel.send({
                                embed
                            })
                                .catch(console.error)
                        } else {
                            console.log(`Audit -> The Bot doesn't have the permission EMBED_LINKS to the configured channel "${channelName}" on server "${guild.name}" (${guild.id})`)
                        }
                    } else {
                        // Send the Message
                        channel.send(msg)
                            .catch(console.error)
                    }
                } else {
                    console.log(`Audit -> The Bot doesn't have the permission to send public message to the configured channel "${channelName}" on server "${guild.name}" (${guild.id})`)
                }
            } else {
                console.log(`$Audit -> The channel "${channelName}" do not exist on server "${guild.name}" (${guild.id})`)
            }
        } else {
            // console.log(`AuditLog: No channel option for event ${movement} on server "${guild.name}" (${guild.id})`);
        }
    }
}