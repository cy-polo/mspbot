const { MessageEmbed, WebhookClient } = require("discord.js");
const { settingsLogs } = require("../config");
const webhookClient = new WebhookClient({ id: settingsLogs.shards.id, token: settingsLogs.shards.token });

module.exports = async (client, error, shardID) => {
  const shardEmbed = new MessageEmbed()
  .addFields(
    { name: `Shard #${shardID}`, value: `The shard received an error` },
    { name: "Error", value: `\`\`\`fix\n${error}\n\`\`\`` }
  )
  .setColor("#FF0000");
  
  await webhookClient.send({ embeds: [shardEmbed] });
}