const { ShardingManager } = require("discord.js");
const { bot } = require("./config.json");

const manager = new ShardingManager("./app.js", { token: bot.token });

manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));

manager.spawn({ timeout: -1 });