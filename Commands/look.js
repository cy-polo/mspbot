const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { sendAmf } = require("../Utils/MSP/amf.js");
const { settingsEmbed, settingsEmojis } = require("../config.json");

exports.run = async (client, interaction, args) => {
  await interaction.deferReply();

  let server = args[0];
  const username = args[1];

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
  
  await tryLook();
  if (error) await tryLook();
  if (error) await tryLook();
  if (error) await tryLook();
  if (error) {
    await interaction.deleteReply();
    return await interaction.followUp({ content: `${settingsEmojis.no} An error has occurred! This problem is from MSP.`, ephemeral: true });
  };
  
  async function tryLook() {
    try {
      error = false;

      const amfPacket = await sendAmf(
        server,
        "MovieStarPlanet.WebService.AMFActorService.GetActorIdByName",
        [ username ]
      );

      const actorId = amfPacket.bodies[0].data;

      if (actorId == 0) {
        await interaction.deleteReply();
        return await interaction.followUp({ content: settingsEmojis.no + " Username not found!", ephemeral: true });
      };
      
      try {
        await fetch(`https://snapshots.mspcdns.com/v1/MSP/${server}/snapshot/fullSizeMoviestar/${actorId}.jpg`)
        .then(res => res.json());
        
        return await interaction.editReply({ content: settingsEmojis.no + " This user exists, but no image is available.", ephemeral: true });
      } catch {
        const statsEmbed = new MessageEmbed()
        .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(`https://snapshots.mspcdns.com/v1/MSP/${server}/snapshot/moviestar/${actorId}.jpg`)
        .addFields({ name: "Actor Info :", value: `${settingsEmojis.info} Username **»** ${username}\n${settingsEmojis.server} Server **»** ${server}\n\n**Look :**\n${settingsEmojis.right} [Download Image](https://snapshots.mspcdns.com/v1/MSP/${server}/snapshot/fullSizeMoviestar/${actorId}.jpg)` })
        .setImage(`https://snapshots.mspcdns.com/v1/MSP/${server}/snapshot/fullSizeMoviestar/${actorId}.jpg`)
        .setColor(settingsEmbed.color)
        .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

        await interaction.editReply({ embeds: [statsEmbed]});
      }
    } catch {
      error = true;
    }
  }
};

exports.help = new SlashCommandBuilder()
.setName("look")
.setDescription("Show user look")
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
      .addChoice("New Zealand", "nz"))
.addStringOption(option =>
		option.setName("username")
			.setDescription("MSP account name")
			.setRequired(true));