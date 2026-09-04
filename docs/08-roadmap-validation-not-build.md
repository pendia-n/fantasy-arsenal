# 08｜路线图、实验与不应建设项

## Phase 0｜先修基础，1–2 周

**目标**：不要在计费不可靠时放大生成量。

- 统一 cents/credits 的内部账本单位和命名。
- 把预留、实际结算、释放、技术退款做成同一状态机。
- 处理 `deductPrepaidBalance` 失败结果。
- 并发检查在扣费前执行，队列发送失败可释放预留。
- Stripe webhook 使用事件/checkout 幂等键。
- 修正媒体 ownership，并区分 Scratch/World 清理资格。
- 给现有 Scratch 加可见 72 小时 TTL；不影响旧用户已经购买的永久余额心智。

**退出条件**：故障注入下没有重复扣费、扣后不入队或技术失败仍收费。

## Phase 1｜World Beta，3–6 周

**首个核心工作流**：Character Passport → Preview → Final → Reuse。

只做：

- World、Character、Location、Object。
- Canon Fact、Relationship。
- Reference Set。
- Creative Contract。
- Text/MD + Image + 短视频 Preview/Final。
- H3 Max 作为快速 Preview 执行器；H3/其他模型作为 Final 或 fallback。
- Scratch 与 World 并行，旧 Story 作为 Legacy/Unassigned 可手动提升。

**暂缓**：歌曲、长 Drama、全量 11 模型迁移。它们先保留为旧 Scratch 入口，避免一次重写所有流水线。

**退出条件**：目标创作者真的重复引用 World，而不是只创建 World 看一眼。

## Phase 2｜连续性与信任，4–8 周

- Canon Diff 与逐条审批。
- Entity/Reference Set 版本时间线。
- Episode snapshot 与当前状态。
- Asset Passport Export。
- MCP 的 World/Contract 工具。
- 供应商切换仍保留相同 World ID 和输入状态。

**退出条件**：World 让用户减少重讲、减少盲目重试，且接受成本下降。

## Phase 3｜B2B Brand/Campaign，验证后再做

- Shared World、成员角色、审批人。
- Brand facts、禁用词、产品参考集。
- 生成队列、批量 Contract、成本/失败/接受率报告。
- 只做能解释 ROI 的团队功能；不把 B2C 页面强行塞进企业套装。

**B2B 购买理由**：少返工、少违反品牌事实、更快获得可审计的合格输出，而不是“FM 有 11 个模型”。

## Phase 4｜Live World Preview，实验而非主线

借鉴 Infinite Slop：在 World 当前时间点连续选择下一动作，用 H3 Max 生成快速片段。但每个片段默认只是 Preview；只有用户接受才进入 Episode/World。

观察它是否提高 World 回访与 Contract 转化，不要用观看时长替代交付价值。

## 5. 三个验证实验

### 实验 A：Scratch vs World Contract

同一批连载创作者，随机让一半先走 Scratch，一半先确认 Character/Contract。

比较：首次可接受率、到接受的时间、总调用成本、7 日复用、硬约束违反率。

### 实验 B：Preview 是否减少 Final 浪费

记录用户直接 Final 与先 Preview 再 Final 的两组：

- 每个最终接受资产的总成本。
- Final 重试次数。
- 从意图到接受的时间。
- 用户是否认为“先确认方向”值得付费。

### 实验 C：Canon 是否比参考包多创造价值

让同一项目分别使用：

1. 仅上传参考图片。
2. 结构化 Entity + Canon + Relationship + Contract。

若第二组不能降低违反事实和人工修正时间，不能把 Canon 当作护城河。

## 6. 产品指标与停机条件

### 保留

- 7 日同一 World 复用率 > 30%。
- 至少 25% accepted asset 在后续生成被引用。
- Contract 组首次可接受率相对 Scratch 提升 > 15%。
- 技术失败收费为 0。
- 每个 accepted Final 成本连续四周下降或稳定在可接受毛利内。

### 暂停或回退

- 新用户 70% 以上跳过 World，且重复用户也不回来。
- 用户只把 World 当素材文件夹，不确认事实/关系。
- Contract 增加时间却没有提升接受率。
- Preview 让总成本更高却没有减少 Final 重试。
- B2B 用户只想要固定包和人工代做，不愿自助使用。

## 7. 明确不做

1. **不自研基础视频模型**：把资本和风险投入到模型公司已经在做的层。
2. **不做 11 模型选择器**：模型是后台执行器；只有 Preview/Final/High control。
3. **不把 MCP 当产品**：MCP 是入口，World/Contract 才是能力。
4. **不做完整 Premiere/CapCut 克隆**：先验证连续性，不同时承担剪辑器复杂度。
5. **不做自动 Canon**：任何“AI 觉得是真的”都先是提案。
6. **不做只有文件夹的 World**：文件夹本身没有防御力。
7. **不强制用户建 World**：Scratch 是低摩擦入口和对照实验。
8. **不采用静默 1 小时删除**：Scratch 默认 72 小时，显示倒计时；World 资产不受 FIFO。
9. **不收重复下载税**：已接受 World 资产的常规下载应是产品承诺的一部分。
10. **不卖无限满意的固定视频包**：生成事件必须可量化、可预估、可结算。
11. **不把高流量直播实验当成已验证商业**：Infinite Slop 证明的是延迟带来的新体验，不是单位经济。

## 8. 交付顺序

```text
账本/ownership 修复
  → Scratch/World 分流
  → Character Passport
  → Contract + Preview
  → Canon Diff + Promote
  → Episode/Export/MCP
  → B2B Brand/Campaign
  → Live World experiment
```

如果 Phase 1 的用户行为不成立，就停止扩展对象类型和媒体格式，回到一个更轻的 Character/Contract 入口。
