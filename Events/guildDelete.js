const { MessageEmbed, WebhookClient } = require("discord.js");
const { settingsLogs, settingsEmbed, settingsEmojis } = require("../config");
const webhookClient = new WebhookClient({ id: settingsLogs.leave.id, token: settingsLogs.leave.token });

module.exports = async (client, guild) => {
  const guildEmbed = new MessageEmbed()
  .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
  .setDescription(`${settingsEmojis.no} I just left the server ${guild.name}.`)
  .addField("Server Infos :", `Name : ${guild.name}\nID : ${guild.id}`)
  .setColor(settingsEmbed.color)
  .setTimestamp()
  .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });
  
  await webhookClient.send({ embeds: [guildEmbed] });
}