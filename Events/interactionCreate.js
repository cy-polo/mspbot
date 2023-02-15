const { MessageActionRow, MessageButton, MessageEmbed, WebhookClient } = require("discord.js");
const { bot, settingsEmojis, settingsEmbed, settingsWebhook } = require("../config.json");
const webhookClient = new WebhookClient({ id: settingsWebhook.id, token: settingsWebhook.token });


module.exports = async (client, interaction) => {  
  if (!interaction.isCommand()) return;
  
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;
  
  if (interaction.guildId === null) {
    const button = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setLabel("Invite me")
      .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands`)
      .setStyle("LINK")
    );
    
    return await interaction.reply({ content: settingsEmojis.no + " You must do the command on a server, not in DM.", components: [button] });
  };
  let args = [ ];
  for (let option of interaction.options._hoistedOptions) args.push(option.value);
    
  const logsEmbed = new MessageEmbed()
    .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: "User Infos :", value: `Username : ${interaction.user.username}#${interaction.user.discriminator}\nID : ${interaction.user.id}` },
      { name: "Server Infos :", value: `Name : ${interaction.guild.name}\nID : ${interaction.guild.id}` },
      { name: "Command Infos :", value: `Command : ${interaction.commandName}\nArgs : ${args.join(", ")}` }
      )
      .setColor(settingsEmbed.color)
      .setTimestamp()
      .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

  await webhookClient.send({ embeds: [logsEmbed] });
  
  await command.run(client, interaction, args);
};
