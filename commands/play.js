const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Spelar en låt jävel")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Söker efter nån låt")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription("Nyckelord")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Spelar en spellista")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("the playlist's url")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Spelar en video, eller?")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("the song's url")
            .setRequired(true)
        )
    ),
  execute: async ({ client, interaction }) => {
    // Make sure the user is inside a voice channel
    if (!interaction.member.voice.channel)
      return interaction.reply(
        "You need to be in a Voice Channel to play a song."
      );

    // Create a play queue for the server
    const queue = await client.player.createQueue(interaction.guild);

    // Wait until you are connected to the channel
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");

      // Search for the song using the discord-player
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      // finish if no tracks were found
      if (result.tracks.length === 0)
        return interaction.reply("Inga resultat, stava rätt din åsna");
      // Add the track to the queue
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setDescription(
          `**[${song.title}](${song.url})** har lagts till i kön.`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });

      user = message.member;
      user = user.toString();
      if (user.includes("!")) {
        user = user.split("!")[1].split(">")[0];
      } else {
        user = user.split("@")[1].split(">")[0];
      }
      client.users.get(user).username;

      console.log(
        `${interaction.guild.name}, ${user} lade till ${song.title} i kön`
      );
    } else if (interaction.options.getSubcommand() === "playlist") {
      // Search for the playlist using the discord-player
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0)
        return interaction.reply(`Det här var ingen spellista, bruh ${url}`);

      // Add the tracks to the queue
      const playlist = result.playlist;
      await queue.addTracks(result.tracks);
      embed
        .setDescription(
          `**${result.tracks.length} låtar från [${playlist.title}](${playlist.url})** har lagts till i kön`
        )
        .setThumbnail(playlist.thumbnail);
    } else if (interaction.options.getSubcommand() === "search") {
      // Search for the song using the discord-player
      let url = interaction.options.getString("searchterms");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      // finish if no tracks were found
      if (result.tracks.length === 0)
        return interaction.editReply("Inga resultat, bruh");

      // Add the track to the queue
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setDescription(`**[${song.title}](${song.url})** har lagts till i kön`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Längd: ${song.duration}` });

      console.log(
        `${interaction.guild.name}, ${interaction.member.user.tag} lade till ${song.title} av i kön`
      );
    }

    // Play the song
    if (!queue.playing) await queue.play();

    // Respond with the embed containing information about the player
    await interaction.reply({
      embeds: [embed],
    });
  },
};
