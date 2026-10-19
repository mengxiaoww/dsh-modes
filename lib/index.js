import {load} from "js-yaml";
import {readFile} from "node:fs/promises";
import {entryListSchema} from "@deepseek-ai/cordis-plugin-include";
import {createEnhancedPreset} from "./preset.js";

export const name = "dsh-modes";
export const inject = ["agentPresets"];

export async function apply(ctx) {
  await ctx.effect(async () => {
    const file = new URL(import.meta.resolve("@deepseek-ai/dsh-web-app/presets/standard.patch.yml"));
    const patches = load(await readFile(file, "utf8"), {schema: entryListSchema});
    const standard = patches.flatMap(patch => patch.insert ?? [])
      .find(entry => entry.id === "preset-standard");
    return ctx.agentPresets.register(createEnhancedPreset(standard?.config?.plugins));
  });
}
