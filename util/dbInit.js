const {Database} = require('quickmongo');
const db = new Database(process.env.DB)

db.on("ready", () => {
    console.log("Database connected!");
});

module.exports = {db}