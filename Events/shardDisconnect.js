const { MessageEmbed, WebhookClient } = require("discord.js");
const { settingsLogs } = require("../config");
const webhookClient = new WebhookClient({ id: settingsLogs.shards.id, token: settingsLogs.shards.token });

module.exports = async (client, event, id) => {
  const shardEmbed = new MessageEmbed()
  .addField(`Shard #${id}`, `The shard has disconnected\n\nEvent : ${event}`)  
  .setColor("#FF0000");
  
  await webhookClient.send({ embeds: [shardEmbed] });
}