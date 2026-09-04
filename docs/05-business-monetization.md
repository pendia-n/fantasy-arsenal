# 05｜商业模型与计费

## 1. 不是代制作服务

FM 不应承诺“你付固定价格，我替你做 10 个视频直到你满意”。这种模式把主观不满意、模型失败、返工次数和 FM 成本全部压到 FM 身上，结果可能是用户不满意、FM 亏损、双方都离开。

FM 应保持自助产品：用户在 FM 里自己输入意图、选 World、确认 Contract、先 Preview，再决定 Final；FM 收的是可解释的执行和工作流费用，不是无限满意承诺。

**BYOK 边界**：第一版继续由 FM 使用自己的 OpenRouter/provider 账户和服务条款承担生成调用，不要求用户提供自己的 API key。隐藏供应商是正确的界面选择，但购买理由必须来自 World/Canon/Contract/复用，而不是“FM 替你转发 API”。

## 2. 用户只看到一套语言

后台仍可用多个供应商，但界面只显示：

| 用户层级 | 表示 |
|---|---|
| 目标 | Preview / Final / High control |
| 钱 | 本次最高估算、实际结算、余额剩余 |
| 结果 | 可用 / 技术失败 / 待批准 |
| 资产 | Scratch / World / Canon proposal / Accepted |

不在主流程显示：11 个模型、provider 名称、quota、credits、随机路由、模型 A/B。高级账单页可以给出可读的成本明细，但不让模型复杂度污染创作决策。

## 3. 推荐收费结构

### B2C World Beta

- World、Canon 编辑、关系管理、Contract 草稿：免费或纳入最低平台费，用来提高复用而不是阻止用户整理资产。
- Preview：按此次输出规格和预计 provider 成本收取小额费用。
- Final：按输出时长、分辨率、参考素材与真实 provider usage.cost 结算。
- 下载/导出：World 内已付费生成的资产不再重复收“下载税”；真正的外部转码、超大导出或存储可单独说明。
- 余额：预付钱包，保持不强迫订阅；可在用户触发生成前充值。

### B2B Brand/Campaign，后置

- 共享钱包、成员和审批是平台功能，可有团队月费。
- 生成仍是可计费事件，不能被包装成“无限生成”。
- 团队可以看到成本、失败率、接受率、审批等待和资产复用，形成可量化 ROI。
- 先支持小型团队的自助购买，不一开始做企业销售、复杂 SSO 或人工代运营。

## 4. Reserve → Execute → Settle

### 生成前

```text
quote = provider_cost_upper_bound
      + orchestration_fee
      + storage_egress_fee
      + risk_buffer

原子检查：balance >= quote
原子 reservation：冻结 quote
创建 generation job（幂等键）
再发送队列
```

必须先做并发/权限/资产 ownership 检查，再创建或发送队列；不能扣完钱才发现并发超限。

### 生成后

1. 读取真实 provider usage.cost 和 provider request 状态。
2. 验证文件非空、格式、数量、可播放性和 Contract 硬约束。
3. 若输出技术可用，结算真实 provider 成本、声明的 FM 费用与必要存储费。
4. 释放最高估算和真实结算之间的差额。
5. 若技术失败或没有可用结果，释放 reservation；若已发生 provider 费用但 FM 没有交付可用结果，由 FM 承担或按明确政策退款，不能收用户一次不可用的“结果费”。

## 5. 退款边界

| 情况 | 处理 |
|---|---|
| provider timeout、空文件、格式错误、队列丢失 | 不收费或全额释放/退款 |
| Contract 的硬约束被系统确认严重违反 | 释放或补偿一次 Preview，不把它伪装成主观退款 |
| 文件可播放、规格正确，但用户不喜欢风格 | 不退款；鼓励修改 Contract 后用低成本 Preview |
| 用户自己改变主意 | 不退款，保留可用资产与账单记录 |
| 用户重复点击同一请求 | 幂等键返回同一 job，不重复计费 |

这同时保护用户和 FM：不因技术失败亏待用户，也不因无限主观返工让 FM 承担不可控成本。

## 6. 账本设计要求

所有钱都用最小货币单位整数记录，所有 generation 有唯一 `generation_id`：

```text
wallet_credit
wallet_reserve
provider_actual_cost
fm_orchestration_fee
storage_fee
settlement_release
technical_refund
stripe_topup
```

每次变动都要有 `idempotency_key`、`reason`、`currency`、`source`、`created_at`，并且 reservation、settlement、release 具备可重放的状态机。

## 7. 用户层价格显示

生成按钮不写“扣 160 credits”或“Model B $74”，而写：

```text
Preview · 预计最高 $0.18
预计 3–6 秒 · 余额足够
可随时取消排队；完成后按实际成本结算
```

Final 在用户确认前显示：

```text
Final · 最高 $1.20
必须保留：Lamo 的银色左眼、与 Hel 的敌对关系
允许变化：天气、镜头、服装细节
技术无可用结果：不收费
```

## 8. 单位经济指标

每周应分开看：

- Preview 到批准的转化率。
- 每个最终接受资产的总 provider 成本。
- 每个接受资产的 FM 毛利。
- 技术失败率和失败退款额。
- Contract 硬约束违反率。
- 同一 World 的 7/30 日复用率。
- 存储与下载成本 / 活跃 World。
- B2B 返工节省时间与审批等待时间。

如果接受成本不下降，不能靠提高固定价格解决，因为这会直接放大“不值得用 FM”的判断。
