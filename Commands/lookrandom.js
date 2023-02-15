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
  
  await tryLookRandom();
  if(error) await tryLookRandom();
  if(error) await tryLookRandom();
  if(error) await tryLookRandom();
  if(error) {
    await interaction.deleteReply();
    return await interaction.followUp({ content: `${settingsEmojis.no} An error has occurred! This problem is from MSP.`, ephemeral: true });
  };
  
  async function tryLookRandom() {
    try {
      error = false; 

      const lookRandomPacket = await sendAmf(
        server,
        "MovieStarPlanet.WebService.Looks.AMFLookService.GetRandomLookByLikes",
        [ buildTicketHeader(ticket[listServers.indexOf(server)]), 10 ]
      );

      let lookInfo = lookRandomPacket.bodies[0].data;
      let LookId = String(lookInfo.LookId);

      let id = LookId;
      LookId = [0, parseInt(id / 1000000 % 1000), parseInt(id / 1000 % 1000), parseInt(id % 1000)].join("_");

      const lookEmbed = new MessageEmbed()
      .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(`https://snapshots.mspcdns.com/v1/MSP/${server}/snapshot/moviestar/${lookInfo.ActorId}.jpg`)
      .addFields({ name: "Look Info :", value: `${settingsEmojis.info} Title **»** ${lookInfo.Headline}\n${settingsEmojis.love} Likes **»** ${lookInfo.Likes}\n${settingsEmojis.sells} Sells **»** ${lookInfo.Sells} \n\n**Look :**\n${settingsEmojis.right} [Download Image](https://snapshots.mspcdns.com/v1/snapshots/MSP_${server}_look_${LookId}.jpg)` })
      .setImage(`https://snapshots.mspcdns.com/v1/snapshots/MSP_${server}_look_${LookId}.jpg`)
      .setColor(settingsEmbed.color)
      .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

      await interaction.editReply({ embeds: [lookEmbed] });
    } catch {
      error = true;
    }
  }
};

exports.help = new SlashCommandBuilder()
.setName("lookrandom")
.setDescription("Send random look")
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