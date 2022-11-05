const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skippar skit låten ingen vill lyssna på"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("Fan starta någon jävla låt då, jag är rastlös");
      return;
    }

    const currentSong = queue.current;

    queue.skip();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Skippade **${currentSong.title}**`)
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
