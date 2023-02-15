const { Client, Collection, WebhookClient, Intents, Options } = require("discord.js");
const { readdir } = require("fs");
const { bot, settingsDbl } = require("./config.json");
const { slash } = require("./Utils/slash.js");

const client = new Client({
	makeCache: Options.cacheWithLimits({
		MessageManager: 200,
		PresenceManager: 0
	}),
  intents: [ Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS ],
  allowedMentions: { parse: ["users"], repliedUser: true }
});
client.commands = new Collection();

// API: Only for the shard 0
if (client.shard.ids.includes(0)) {
  const express = require("express");
  const bodyParser = require("body-parser");
  const cors = require("cors");

  const { clotheModel } = require("./Utils/shemas.js");

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.post("/webhooks_bot", async (req, res) => {
    res.sendStatus(200);

    if (req.headers.authorization === settingsDbl.authorization_bot) {
      const user = req.body.user;

      const webhookClient = new WebhookClient({ id: settingsDbl.id, token: settingsDbl.token });

      await webhookClient.send({ content: `:arrow_up: | <@${user}> (\`${user}\`) has just voted for **${client.user.username}**, thank you! https://top.gg/bot/${client.user.id}/vote` });
  }});

  app.get("/getLink", async (req, res) => {
    let id = req.query.id;

    if (isNaN(id)) return res.sendStatus(500);
    id = parseInt(id);

    const clothe = await clotheModel.findOne({ ID: id });
    if (!clothe) return res.sendStatus(404);

    res.json({ link: clothe.Link });
  });

  app.listen(settingsDbl.port, () => {
    console.log("The server is online!");
  })
};

readdir("./Commands/", async(error, files) => {
  let commands = files.filter(f => f.split(".").pop() === "js");

  let commandsArray = [ ];
  commands.forEach(commandFile => {
    let command = require(`./Commands/${commandFile}`);
    console.log(`Loaded ${commandFile}!`);
    client.commands.set(command.help.name, command);

    commandsArray.push(command);
  });

  const finalArray = commandsArray.map((e) => e.help.toJSON());
  // console.log(finalArray);
  await slash(bot.id, false, finalArray);
});

readdir("./Events/", (error, files) => {
  let events = files.filter(f => f.split(".").pop() === "js");

  events.forEach(eventFile => {
    let events = require(`./Events/${eventFile}`);
    let event = eventFile.split(".")[0];
    client.on(event, events.bind(null, client));
  });
});

client.login(bot.token);