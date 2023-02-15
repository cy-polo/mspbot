const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { settingsModel } = require("../Utils/shemas.js");
const { sendAmf, buildTicketHeader } = require("../Utils/MSP/amf.js");
const { settingsEmbed, settingsEmojis } = require("../config.json");

exports.run = async (client, interaction) => {
  await interaction.deferReply();
  
  let ticket = await settingsModel.find({ });
  ticket = ticket[0].Tickets;

  const listServers = [
      "dk",
      "fi",
      "uk",
      "us",
      "ca",
      "es",
      "no",
      "de",
      "pl",
      "tr",
      "ie",
      "se",
      "nl",
      "fr",
      "au",
      "nz"
    ];

    const flag = {
      "dk": `- ${settingsEmojis.dk} Denmark`,
      "fi": `- ${settingsEmojis.fi} Finland`,
      "uk": `- ${settingsEmojis.gb} Great Britain`,
      "us": `- ${settingsEmojis.us} United States`,
      "ca": `- ${settingsEmojis.ca} Canada`,
      "es": `- ${settingsEmojis.es} Spain`,
      "no": `- ${settingsEmojis.norway} Norway`,
      "de": `- ${settingsEmojis.de} Germany`,
      "pl": `- ${settingsEmojis.pl} Poland`,
      "tr": `- ${settingsEmojis.tr} Turkey`,
      "ie": `- ${settingsEmojis.ie} Ireland`,
      "se": `- ${settingsEmojis.se} Sweden`,
      "nl": `- ${settingsEmojis.nl} Netherland`,
      "fr": `- ${settingsEmojis.fr} France`,
      "au": `- ${settingsEmojis.au} Australia`,
      "nz": `- ${settingsEmojis.nz} New Zealand`
    };

    let serversWork = [ ];
    let serversNotWork = [ ];

    for (let check = 0; check < 16; check++) {
      try {
        const packet = await sendAmf(
          listServers[check],
          "MovieStarPlanet.WebService.PiggyBank.AMFPiggyBankService.GetPiggyBank",
          [ buildTicketHeader(ticket[check]) ]
        );

        let checkInfo = packet.bodies[0].data.Data;
        serversWork.push(listServers[check]);
      } catch {
      try {
        const  packet = await sendAmf(
          listServers[check],
          "MovieStarPlanet.WebService.PiggyBank.AMFPiggyBankService.GetPiggyBank",
          [ buildTicketHeader(ticket[check]) ]
        );

        let checkInfo = packet.bodies[0].data.Data;
        serversWork.push(listServers[check]);
      } catch {
        serversNotWork.push(listServers[check]);
      }
      }
    };

    let checkEmbed = new MessageEmbed()
    .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
    .setColor(settingsEmbed.color)
    .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

    // For running servers

    let resultWork = [];
    for (let check = 0; check < serversWork.length; check++) resultWork.push(flag[serversWork[check]]);

    // For servers that are not running

    let resultNotWork = [];
    for (let check = 0; check < serversNotWork.length; check++) resultNotWork.push(flag[serversNotWork[check]]);

    if(resultWork.length == 0) { } else checkEmbed.addField("Servers that work :", resultWork.join("\n"));
    if(resultNotWork.length == 0) { } else checkEmbed.addField("Servers that do not work :", resultNotWork.join("\n"));
  
    await interaction.editReply({ embeds: [checkEmbed] });  
};

exports.help = new SlashCommandBuilder()
.setName("check")
.setDescription("Checks if the servers are running");