const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Startar skit låten ingen vill lyssna på igen"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("Fan starta någon jävla låt då, jag är rastlös");
      return;
    }

    queue.setPaused(false);

    await interaction.reply("Äntligen, fan pausade du mig för? Jävla idiot");
  },
};
