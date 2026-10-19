export function createEnhancedPreset(plugins) {
  if (!Array.isArray(plugins) || plugins.length === 0) {
    throw new Error("The standard preset must contain plugins.");
  }
  if (plugins.some(plugin => plugin.id === "dsh-modes-guidance")) {
    throw new Error("The standard preset already contains dsh-modes guidance.");
  }
  return {
    id: "dsh-modes-enhanced",
    name: "增强模式",
    description: "继承标准工具，强化正常任务的需求澄清、精准实施和结果验证。",
    order: 2,
    plugins: [
      ...structuredClone(plugins),
      {id: "dsh-modes-guidance", name: "dsh-modes/guidance"},
    ],
  };
}
