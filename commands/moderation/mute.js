// // If the command is like: -tempMute <mention> <minutes> [reason]
// exports.run = (client, message, [mention, minutes, ...reason]) => {
//     // You need to parse those arguments, I'll leave that to you.
//
//     // This is the role you want to assign to the user
//     let mutedRole = message.guild.roles.cache.find(role => role.name == "Your role's name");
//     // This is the member you want to mute
//     let member = message.mentions.members.first();
//
//     // Mute the user
//     member.roles.add(mutedRole, `Muted by ${message.author.tag} for ${minutes} minutes. Reason: ${reason}`);
//
//     // Unmute them after x minutes
//     setTimeout(() => {
//         member.roles.remove(mutedRole, `Temporary mute expired.`);
//     }, minutes * 60000); // time in ms
// };