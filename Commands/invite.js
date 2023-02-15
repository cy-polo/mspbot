const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { settingsEmbed } = require("../config");

exports.run = async (client, interaction) => {
  const inviteEmbed = new MessageEmbed()
  .setColor(settingsEmbed.color)
  .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
  .addField("Invite me !", `To invite me, [click-here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands).`)
  .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });
  
  await interaction.reply({ embeds: [inviteEmbed] });
};

exports.help = new SlashCommandBuilder()
.setName("invite")
.setDescription("Invite the bot on your server!");