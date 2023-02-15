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
  
 await tryRoom();
 if (error) await tryRoom();
 if (error) await tryRoom();
 if (error) await tryRoom();
 if (error) {
   await interaction.deleteReply();
   return await interaction.followUp({ content: `${settingsEmojis.no} An error has occurred! This problem is from MSP.`, ephemeral: true });
 };

async function tryRoom() {
  try {
    error = false;

    let amfPacket = await sendAmf(
      server,
      "MovieStarPlanet.WebService.AMFActorService.GetActorIdByName",
      [ username ]
    );

    let actorId = amfPacket.bodies[0].data;

    if (actorId == 0) {
      await interaction.deleteReply();
      return await interaction.followUp({ content: settingsEmojis.no + " Username not found!", ephemeral: true });
    };
    
    const roomPacket = await sendAmf(
      server,
      "MovieStarPlanet.WebService.Profile.AMFProfileService.loadActorRoom",
      [ buildTicketHeader(ticket[listServers.indexOf(server)]), actorId, ticket[listServers.indexOf(server)].split(",")[1] ]
    );

    let roomStats = roomPacket.bodies[0].data.actorRoom;
    let actor = String(roomStats.ActorId);

    let id = actor;
    actor = [0, parseInt(id / 1000000 % 1000), parseInt(id / 1000 % 1000), parseInt(id % 1000)].join("_");

    const roomEmbed = new MessageEmbed()
    .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(`https://snapshots.mspcdns.com/v1/MSP/${server}/snapshot/moviestar/${roomStats.ActorId}.jpg`)
      .addFields({ name: "Room Info :", value: `${settingsEmojis.info} Username **»** ${username}\n${settingsEmojis.server} Server **»** ${server}\n${settingsEmojis.love} Likes **»** ${numStr(roomStats.RoomLikes)}` })
      .setImage(`https://snapshots.mspcdns.com/v1/snapshots/MSP_${server}_room_${actor}.jpg?MC`)
      .setColor(settingsEmbed.color)
      .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

    await interaction.editReply({ embeds: [roomEmbed] });

  } catch {
    error = true;
  }
  }
};

function numStr(a, b) {
  a = "" + a;
  b = b || " ";
  const c = "",
      d = 0;
  while (a.match(/^0[0-9]/)) {
    a = a.substr(1);
  }
  for (const i = a.length-1; i >= 0; i--) {
    c = (d != 0 && d % 3 == 0) ? a[i] + b + c : a[i] + c;
    d++;
  }
  return c;
}

exports.help = new SlashCommandBuilder()
.setName("room")
.setDescription("Show user room")
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