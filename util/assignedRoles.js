const db = require('quick.db');

module.exports = assignedRoles = (message) => {
    const key = `roles_${message.guild.id}`

    let assignedRoles = db.get(key).map((m) => {
        let keys = Object.keys(m)
        let values = Object.values(m)

        let roleName = message.guild.roles.cache.get(keys[0]).name
        let channelName = message.guild.channels.cache.get(values[0]).name

        return `${roleName} **-** ${channelName}`
    })

    return assignedRoles
}