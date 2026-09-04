# 03｜结构化脑暴与产品候选

本轮脑暴使用三个明确的父概念交叉，而不是从“AI 创作”自由联想：

| 父概念 | 核心 DNA |
|---|---|
| 当前 FM Tap | 一次 Prompt、异步队列、多媒体输出、OpenRouter 编排、可 remix/quake |
| World/Canon Fountain | 持久实体、批准事实、关系/状态、引用版本、生成前 Contract |
| H3 Max / Infinite Slop | 低延迟短视频、连续片段、观众/用户即时决定下一步 |

## 候选概念

### 1. Canon Preview Loop（首选）

**组合谱系**：Tap 的低摩擦 + Fountain 的 Contract + H3 Max 的低延迟。

用户先选角色、地点和目标情绪，系统用快速执行器生成 5 秒 Preview，同时列出将要遵守的 Canon。满意后才进入 Final；不满意时调整 Contract 或意图，而不是直接重复烧高价视频。

**价值**：把“生成前确认”变成有感知的产品体验，并降低盲目 Final 重试。

**风险**：Preview 也会产生实际成本；必须显示最高估算并记录接受成本。

### 2. Character Passport（首个付费工作流）

**组合谱系**：当前 Drama 的角色图复用 + Entity/Reference Set + 用户所有权。

用户创建一个角色，确认姓名、年龄、外观硬事实、关系和允许变化，再生成视觉参考。之后每个场景都从 Passport 选择，而不是重新描述角色。

**价值**：最容易让连载创作者感受到“我的角色被保存了”。

**风险**：如果只是人物图片库，会被普通 reference wrapper 复制；必须包含状态、版本、来源和 Contract。

### 3. Canon Diff（必须进入 MVP）

**组合谱系**：版本历史 + LLM 提议 + 用户审批。

每次生成后显示：“输出提出了 2 个新事实，修改了 1 个状态，与 Canon 的 1 条规则冲突。”用户可以逐条接受、拒绝或保留为本次媒体事实。

**价值**：把 AI 的不可靠猜测变成可管理的提案，而不是污染世界。

### 4. Episode Fountain

**组合谱系**：连载创作 + 章节级状态 + 可提升资产。

每一集拥有输入 Contract、使用的实体版本、接受的场景和对 World 的影响。下一集预填当前状态，但允许回到过去的时间点生成“平行分支”。

**价值**：让复用和留存自然绑定到用户真实发布节奏。

### 5. Asset Passport Export

**组合谱系**：用户所有权 + provider portability + 版本来源。

把角色的结构化事实、批准参考图、提示编译结果和使用许可导出为一个可读包，而不是把用户锁在 FM 内。

**价值**：反直觉地增强信任和长期沉淀；也可用于迁移或团队交接。

### 6. Live World Preview（后置实验）

**组合谱系**：Infinite Slop 的即时分支 + World 的当前状态。

用户在一个 World 时间点连续决定下一动作，H3 Max 快速生成片段；确认后才回写 Episode/Canon。

**价值**：可能成为高参与度入口。

**限制**：直播连续性不等于高质量连载资产；不应取代审批与正式发布。

### 7. Brand Campaign Contract（B2B 后置）

**组合谱系**：Character Passport/Canon + B2B 品牌资产 + 审批队列。

品牌团队定义不可变产品事实、语气、禁用词、Logo/包装参考和批准人；每个生成事件输出合同、成本和合规结果。

**价值**：把 B2B 价值放在可重复生产和风险降低，而不是代客户“无限试到满意”。

## 取舍

### 现在做

1. Character Passport。
2. Canon Diff 与人工批准。
3. Creative Contract + Preview/Final 两段式结算。
4. World Dashboard + Scratch 并行。

### 之后做

1. Episode Fountain 与时间线。
2. Asset Passport Export。
3. B2B Brand Campaign Contract。
4. Live World Preview。

### 不做成核心

1. 自研视频模型。
2. 11 模型选择器。
3. 完整非线性视频编辑器。
4. 自动世界模拟器。
5. 只有文件夹和标签的“世界资料库”。
