const { MessageActionRow, MessageButton, MessageEmbed, WebhookClient } = require("discord.js");
const { serverModel } = require("../Utils/shemas.js");
const { bot } = require("../config.json");

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;
  
  let server = await serverModel.findOne({ ID: message.guild.id });
  if (!server) {
    const newServer = new serverModel({
      ID: message.guild.id,
      Prefix: bot.defaultPrefix
    });
    await newServer.save();
    
    server = await serverModel.findOne({ ID: message.guild.id });
  };
  
  // console.log(await message.guild.commands.fetch())
  
  if (message.mentions.users.has(client.user.id) || message.content.startsWith(server.Prefix)) {
    const buttons = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setLabel("Invite me")
      .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands`)
      .setStyle("LINK")
    )
    .addComponents(
      new MessageButton()
      .setLabel("Need help? Join us")
      .setURL("https://discord.gg/bwa9aCr")
      .setStyle("LINK")
    );
    
    return message.channel.send({ content: `:wave: Hi <@${message.author.id}>, we have moved to \`/\` commands.

> To continue using the bot, **you must use the slash commands**.
> To **add the slash commands** to your server, you need to **invite the bot** back to your server, without kicking it.
> You must be <@${message.guild.ownerId}> or have at least the **Manage Guild permission**.

So click on \`Invite me  > Add to server > ${message.guild.name} > Authorize\`.
Need help? Click on the button, we will help you!

<a:rainbow_hype:802908158200250368> The **new prefix** is now \`/\`, so try the command \`/help\`. Enjoy!`, components: [buttons] });
  }
};