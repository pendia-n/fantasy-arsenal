# 01｜当前状态：代码事实地图

本文件只记录现有仓库中可以定位的行为；目标方案在其他文件中单独标记为建议。

## 1. 技术栈与请求链

代码呈现的是：

```text
Vite + React
  → Cloudflare Worker + Hono
  → D1（users / transactions / stories / versions / media / logs）
  → R2（媒体对象）
  → Queue（异步故事流水线）
  → OpenRouter（文本、图片、歌曲、视频调用）
  → Stripe（充值与 B2B 余额）
```

关键证据：[`worker/env.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/env.ts) 声明 `DB`、`R2`、`STORY_QUEUE` 和 `OPENROUTER_API_KEY`；[`worker/lib/openrouter.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/lib/openrouter.ts) 以 OpenRouter API 为调用入口；[`worker/routes/stories-pipeline.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories-pipeline.ts) 消费生成任务并写入 D1/R2。

## 2. 前端信息架构

当前主要路由在 [`src/App.tsx`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/src/App.tsx#L59)：

| 当前页面 | 代码事实 | 战略含义 |
|---|---|---|
| Home | 文案主张 Stories、Songs、Videos，见 [`Home.tsx`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/src/pages/Home.tsx#L56-L75) | 首页卖的是输出格式，不是持续创作结果 |
| Dashboard | 页面标题是 `My Stories`，请求故事、余额、B2B 状态和失败提示，见 [`Dashboard.tsx`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/src/pages/Dashboard.tsx#L25-L47) | 顶层对象是 Story，不是 World |
| New Story | 多步选择标题、输入、输出、时长、风格、上下文，见 [`NewStory.tsx`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/src/pages/NewStory.tsx#L63-L74) | 用户被引导选择生成参数，而不是先确认创作事实 |
| Story | 现有单个故事详情和 remix/quake 能力 | 复用主要发生在旧文本/输出之间 |
| Credits / Balance | B2C credits 与 B2B balance 分开 | 同一套生成事件存在两种计价语言 |
| Settings / Auth | JWT、登录、注册、TOTP 相关页面与 Worker 路由 | 可继续复用身份层，但 World 资产必须加更严格的所有权边界 |

## 3. 当前生成请求

[`NewStory.tsx`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/src/pages/NewStory.tsx#L235-L263) 最终构建 `title`、`rawInput`、`duration`、`type`、`outputs: [output]`，可选加入 `contextVersionIds`，再 POST `/api/story/create`。

后端 [`stories.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories.ts#L19-L43) 读取这些字段，并用 `body.outputs[0]` 决定成本和主要输出。即使 API schema 接受数组，当前前端与大部分计费路径仍以第一个输出为中心。

### 当前存在的复用

- `contextVersionIds` 可从历史 `script_versions` 读取文字上下文，见 [`stories.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories.ts#L93-L124)。
- `remix` 从已有故事的 `latest_paraphrase` 取目标区段，见 [`stories-pipeline.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories-pipeline.ts#L327-L384)。
- Drama 流程会生成角色图并在多个 clip 中复用，见 [`stories-pipeline.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories-pipeline.ts#L150-L180)。

这些是有价值的基础，但还不是结构化的跨任务 Canon：没有 Character ID、事实状态、关系变化或用户确认记录。

## 4. 当前数据模型与存储

[`001_init.sql`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/migrations/001_init.sql) 的顶层表为：

| 表 | 现有字段关注点 | 缺失 |
|---|---|---|
| `users` | 身份、credit_balance | World/团队成员/钱包账本 |
| `transactions` | Stripe session、购买金额、状态 | 原子 reservation、settlement、refund ledger |
| `stories` | raw_input、选择的时长/类型、latest_paraphrase、status、credits_charged | World、Contract、实体、时间线 |
| `script_versions` | story_id、version、type、raw_text、styled_prompt | 结构化 Canon、来源与提案状态 |
| `media` | story_id、script_version_id、format、r2_key、size | asset ownership、reference set、expiry、promotion |
| `pipeline_logs` | story_id、step、message | provider request、latency、cost、contract check |
| `chat_messages` | story_id、role、message | 世界级对话上下文与批准事件 |

当前不存在 `worlds`、`characters`、`locations`、`objects`、`canon_facts`、`relationships`、`references`、`generation_contracts` 或 `expires_at`。

## 5. 媒体流水线

[`stories-pipeline.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories-pipeline.ts#L240-L325) 的新故事流程大致是：

1. 写入 `paraphrasing` 状态。
2. 用 `paraphraseAll4` 生成 script/play/lyrics/drama 区段。
3. 写入 `latest_paraphrase`。
4. 根据 `outputs` 依次生成 MD、Song 或 Drama。
5. 将结果上传 R2，并在 `media` 建行。
6. 结束后调用清理逻辑。

Drama 是多步骤流水线：角色图、场景图、每场一个 clip，最终保存多个 `media` 行；场景临时图会删除，但角色图会保留到故事版本下，见 [`stories-pipeline.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories-pipeline.ts#L150-L237)。

## 6. 当前保留策略

[`worker/lib/credits.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/lib/credits.ts#L346-L360) 按账户类型和格式做数量 FIFO：B2C 为 MD 26、Song 19、Drama 10；Model A/B 有更高数量上限。它不是 1 小时 TTL。

媒体服务中的 `Cache-Control: private, max-age=3600` 是 HTTP 缓存时间，见 [`worker/index.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/index.ts#L25-L67)，不代表 D1/R2 对象一小时后自动删除。

**建议含义**：Scratch 可有 24–72 小时的可见 TTL；已提升到 World 的资产永不被普通 FIFO 清理。不能把当前 `max-age` 直接当成产品保留政策。

## 7. 当前计费与权限事实

### B2C

- [`credits.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/lib/credits.ts#L3-L31) 定义文本、媒体、remix、quake、下载的 credits 成本。
- `/api/story/create` 先检查余额，再插入 story，随后扣 credits，见 [`stories.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories.ts#L71-L91)。
- 生成失败时流水线会调用 refund 逻辑，见 [`stories-pipeline.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories-pipeline.ts#L473-L488)。

### B2B

- [`006_add_b2b.sql`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/migrations/006_add_b2b.sql#L24-L38) 把 B2B 标志、model、tier、quota 与 `prepaid_balance_usd` 加到 `users`。
- 前端会先请求 B2B status 并按 Model A/B 做预检查，见 [`NewStory.tsx`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/src/pages/NewStory.tsx#L177-L232)。
- Worker 使用 `getMaxB2BCost` 和 `deductPrepaidBalance`，见 [`stories.ts`](/Users/nosensetxt/mvp/fable-maker/mattalk-agentic/worker/routes/stories.ts#L45-L70)。

当前产品因此同时存在 B2C credits、Model A quota、Model B prepaid dollars、下载费等语言；用户很难形成一个“这次生成最多会扣多少、最终实际扣多少”的稳定心智模型。

## 8. 当前代码风险，按战略优先级排序

| 优先级 | 代码事实 | 风险 |
|---|---|---|
| P0 | B2B 余额扣除、队列发送、并发检查在多个路径中分散 | 可能出现扣钱后不入队、并发超限或余额状态不一致 |
| P0 | B2C credits 与 B2B USD cents 由不同函数处理，失败 refund 在同一流水线汇合 | 单位混用会造成错误退款或错误扣费，必须统一 ledger 单位 |
| P0 | `deductPrepaidBalance` 的结果在调用处没有作为成功条件处理 | 更新失败不能被当作已扣成功或已开始生成 |
| P1 | `media` 主要按 `story_id` 拥有，`/media/*` 服务层要再核对 URL 所属 | 迁移 World 后不能沿用弱 ownership 检查 |
| P1 | FIFO 删除 R2 后再删 D1 行，且版本/媒体之间有级联关系 | 任何 World 资产复用都不能放入普通 FIFO |
| P1 | MCP 暴露 create/remix/quake/get/list/buy，但仍围绕 story 与 outputs | 只把现有工具换名为 World 不会产生真正的 MCP 价值 |
| P2 | 产品文案强调 outputs 与模型体验 | 继续吸引一次性试用者，无法验证长期复用价值 |

## 9. 代码到产品的迁移判断

可以复用：React 路由与认证、Hono Worker、D1、R2、Queue、OpenRouter 适配、Stripe checkout、现有媒体生成器。

需要重构边界：

- `Story` 从顶层产品对象降为 `Generation` 的历史容器或兼容层。
- 新增 World/Entity/Canon/Contract/Generation/Wallet 数据域。
- 把“是否保存到 World”从布尔值升级为显式 World context 与 Promote 流程。
- 把供应商调用和计费从各个 route 的散落逻辑收拢为一个有幂等键的 generation service。
- 先修复账本、队列和 ownership，再放大 World Beta。
