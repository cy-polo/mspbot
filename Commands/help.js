const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { settingsEmbed } = require("../config.json");

exports.run = async (client, interaction, args, prefix) => {
  let servers = await client.shard.fetchClientValues("guilds.cache.size")
  .then(results => results.reduce((prev, val) => prev + val, 0));
  
  let helpEmbed = new MessageEmbed()
    .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
    .setDescription("Here's a list of all my commands")
    .setColor(settingsEmbed.color)
    .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

  let helpArr = [ ];

  for (let cmd of client.commands) helpArr.push(cmd[1].help);
  
  let commandStr = "";

  for (let cmdData of helpArr) {    
    commandStr += "`/" + cmdData.name + "` **»** ";
    commandStr += cmdData.description;
    commandStr += "\n";
  }
  
  commandStr += `\nI'm on **${numStr(servers)} servers**, thank you! <a:rainbow_hype:802908158200250368>`;
  helpEmbed.addField("Commands", commandStr, false);
  
  const buttons = new MessageActionRow()
  .addComponents(
    new MessageButton()
    .setLabel("Join us")
    .setURL("https://discord.gg/bwa9aCr")
    .setStyle("LINK")
  )
  .addComponents(
    new MessageButton()
    .setLabel("Vote me")
    .setURL(`https://top.gg/bot/${client.user.id}/vote`)
    .setStyle("LINK")
  )
  .addComponents(
    new MessageButton()
    .setLabel("Invite me")
    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands`)
    .setStyle("LINK")
  );
  
  await interaction.reply({ embeds: [helpEmbed], components: [buttons] });
};

exports.help = new SlashCommandBuilder()
.setName("help")
.setDescription("Show all available commands");

function numStr(a, b) {
  a = '' + a;
  b = b || ' ';
  let c = '',
      d = 0;
  while (a.match(/^0[0-9]/)) {
    a = a.substr(1);
  }
  for (let i = a.length-1; i >= 0; i--) {
    c = (d != 0 && d % 3 == 0) ? a[i] + b + c : a[i] + c;
    d++;
  }
  return c;
}