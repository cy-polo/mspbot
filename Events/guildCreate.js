const { MessageEmbed, WebhookClient } = require("discord.js");
// const { slash } = require("../Utils/slash.js");
const { settingsLogs, settingsEmbed, settingsEmojis } = require("../config");
const webhookClient = new WebhookClient({ id: settingsLogs.join.id, token: settingsLogs.join.token });

module.exports = async (client, guild) => {
  // await slash(client.user.id, guild.id, false);
  
  const guildEmbed = new MessageEmbed()
  .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
  .setDescription(`${settingsEmojis.yes} I have just joined the server ${guild.name}!`)
  .addField("Server Infos :", `Name : ${guild.name}\nID : ${guild.id}` )
  .setColor(settingsEmbed.color)
  .setTimestamp()
  .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

  await webhookClient.send({ embeds: [guildEmbed] });
}