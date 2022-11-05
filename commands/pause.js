const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausar skiten"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("Fan starta någon jävla låt då, jag är rastlös");
      return;
    }

    queue.setPaused(true);

    await interaction.reply(
      "Vafan pausade du mig huh, skulle du vilja bli pausad? \n eller?"
    );
  },
};
