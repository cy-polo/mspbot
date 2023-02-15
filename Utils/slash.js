const { bot } = require("../config.json");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

let cmdDatas;

exports.slash = async(clientId, guildId = false, commands = false) => {  
  const rest = new REST({ version: "9" }).setToken(bot.token);

  try {
    if (guildId) {     
      await rest
        .put(Routes.applicationGuildCommands(clientId, guildId), {
          body: cmdDatas,
        })
        .then(() => {
          return true;
        });
    } else {
      console.log("Registering Slash Commands...");
      cmdDatas = commands;
      
      await rest
        .put(Routes.applicationCommands(clientId), { body: cmdDatas })
        .then(() => {
          return true;
        });
    }
  } catch (error) {
    return false;
  }
};