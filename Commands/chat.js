const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { settingsModel } = require("../Utils/shemas.js");
const { sendAmf, buildTicketHeader } = require("../Utils/MSP/amf.js");
const { settingsEmbed, settingsEmojis } = require("../config.json");

exports.run = async (client, interaction, args) => {
  await interaction.deferReply();
  
  let ticket = await settingsModel.find({ });
  ticket = ticket[0].Tickets;
  
  let server = args[0];

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
  
  let error;
  
  await tryChat();
  if (error) await tryChat();
  if (error) await tryChat();
  if (error) await tryChat();
  if (error) {
    await interaction.deleteReply();
    return await interaction.followUp({ content: `${settingsEmojis.no} An error has occurred! This problem is from MSP.`, ephemeral: true });
  };
  
  async function tryChat() {
    try {
      error = false;

      const chatPacket = await sendAmf(
        server,
        "MovieStarPlanet.WebService.Session.AMFSessionServiceForWeb.GetChatPermissionInfo",
        [ buildTicketHeader(ticket[listServers.indexOf(server)]) ]
      );

      const chatStats = chatPacket.bodies[0].data;
      
      let chatEmbed = new MessageEmbed()
        .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
        .setColor(settingsEmbed.color)
        .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

      if (chatStats.status === "permitted") chatEmbed.addField("Chat Info :", `${settingsEmojis.server} Server **»** ${server}\n${settingsEmojis.info} Status **»** Open\n${settingsEmojis.clock} Time before closing **»** ${new Date(chatStats.secondsRemaining * 1000).toISOString().substr(11, 8)}`);
      else chatEmbed.addField("Chat Info **»**", `${settingsEmojis.server} Server **»** ${server}\n${settingsEmojis.info} Status **»** Closed`);

      await interaction.editReply({ embeds: [chatEmbed] });
    } catch {
      error = true;
    }
  }
};

exports.help = new SlashCommandBuilder()
.setName("chat")
.setDescription("Show stats chat")
.addStringOption(option =>
		option.setName("server")
			.setDescription("Choose the MSP server")
			.setRequired(true)
      .addChoice("Denmark", "dk")
      .addChoice("Finland", "fi")
      .addChoice("Great Britain", "gb")
      .addChoice("United States", "us")
      .addChoice("Canada", "ca")
      .addChoice("Spain", "es")
      .addChoice("Norway", "no")
      .addChoice("German", "de")
      .addChoice("Poland", "pl")
      .addChoice("Turkey", "tr")
      .addChoice("Ireland", "ie")
      .addChoice("Sweden", "se")
      .addChoice("Netherland", "nl")
      .addChoice("France", "fr")
      .addChoice("Australia", "au")
      .addChoice("New Zealand", "nz"));