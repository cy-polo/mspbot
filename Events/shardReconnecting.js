const { MessageEmbed, WebhookClient } = require("discord.js");
const { settingsLogs } = require("../config");
const webhookClient = new WebhookClient({ id: settingsLogs.shards.id, token: settingsLogs.shards.token });

module.exports = async (client, id) => {
  const shardEmbed = new MessageEmbed()
  .addField(`Shard #${id}`, "The shard is reconnecting...")
  .setColor("#FFFF00");
  
  await webhookClient.send({ embeds: [shardEmbed] });
}