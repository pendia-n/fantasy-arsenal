# 06｜产品信息架构与 UI/UX

## 1. 产品语言

### 顶层导航

```text
Worlds     Scratch     Activity     Wallet     Settings
```

桌面端左侧固定导航，移动端变成底部四项导航：`Worlds / Scratch / Activity / Wallet`，Settings 放在头像菜单内。

### 词汇替换

| 不再作为主词 | 用户看到 |
|---|---|
| Story | World 中的 Episode，或 Scratch 结果 |
| New Story | Create |
| Remix | Make another form / Reuse this |
| Quake | Try a new direction |
| Credits / quota / Model A/B | Wallet、最高估算、实际结算 |
| Save to World boolean | Create in World / Promote to World |
| Model selector | Preview / Final / High control |

## 2. 首次进入

### 新用户 onboarding

只问三个问题：

1. “你现在要继续一个世界，还是先试一个想法？”按钮：`Create a World`、`Try Scratch`。
2. 若创建 World：名称、genre/气质、第一位角色的名字。
3. 第一次生成前只要求确认 3–5 条硬事实，不做完整世界观问卷。

文案要直接说明：

> “World 会保留你确认的事实和参考资产。AI 提出的新设定不会自动成为 Canon。”

### 空 World 状态

不要显示“这里什么都没有”。显示一个小型 Fountain：

```text
LAMO HEL
一个还没有被写死的神秘世界

[建立第一位角色] [从 Scratch 提升一个结果]
```

## 3. 主要页面规范

### A. Worlds 首页

**桌面版**：左侧导航；顶部是 `Your worlds`，右侧一个 `Create`。每个 World 行显示标题、genre、最近活动、实体数量、最近一次“接受的变化”，不显示模型名。

**移动版**：顶部标题与加号按钮；World 卡片垂直排列；每张卡片只有一个主动作 `Open world`，避免三个并列 CTA。

**空状态 CTA**：`Create a World` 和低强调的 `Try Scratch`。

### B. World Dashboard

**桌面版三栏**：

```text
┌──────────────┬──────────────────────────┬────────────────┐
│ World rail   │ Fountain / recent canon  │ Context rail   │
│ Characters   │ accepted episode        │ current time   │
│ Locations    │ preview → final         │ facts locked   │
│ Objects      │ proposals to review     │ cost estimate  │
└──────────────┴──────────────────────────┴────────────────┘
```

- 左栏：`Characters / Locations / Objects / Canon / Episodes`。
- 中栏：按时间倒序的接受结果和待审提案；每项显示“使用了谁/哪一版”。
- 右栏：当前 World snapshot、活跃关系、待确认事实、余额与 `Create in this world`。

**移动版**：顶部 World 标题和 `Create`；随后是 `Needs review` 横向单项区域，再是 `Recent fountain`；左侧实体导航改成水平滚动 tabs。World snapshot 用抽屉打开，不常驻占用屏幕。

### C. Character Detail / Passport

**桌面版**：角色头像、身份摘要、事实时间线、关系、Reference Set、最近使用的 Contract。主动作 `Use in a creation`，次动作 `Edit facts`。

**移动版**：头像 + 名称 + `Use` 固定在顶部；Facts、Relationships、References 变成折叠段；每次版本变化显示“由哪次生成提出、谁确认”。

核心不是“生成头像”，而是让用户能回答：

- 这是哪一个角色？
- 哪些是硬事实？
- 当前处于什么状态？
- 哪些图/声音是批准参考？
- 我能否回到旧版本？

### D. Create / Creative Contract

**桌面版左侧输入、右侧 Contract rail**：

```text
左：一句话意图 + 选择实体 + 目标情绪/动作
右：必须保留 / 允许变化 / 当前关系 / 最高估算
下：Preview、Final、High control
```

用户输入自然语言，实体选择只做补充。不要让用户填写模型、token、内部队列字段。

必有字段：

- `intent`：这次想让观众看到什么。
- `entity_versions`：使用哪个角色/地点/物件版本。
- `hard_constraints`：不能变的事实。
- `soft_preferences`：可以由执行器调整的偏好。
- `output_spec`：媒体类型、时长、比例、分辨率。
- `max_estimate`：最高可扣金额。

**移动版**：分三段折叠：`Intent`、`World context`、`Price & control`；底部 sticky CTA 是 `Preview · $X max`。点击后先展开 Contract 摘要，不跳转支付页面。

### E. Preview / Compare / Approval

**桌面版**：左边结果预览，右边是 Contract diff：

```text
保留：Lamo 的银色左眼        ✓
保留：与 Hel 敌对             ✓
提议新增：Hel 住在潮汐塔       review
冲突：Lamo 的年龄              fix

[Accept as media] [Promote facts] [Try another Preview]
```

`Accept as media` 不等于确认所有事实。只有 `Promote facts` 才写入 Canon。

**移动版**：先全屏结果，再上拉打开 Contract diff；底部三个动作固定为 `Accept`、`Review facts`、`Try again`。不把 `Try again` 写成“无理由重试”。

### F. Wallet / Activity

**桌面版**：余额、预留中、实际结算、技术退款、最近生成事件。默认用美元金额和人类可读说明；可展开查看 provider cost、FM fee、storage fee。

**移动版**：顶部只显示 `Available / Reserved`；账单按事件显示“Preview 5 秒、实际 $0.14、释放 $0.04”。

不要再让 B2C 和 B2B 进入两个割裂的充值世界。B2B 后续可在同一 Wallet 加团队成员、审批和月度摘要。

## 4. 两条主流程

### World 流程

```text
Worlds → Open World → Create
→ 选择/创建角色 → 确认事实
→ Reference Set → Contract
→ Preview → Accept direction
→ Final → Accept media
→ Review proposals → Promote selected facts
```

### Scratch 流程

```text
Scratch → 一句意图 → Preview/Final
→ 结果保留 72 小时
→ Download / Try again / Promote to World
```

Scratch 不应被隐藏，因为它是比较 World 摩擦和真实留存的对照组。

## 5. 视觉方向

### Fountain Room

- **背景**：深墨蓝 `#0b1719`，让用户感觉进入一个工作室，而不是广告页面。
- **主色**：矿物青 `#61d7c1`，只标识可继续、已确认和流动的状态。
- **行动色**：烧铜橙 `#e2a15f`，用于 Preview/Final 成本和待用户决定的提案。
- **文字**：雾白 `#e5eee9`；次级文字 `#92a9a3`。
- **显示字体**：`Fraunces` 仅用于 World 名称和关键宣言。
- **正文/界面字体**：`Space Grotesk`，清晰但不落入默认 SaaS 风格。

Signature 是一条从输入、Contract、Preview、Final 到 Canon 的细竖线，接受的资产会在这条 Fountain 上留下节点。不要用满屏渐变、AI 机器人或模型徽章抢走用户注意力。

## 6. 文案原则

- “Lock the facts that cannot change.” → “锁定不能改变的事实”。
- “Promote to Canon” → “确认进入世界事实”。
- “Technical failure: no charge.” → “没有可用结果：不收费”。
- “Subjective dislike” 不要出现在主 CTA；放在费用说明里，写清“可继续用 Preview 调整方向”。
- 空状态必须带下一步，错误必须说明如何恢复。
