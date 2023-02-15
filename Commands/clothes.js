const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { settingsModel, clotheModel } = require("../Utils/shemas.js");
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
  
  await tryClothes();
  if (error) await tryClothes();
  if (error) await tryClothes();
  if (error) await tryClothes();
  if (error) {
    await interaction.deleteReply();
    return await interaction.followUp({ content: `${settingsEmojis.no} An error has occurred! This problem is from MSP.`, ephemeral: true });
  };
  
  async function tryClothes() {
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
      
      let statsPacket = await sendAmf(
        server,
        "MovieStarPlanet.WebService.AMFActorService.BulkLoadActors",
        [ buildTicketHeader(ticket[listServers.indexOf(server)]) , [ Number(actorId) ] ]
      );

      let userStats = statsPacket.bodies[0].data.data[0];

      let gender;
      let eyeshadowid;
      let eyeshadowcolor;
      let moderator;

      (userStats.EyeShadowId === null || userStats.EyeShadowId === 0 ? eyeshadowid = "" : eyeshadowid = `${settingsEmojis.shadow} Eye Shadow ID **»** ${userStats.EyeShadowId}\n`);
      (userStats.EyeShadowColors === null ? eyeshadowcolor = "" : eyeshadowcolor = `${settingsEmojis.color} Eye Shadow Colors **»** ${userStats.EyeShadowColors}\n`);
      (userStats.SkinSWF === "femaleskin" ? gender = `${settingsEmojis.girl} Gender **»** Girl account` : gender = `${settingsEmojis.boy} Gender **»** Boy account`);
      (userStats.Moderator === 0 ? moderator = `${settingsEmojis.moderator} Moderator **»** No` : moderator = `${settingsEmojis.moderator} Moderator **»** Yes (${userStats.Moderator})`);

      let clothes = [ ];
      let starcoins = 0;
      let diamonds = 0;


      for (let clothe of userStats.ActorClothesRels.data) {
        clothes.push(`- [${clothe.Cloth.Name}](${encodeURI(`https://mspbot.tk?id=${await buildClothe(clothe.Cloth.ClothesId, clothe.Cloth.ClothesCategoryId, clothe.Cloth.SWF)}`)}) \`${getCategoryName(clothe.Cloth.ClothesCategoryId)}\``);
        starcoins = starcoins + clothe.Cloth.Price;
        diamonds = diamonds + clothe.Cloth.DiamondsPrice;
      }

      let clothesStr = clothes.join("\n");

      const str = `\nThis look costs ${plurial(starcoins, "Starcoin")} ${settingsEmojis.starcoins} &' ${plurial(diamonds, "Diamond")} ${settingsEmojis.diamonds}.`;

      if (clothesStr.length + str.length > 4096) clothes = `This look costs ${plurial(starcoins, "Starcoin")} ${settingsEmojis.starcoins} &' ${plurial(diamonds, "Diamond")} ${settingsEmojis.diamonds}.\n\n> Clothes can't be see, because Discord don't allow to send a lot of informations in the same field.`;
      else {
        clothes.push(str);
        clothes = clothes.join("\n");
      };

      const statsEmbed = new MessageEmbed()
      .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(`https://snapshots.mspcdns.com/v1/MSP/${server}/snapshot/moviestar/${userStats.ActorId}.jpg`)
      .setDescription(clothes)
      .setImage(`https://snapshots.mspcdns.com/v1/MSP/${server}/snapshot/fullSizeMoviestar/${userStats.ActorId}.jpg`)
      .setColor(settingsEmbed.color)
      .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

      await interaction.editReply({ embeds: [statsEmbed] });
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
  for (let i = a.length-1; i >= 0; i--) {
    c = (d != 0 && d % 3 == 0) ? a[i] + b + c : a[i] + c;
    d++;
  }
  return c;
}

exports.help = new SlashCommandBuilder()
.setName("clothes")
.setDescription("Show user clothes")
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

function getCategoryName(id) {
  switch (id) {
    case 1: return "Hair";
    case 2:
    case 6:
    case 7:
    case 50: return "Tops";
    case 3:
    case 8:
    case 9:
    case 60:
    case 61:
    case 86: return "Bottoms";
    case 10:
    case 11:
    case 12:
    case 70:
    case 71:
    case 84:
    case 85: return "Footwear";
    case 13:
    case 14:
    case 15: return "Headwear";
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 33:
    case 46: return "Stuff";
    case 5:
    case 25:
    case 26:
    case 27:
    case 28:
    case 29:
    case 30:
    case 31:
    case 32:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 47:
    case 55:
    case 89:
    case 88:
    case 80:
    case 90:
    case 91: return "Accessories";
    default: return String(id);
  }
}

function plurial(number, word) {
  if (number > 1) return "**" + numStr(number) + "** " + word + "s";
  else return "**" + numStr(number) + "** " + word;
}

async function buildClothe(ClotheId, ClothesCategoryId, SWF) {
  let clothe = await clotheModel.findOne({ ClotheId: ClotheId });
  if (clothe) return clothe.ID;
  
  let ID = await clotheModel.countDocuments();
  ID++;
  
  clothe = new clotheModel({
    ID: ID,
    ClotheId: ClotheId,
    Link: encodeURI(`https://content.mspcdns.com/swf/${getCategoryName(ClothesCategoryId).toLowerCase()}/${SWF}.swf`)
  });
  
  await clothe.save();
  return ID;
}