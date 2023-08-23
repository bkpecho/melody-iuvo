import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { ReferenceData } from "../config/AssetData";
import { AssetHandler, AssetTarget } from "../interfaces/Asset";
import { Command } from "../interfaces/Command";
import { defaultAssetEmbed } from "../modules/subcommands/assets/defaultAssetEmbed";
import { handleAdventureAsset } from "../modules/subcommands/assets/handleAdventureAsset";
import { handleEmoteAsset } from "../modules/subcommands/assets/handleEmoteAsset";
import { handleKoikatsuAsset } from "../modules/subcommands/assets/handleKoikatsuAsset";
import { handleOutfitAsset } from "../modules/subcommands/assets/handleOutfitAsset";
import { handlePortraitAsset } from "../modules/subcommands/assets/handlePortraitAsset";
import { handleReferenceAsset } from "../modules/subcommands/assets/handleReferenceAsset";
import { handleTattooAsset } from "../modules/subcommands/assets/handleTattooAsset";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";

const handlers: { [key: string]: AssetHandler } = {
  adventure: handleAdventureAsset,
  emote: handleEmoteAsset,
  koikatsu: handleKoikatsuAsset,
  outfit: handleOutfitAsset,
  portrait: handlePortraitAsset,
  reference: handleReferenceAsset,
  tattoo: handleTattooAsset,
};

export const assets: Command = {
  data: new SlashCommandBuilder()
    .setName("assets")
    .setDescription("Commands for various assets.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("outfit")
        .setDescription("Get a random outfit.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("adventure")
        .setDescription("Get a random game screenshot.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("Whose adventure do you want to see?")
            .setRequired(true)
            .addChoices(
              { name: "Naomi", value: "naomi" },
              { name: "Becca", value: "becca" },
              { name: "Rosalia", value: "rosalia" }
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("emote")
        .setDescription("Get a random emote.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("Whose emotes do you want to see?")
            .setRequired(true)
            .addChoices(
              { name: "Naomi", value: "naomi" },
              { name: "Becca", value: "becca" }
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("portrait")
        .setDescription("Get a random artwork.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("Whose art do you want to see?")
            .setRequired(true)
            .addChoices(
              { name: "Naomi", value: "naomi" },
              { name: "Becca", value: "becca" },
              { name: "Rosalia", value: "rosalia" },
              { name: "Beccalia", value: "beccalia" }
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("tattoo")
        .setDescription("Get a random tattoo.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("koikatsu")
        .setDescription("Get a random Koikatsu scene.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("Whose poses do you want to see?")
            .setRequired(true)
            .addChoices(
              { name: "Naomi", value: "naomi" },
              { name: "Becca", value: "becca" },
              { name: "Rosalia", value: "rosalia" },
              { name: "Beccalia", value: "beccalia" },
              { name: "Novas", value: "novas" },
              { name: "Melody", value: "melody" }
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("reference")
        .setDescription("Get a reference for Naomi art.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("The type of reference to get.")
            .setRequired(true)
            .addChoices(
              ...ReferenceData.map((ref) => ({
                name: ref.name,
                value: ref.name,
              }))
            )
        )
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();
      const target = interaction.options.getString("target") || "";
      const embed = handlers[subcommand]
        ? await handlers[subcommand](bot, target as AssetTarget)
        : defaultAssetEmbed;
      await interaction.editReply({
        content:
          isOwner(interaction.user.id) && subcommand === "outfit"
            ? "Mistress, I chose this outfit for your next meeting."
            : "",
        embeds: [embed],
      });
    } catch (err) {
      await errorHandler(bot, "assets command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later.",
      });
    }
  },
};