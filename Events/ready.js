const { connect } = require("mongoose");
const { bot, mspLogin } = require("../config.json");
const { settingsModel } = require("../Utils/shemas.js");
const { MspClient } = require("../Utils/MSP/authentification.js");
const { GetSessionId } = require("../Utils/MSP/utilsamf.js");

module.exports = async client => {  
  await connect(bot.URIMongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(() => console.log("An error has occured with MongoDB"));
  
  client.user.setPresence({
    activities: [{
      name: `/help - @MSP to use the bot`,
      type: 0
    }]
  });
  
  console.log("Bot Loaded!");

  if (client.shard.ids.includes(0)) {
    
    await GetSessionId(true);
    setInterval(async () => {
      await GetSessionId(true);
    }, 300000);
    
    async function login() {
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

      let ticketData = [ ];

      for (let server of listServers) {
        const msp = new MspClient(server);
        const status = await msp.LoginAsync(mspLogin.username, mspLogin.password);

        if (status !== "Success") {
          console.log(`Error ticket generation : server ${server}, status : ${status}`);
          ticketData.push("");
          continue;
        };

        ticketData.push(msp.GetTicket());
      };

      await settingsModel.updateMany({ }, { Tickets: ticketData });

      console.log("Accounts are logged on MSP!");
    };
    
    await login();
    setInterval(async () => {
      await login();
    }, 86400000);
  };
};