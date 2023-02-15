const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { settingsModel } = require("../Utils/shemas.js");
const { sendAmf, buildTicketHeader } = require("../Utils/MSP/amf.js");
const { settingsEmbed, settingsEmojis } = require("../config.json");

exports.run = async (client, interaction) => {  
  await interaction.deferReply();
  
  let ticket = await settingsModel.find({ });
  ticket = ticket[0].Tickets;
  
  let error;
  
  await tryTheme();
  if (error) await tryTheme();
  if (error) await tryTheme();
  if (error) await tryTheme();
  if (error) {
    await interaction.deleteReply();
    return await interaction.followUp({ content: `${settingsEmojis.no} An error has occurred! This problem is from MSP.`, ephemeral: true });
  };
  
  async function tryTheme() {
    try {
      error = false;  

      let packet = await sendAmf(
        "nz",
        "MovieStarPlanet.WebService.Shopping.AMFShopContentService.GetThemes",
        [ buildTicketHeader(ticket[1]), Number(0), Number(8)]
      );

      let themeInfo = packet.bodies[0].data.items;
      let page = 0;

      const themeEmbed = new MessageEmbed()
      .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
      .addFields({ name: "Theme Info :", value: `${settingsEmojis.info} Name **»** ${themeInfo[page].Name}\n${settingsEmojis.id} ID **»** ${themeInfo[page].ThemeID}\n${settingsEmojis.number} Page **»** **${page+1}/8**\n\n**Image :**\n${settingsEmojis.right} [Download Image](https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath})` })
      .setImage(`https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath}`)
      .setColor(settingsEmbed.color)
      .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });
      
      let updateButton = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId("1")
        .setEmoji("⏮️")
        .setStyle("PRIMARY")
        .setDisabled(true),
			)
      .addComponents(
        new MessageButton()
        .setCustomId("2")
        .setEmoji("⬅️")
        .setStyle("PRIMARY")
        .setDisabled(true),
			)
      .addComponents(
        new MessageButton()
        .setCustomId("3")
        .setEmoji("➡️")
        .setStyle("PRIMARY"),
			)
      .addComponents(
        new MessageButton()
        .setCustomId("4")
        .setEmoji("⏭️")
        .setStyle("PRIMARY"),
			);

      await interaction.editReply({ embeds: [themeEmbed], components: [updateButton] });
      
      const filter = i => i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
      
      collector.on("collect", async i => {
        if (i.customId === "2") {
          // ⬅️
          page--;
                    
          if (page == 0) {
            updateButton = new MessageActionRow()
            .addComponents(
              new MessageButton()
              .setCustomId("1")
              .setEmoji("⏮️")
              .setStyle("PRIMARY")
              .setDisabled(true),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("2")
              .setEmoji("⬅️")
              .setStyle("PRIMARY")
              .setDisabled(true),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("3")
              .setEmoji("➡️")
              .setStyle("PRIMARY"),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("4")
              .setEmoji("⏭️")
              .setStyle("PRIMARY"),
            );
          } else {
            updateButton = new MessageActionRow()
            .addComponents(
              new MessageButton()
              .setCustomId("1")
              .setEmoji("⏮️")
              .setStyle("PRIMARY"),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("2")
              .setEmoji("⬅️")
              .setStyle("PRIMARY"),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("3")
              .setEmoji("➡️")
              .setStyle("PRIMARY"),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("4")
              .setEmoji("⏭️")
              .setStyle("PRIMARY"),
            );
          };

          const themeEmbedNew = new MessageEmbed()
          .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
          .addFields({ name: "Theme Info :", value: `${settingsEmojis.info} Name **»** ${themeInfo[page].Name}\n${settingsEmojis.id} ID **»** ${themeInfo[page].ThemeID}\n${settingsEmojis.number} Page **»** **${page+1}/8**\n\n**Image :**\n${settingsEmojis.right} [Download Image](https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath})` })
          .setImage(`https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath}`)
          .setColor(settingsEmbed.color)
          .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

          return await i.update({ embeds: [themeEmbedNew], components: [updateButton] });
        }
        if (i.customId === "3") {
          // ➡️
          
          if (page == 6) {
            updateButton = new MessageActionRow()
            .addComponents(
              new MessageButton()
              .setCustomId("1")
              .setEmoji("⏮️")
              .setStyle("PRIMARY"),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("2")
              .setEmoji("⬅️")
              .setStyle("PRIMARY"),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("3")
              .setEmoji("➡️")
              .setStyle("PRIMARY")
              .setDisabled(true),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("4")
              .setEmoji("⏭️")
              .setStyle("PRIMARY")
              .setDisabled(true),
            );
          } else {
            updateButton = new MessageActionRow()
            .addComponents(
              new MessageButton()
              .setCustomId("1")
              .setEmoji("⏮️")
              .setStyle("PRIMARY"),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("2")
              .setEmoji("⬅️")
              .setStyle("PRIMARY"),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("3")
              .setEmoji("➡️")
              .setStyle("PRIMARY"),
            )
            .addComponents(
              new MessageButton()
              .setCustomId("4")
              .setEmoji("⏭️")
              .setStyle("PRIMARY"),
            );
          };
          
          page++;

          const themeEmbedNew = new MessageEmbed()
          .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
          .addFields({ name: "Theme Info :", value: `${settingsEmojis.info} Name **»** ${themeInfo[page].Name}\n${settingsEmojis.id} ID **»** ${themeInfo[page].ThemeID}\n${settingsEmojis.number} Page **»** **${page+1}/8**\n\n**Image :**\n${settingsEmojis.right} [Download Image](https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath})` })
          .setImage(`https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath}`)
          .setColor(settingsEmbed.color)
          .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });
          
          return await i.update({ embeds: [themeEmbedNew], components: [updateButton] });
        } if (i.customId === "1") {
          // ⏮️
          
          page = 0;
          
          updateButton = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setCustomId("1")
            .setEmoji("⏮️")
            .setStyle("PRIMARY")
            .setDisabled(true),
          )
          .addComponents(
            new MessageButton()
            .setCustomId("2")
            .setEmoji("⬅️")
            .setStyle("PRIMARY")
            .setDisabled(true),
          )
          .addComponents(
            new MessageButton()
            .setCustomId("3")
            .setEmoji("➡️")
            .setStyle("PRIMARY"),
          )
          .addComponents(
            new MessageButton()
            .setCustomId("4")
            .setEmoji("⏭️")
            .setStyle("PRIMARY"),
          );

          const themeEmbedNew = new MessageEmbed()
          .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
          .addFields({ name: "Theme Info :", value: `${settingsEmojis.info} Name **»** ${themeInfo[page].Name}\n${settingsEmojis.id} ID **»** ${themeInfo[page].ThemeID}\n${settingsEmojis.number} Page **»** **${page+1}/8**\n\n**Image :**\n${settingsEmojis.right} [Download Image](https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath})` })
          .setImage(`https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath}`)
          .setColor(settingsEmbed.color)
          .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

          return await i.update({ embeds: [themeEmbedNew], components: [updateButton] });
        } if (i.customId === "4") {
          // ⏭️
          
          if (page == 7) return;
          page = 7;
          
          updateButton = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setCustomId("1")
            .setEmoji("⏮️")
            .setStyle("PRIMARY"),
          )
          .addComponents(
            new MessageButton()
            .setCustomId("2")
            .setEmoji("⬅️")
            .setStyle("PRIMARY"),
          )
          .addComponents(
            new MessageButton()
            .setCustomId("3")
            .setEmoji("➡️")
            .setStyle("PRIMARY")
            .setDisabled(true),
          )
          .addComponents(
            new MessageButton()
            .setCustomId("4")
            .setEmoji("⏭️")
            .setStyle("PRIMARY")
           .setDisabled(true),
          );

          const themeEmbedNew = new MessageEmbed()
          .setAuthor({ name: client.user.username, url: `https://top.gg/bot/${client.user.id}`, iconURL: client.user.displayAvatarURL() })
          .addFields({
            name: "Theme Info :",
            value: `${settingsEmojis.info} Name **»** ${themeInfo[page].Name}\n${settingsEmojis.id} ID **»** ${themeInfo[page].ThemeID}\n${settingsEmojis.number} Page **»** **${page+1}/8**\n\n**Image :**\n${settingsEmojis.right} [Download Image](https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath})`
          })
          .setImage(
            `https://content.mspcdns.com/NZ/${themeInfo[page].SnapshotPath}`
          )
          .setColor(settingsEmbed.color)
          .setFooter({ text: settingsEmbed.footer, iconURL: settingsEmbed.image });

          return await i.update({ embeds: [themeEmbedNew], components: [updateButton] });
        }
      });
      
      collector.on("end", async () => {
        return await interaction.editReply({ components: [] });
      });
    } catch {
      error = true;
    }
  }
};

exports.help = new SlashCommandBuilder()
.setName("theme")
.setDescription("Show the last 8 themes");