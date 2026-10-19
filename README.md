# DSH Modes

DeepSeek Harness 独立模式插件，当前适配 **0.2.1-rc.2**。

启用后，菜单保留三个模式：

| 模式 | 行为 |
| --- | --- |
| 标准模式 | 保持宿主原有配置 |
| 增强模式 | 继承当前宿主发布的原厂标准工具，添加正常任务的澄清、精准实施和结果验证提示 |
| 创造模式 | 保持宿主原有配置 |

PTC 与极简的声明由插件禁用，不删除原始文件。卸载本插件后恢复宿主菜单。已有历史会话若使用被隐藏的模式，应先切换到标准模式；不要删除会话记录。

## 安装

先退出 Harness，再使用官方 CLI：

```sh
dsh plugin --profile desktop add github:mengxiaoww/dsh-modes
```

重新打开 Harness。首次使用建议新建会话，再选择增强模式。插件通过官方预设注册接口工作，不修改应用、审批、沙箱或模型设置。

## 卸载

```sh
dsh plugin --profile desktop remove dsh-modes
```

重启 Harness 后恢复原有菜单。使用本插件新增模式的历史会话在卸载前需切换回标准模式，因为宿主重启后无法恢复已移除的预设。

## 边界与验证

- 标准与创造的定义不会被插件覆盖。增强模式读取宿主发布的标准预设 YAML，保留 `!!js` 条件及原工具配置。
- 工作提示只注册在增强预设的作用域内，随插件卸载清理；不会全局注入。
- 基础定义在启动时继承自原厂模板；用户针对标准模式另写的 profile 覆盖不会带入增强模式。升级宿主后需按目标版本重新验证。
- 预设共享宿主和权限服务，**不是安全沙箱**。
- 不包括 dsh-purge 的全局补丁、安全绕过、拒答重试、加密人设或红队组件。
- 若曾安装会改宿主文件的插件，需先恢复原厂应用；卸载包本身不能撤销其他插件已写入的修改。
- `npm test` 验证继承数据隔离、条件保留和异常基线；本机还需验证真实宿主的模式加载、提示作用域及卸载。
- 本次在 macOS 的原厂 0.2.1-rc.2 宿主中验证了三个预设正常加载、标准和创造定义不变、卸载恢复四个原厂预设。没有据此宣称模型回答质量一定提升，Windows/Linux 的真实宿主仍需另行验证。

## 开发

```sh
npm ci --ignore-scripts
npm run check
npm test
```

macOS 本机可用原厂运行时验证提示的作用域和卸载：

```sh
ELECTRON_RUN_AS_NODE=1 "/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness" \
  --expose-internals scripts/check-native.mjs \
  "/Applications/DeepSeek Harness.app/Contents/Resources/app.asar/dsh/package.json"
```

这个检查不发送模型请求，也不读取账号凭据。

## 来源与许可证

本仓库从 [YuJunZhiXue/dsh-purge](https://github.com/YuJunZhiXue/dsh-purge) fork，保留原作者**小杨**及原仓库署名。当前实现重写为普通模式管理，不包含原项目的安全绕过功能。

MIT，见 [LICENSE](LICENSE)。
