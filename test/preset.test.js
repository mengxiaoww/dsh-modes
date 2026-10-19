import test from "node:test";
import assert from "node:assert/strict";
import {createEnhancedPreset} from "../lib/preset.js";

test("enhanced edits cannot mutate the inherited standard configuration", () => {
  const standard = [{id: "fs", name: "tool-fs", config: {read: true}}];
  const enhanced = createEnhancedPreset(standard);
  enhanced.plugins[0].config.read = false;
  assert.equal(standard[0].config.read, true);
});

test("preserves platform expressions, disabled tools, and unfamiliar plugins", () => {
  const standard = [
    {id: "shell", disabled: {__jsExpr: "process.platform === 'win32'"}},
    {id: "future-tool", disabled: true, config: {limit: 7}},
  ];
  const enhanced = createEnhancedPreset(standard);
  assert.deepEqual(enhanced.plugins.slice(0, -1), standard);
  assert.notEqual(enhanced.plugins[0].disabled, standard[0].disabled);
});

test("rejects a missing baseline instead of registering a tool-less mode", () => {
  for (const value of [undefined, null, {}, []]) {
    assert.throws(() => createEnhancedPreset(value), /must contain plugins/);
  }
});

test("rejects recursive inheritance instead of duplicating guidance", () => {
  assert.throws(
    () => createEnhancedPreset([{id: "dsh-modes-guidance"}]),
    /already contains/,
  );
});
