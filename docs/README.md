# FableMaker Two：从 Tap 到 Fountain

> 状态：战略、产品、架构与设计建议；未修改现有 FM 代码。
> 研究截点：2026-09-01（H3 研究基于 2026-08-31 的一手资料核对）。

## 一句话决定

**不要把 FM 重建成另一个通用 AI 视频工具，也不要因为 H3 而放弃 FM。**

保留现有的「一句提示词 → 一个输出」作为低摩擦的 `Scratch`；并行推出 `World Beta`，把产品核心从“帮我生成一个文件”改成：

> **让我的角色、事实、关系和参考资产在每一次生成后仍然属于我，并能在下一次可靠地复用。**

模型是执行器，World/Canon 才是产品资产。H3 Max 可做便宜、快速的 Preview，H3 或其他模型负责需要更高控制度的 Final。

## 文档地图

| 文件 | 用途 |
|---|---|
| [00-executive-decision.md](00-executive-decision.md) | 核心判断、定位、目标客户与边界 |
| [01-current-state-code-audit.md](01-current-state-code-audit.md) | 基于现有代码的端到端事实地图 |
| [02-kano-fountain-over-tap.md](02-kano-fountain-over-tap.md) | Kano、Fountain-over-Tap 与竞争判断 |
| [03-idea-landscape.md](03-idea-landscape.md) | 结构化脑暴、候选概念与取舍 |
| [04-market-sizing.md](04-market-sizing.md) | B2C/B2B 市场边界、假设、敏感性与验证 |
| [05-business-monetization.md](05-business-monetization.md) | 自助式商业模型、按真实成本结算、退款边界 |
| [06-ux-product-ia.md](06-ux-product-ia.md) | IA、用户流程、桌面/移动主要页面规范 |
| [07-backend-data-api-observability.md](07-backend-data-api-observability.md) | 数据模型、API、队列、账本、可观测性 |
| [08-roadmap-validation-not-build.md](08-roadmap-validation-not-build.md) | 分阶段路线图、实验、退出条件与不应建设项 |
| [design/web-app-design.html](design/web-app-design.html) | 可点击的网页与移动响应式产品设计原型 |

## 设计交付

- Fountain 生成流程：在本轮回复中以交互式流程图呈现。
- 商业/计费与价值循环：在本轮回复中以交互式双车道图呈现。
- 网页原型：`design/web-app-design.html`，涵盖 Worlds、World Dashboard、Character、Contract、Preview/Approval、Wallet；窄屏会切换为移动布局。

## 证据规则

- **代码确认**：只陈述在仓库文件中可定位的行为。
- **远程资料确认**：H3、fal、Pieter Levels 等事实保留原始链接，并注明自述、限制或未披露处。
- **建议状态**：使用“建议、应、可验证”，不伪装成已实现功能。
- **市场估算**：只作为决策假设，不把代理人口径冒充为真实 TAM。

## 不变的原则

1. 不把用户推入模型选择器、额度术语或供应商迷宫。
2. 不把用户主观不喜欢和技术失败混成同一种退款政策。
3. 不自动把 AI 猜出的内容写进 Canon；只有用户确认才能成为世界事实。
4. 不用破坏性 FIFO 删除用户已经提升到 World 的资产。
5. 不把 B2B 改成固定价代制作服务；仍然是用户使用 FM 的自助产品，按可解释的生成事件计费。
