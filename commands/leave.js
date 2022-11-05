const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Kickar mig från vänskapsgruppen, wow"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("Fan starta någon jävla låt då, jag är rastlös");
      return;
    }

    queue.destroy();

    await interaction.reply("Wow, är ni för bra för mig eller?\n :(");
  },
};
