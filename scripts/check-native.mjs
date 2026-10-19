import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {resolve} from "node:path";
import * as guidance from "../lib/guidance.js";

if (!process.argv[2]) {
  throw new Error("Pass the installed Harness dsh/package.json path.");
}
const require = createRequire(resolve(process.argv[2]));
const {Context} = await import(require.resolve("@deepseek-ai/cordis"));
const {SystemPrompt, renderPrompt} = await import(require.resolve("@deepseek-ai/dsh-system-prompt"));
const {createScope} = await import(require.resolve("@deepseek-ai/dsh-scope"));

const ctx = new Context();
const system = ctx.plugin(SystemPrompt, {personaPrefix: "Native baseline persona."});
await system.await();
const keys = [{}, {}, {}];
const scopes = keys.map(key => createScope(ctx, key));
try {
  const enhanced = scopes[1].ctx.plugin(guidance);
  await enhanced.await();
  const assemble = scope => ctx.systemPrompt.assemble({scope});
  for (const scope of [undefined, keys[0], keys[2]]) {
    const prompt = renderPrompt(await assemble(scope));
    assert.ok(prompt.includes("Native baseline persona."));
    assert.ok(!prompt.includes(guidance.guidance));
  }
  const own = await assemble(keys[1]);
  assert.equal(own.sections.filter(row => row.name === "dsh-modes:normal-workflow").length, 1);
  assert.ok(renderPrompt(own).includes(guidance.guidance));
  await enhanced.dispose();
  assert.ok(!renderPrompt(await assemble(keys[1])).includes(guidance.guidance));
  console.log("PASS: native prompt scope isolation, baseline preservation, and unload cleanup.");
} finally {
  for (const scope of scopes) await scope.dispose();
  await system.dispose();
}
