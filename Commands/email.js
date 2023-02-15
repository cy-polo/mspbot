const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const { sendAmf } = require("../Utils/MSP/amf.js");
const { settingsEmojis } = require("../config.json");

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
  
  await tryEmail();
  if (error) await tryEmail();
  if (error) await tryEmail();
  if (error) await tryEmail();
  if (error) {
    await interaction.deleteReply();
    return await interaction.followUp({ content: `${settingsEmojis.no} An error has occurred! This problem is from MSP.`, ephemeral: true });
  };
  
  async function tryEmail() {
    try {
      error = false;

      const amfPacket = await sendAmf(
        server,
        "MovieStarPlanet.WebService.AMFActorService.GetActorIdByName",
        [ username ]
      );

      let actorId = amfPacket.bodies[0].data;

      if (actorId == 0) {
        await interaction.deleteReply();
        return await interaction.followUp({ content: settingsEmojis.no + " Username not found!", ephemeral: true });
      };
      
      const buff = Buffer.from(`uid=${actorId};emailValidation=true`, "utf-8");
      const base64 = buff.toString("base64");

      switch (server) {
        case "us":
          server = "com";
          break;
        case "uk":
          server = "co.uk";
          break;
        case "nz":
          server = "co.nz"
          break;
        case "tr":
          server = "com.tr";
          break;
      };

      if (server === "es") await fetch(`https://mystarplanet.es/EmailActivation.aspx?${base64}`);
      else await fetch(`https://moviestarplanet.${server}/EmailActivation.aspx?${base64}`);
      
      await interaction.editReply({ content: settingsEmojis.yes + " email valided!" });
    } catch {
        error = true;
    }
  }
};

exports.help = new SlashCommandBuilder()
.setName("email")
.setDescription("Valid any email for the first time")
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