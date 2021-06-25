const {db} = require("@util/dbInit");

module.exports = assignedRoles = async (message) => {
    const key = `roles_${message.guild.id}`

    let assignedRoles = await db.get(key)
    let data = await assignedRoles.map((m) => {
        let keys = Object.keys(m)
        let values = Object.values(m)

        let roleName = message.guild.roles.cache.get(keys[0]).name
        let channelName = message.guild.channels.cache.get(values[0]).name

        return `${roleName} **-** ${channelName}`
    })

    return data
}