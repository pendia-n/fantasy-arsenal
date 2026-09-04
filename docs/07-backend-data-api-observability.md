# 07｜后端、数据模型、API 与可观测性

这是一份目标架构建议，不是对现有仓库的修改指令。现有 D1/R2/Queue/OpenRouter/Stripe 可以保留，但要将领域边界从 `stories` 扩展为 World 与 Generation。

## 1. 目标领域模型

```text
User
 ├─ Wallet ─ LedgerEntry
 ├─ World
 │   ├─ Entity（Character / Location / Object）
 │   │   └─ EntityVersion
 │   ├─ CanonFact
 │   ├─ Relationship
 │   ├─ ReferenceSet → ReferenceAsset
 │   └─ Episode / WorldSnapshot
 ├─ ScratchJob
 └─ Generation
     ├─ CreativeContract
     ├─ ProviderAttempt
     └─ Artifact
```

Pets 是 `Entity(type=character, subtype=pet)`；tools 是 `Entity(type=object)`；scene 是 Generation/Artifact 的语义结果，不要为每一种 UI 选项都造一张独立表。

## 2. 表建议

### `worlds`

`id, user_id, name, genre, description, status, current_snapshot_id, created_at, updated_at`

### `entities`

`id, world_id, type, subtype, display_name, status, current_version_id, created_at, archived_at`

### `entity_versions`

`id, entity_id, version_no, structured_profile_json, created_by, source_generation_id, created_at`

### `canon_facts`

`id, world_id, subject_entity_id, predicate, object_value_json, scope_json, status, source_generation_id, approved_by, approved_at, supersedes_id`

状态只允许：`proposed / accepted / rejected / superseded`。`scope_json` 至少表达时间点、章节或分支。

### `relationships`

`id, world_id, from_entity_id, to_entity_id, label, state, scope_json, status, source_generation_id, approved_by, approved_at, supersedes_id`

关系必须有方向和时间范围，避免只存一行“朋友”。

### `reference_sets` / `reference_assets`

Reference Set 是当前可用于 Contract 的批准集合；Asset 记录 R2 key、mime、checksum、来源、许可、视觉标签和版本。未批准参考可以留在 Scratch 或 proposal 中。

### `creative_contracts`

`id, world_id, user_id, intent, entity_version_ids_json, hard_constraints_json, soft_preferences_json, output_spec_json, max_quote_minor, currency, policy_version, status, created_at`

Contract 状态：`draft / quoted / reserved / executing / preview_ready / final_ready / accepted / failed / cancelled`。

### `generations`

`id, contract_id, kind, idempotency_key, status, reserved_minor, actual_provider_minor, fm_fee_minor, storage_fee_minor, settled_minor, technical_result, accepted_at, created_at`

### `provider_attempts`

`id, generation_id, provider, model_family, request_id, input_spec_json, status, latency_ms, usage_json, error_code, created_at`

模型名可在后台记录和账单展开中出现，但不成为主流程的 UX 选择器。

### `artifacts`

`id, generation_id, world_id, artifact_type, r2_key, checksum, bytes, duration_ms, status, ownership_scope, expires_at, promoted_at`

World artifact 的 `expires_at` 应为空；Scratch artifact 设明确 72 小时默认 TTL，并允许用户 Promote 延长。

### `ledger_entries`

`id, wallet_id, generation_id, kind, amount_minor, currency, idempotency_key, reason, balance_after_minor, created_at`

禁止用 `credits_charged REAL` 作为全局账本。旧字段可以兼容读取，但新服务必须依赖 ledger。

## 3. API 建议

### World 与实体

```text
POST   /api/worlds
GET    /api/worlds
GET    /api/worlds/:worldId
POST   /api/worlds/:worldId/entities
PATCH  /api/entities/:entityId
GET    /api/entities/:entityId/versions
POST   /api/worlds/:worldId/references
```

### Canon 与关系

```text
GET    /api/worlds/:worldId/canon
POST   /api/worlds/:worldId/canon/proposals
POST   /api/canon/:factId/accept
POST   /api/canon/:factId/reject
GET    /api/worlds/:worldId/relationships
POST   /api/worlds/:worldId/relationships/proposals
```

### Contract 与生成

```text
POST   /api/worlds/:worldId/contracts/quote
POST   /api/worlds/:worldId/generations
GET    /api/generations/:generationId
POST   /api/generations/:generationId/cancel
POST   /api/generations/:generationId/accept
POST   /api/generations/:generationId/promote
GET    /api/generations/:generationId/diff
```

`POST /generations` 必须要求 `Idempotency-Key`，返回 `generation_id`、状态、`max_quote`、`reserved` 和预计等待，不直接返回一个模糊的“credits deducted”。

### Wallet

```text
GET    /api/wallet
GET    /api/wallet/ledger
POST   /api/wallet/topups/checkout
```

### MCP

先让 MCP 暴露真正的领域工具，而不是只给现有 `create_story` 改名：

```text
list_worlds
get_world_snapshot
create_entity
propose_canon_fact
quote_generation
create_generation
get_generation
accept_artifact
promote_to_world
get_wallet
```

MCP 也必须执行相同的 ownership、Contract、幂等和计费路径；UI 与 MCP 不得各自复制一份扣费逻辑。

## 4. 生成服务状态机

```text
draft
 → quoted
 → reserved
 → queued
 → executing
 → provider_succeeded
 → validated
 → preview_ready / final_ready
 → accepted
 → settled
```

任意阶段失败都必须可定位：`quote_failed`、`reserve_failed`、`queue_failed`、`provider_failed`、`validation_failed`、`ownership_failed`、`contract_violation`。

只有 `validated` 后才允许把实际 provider cost 写入 settlement；只有 `accepted` 后才把媒体列为用户接受资产；只有用户逐条确认后才写 Canon。

## 5. Ownership 与 R2

媒体下载流程必须沿着：

```text
authenticated user
 → generation/artifact
 → world or scratch owner
 → R2 key + checksum
```

不能只因为客户端知道 `r2_key` 就允许读取。删除必须由 artifact service 做引用检查：被 Reference Set 或 Canon 版本引用的对象不能被 FIFO 删除。

## 6. 队列与并发

建议的顺序：

1. 验证用户、World、实体版本和输入策略。
2. 计算最高估算。
3. 原子 reservation。
4. 创建带幂等键的 generation。
5. 发送 Queue；发送失败时原子释放 reservation。
6. Worker 处理 provider attempt，并以 generation 状态更新。
7. 做可用性与硬约束验证。
8. 结算、释放差额、发布 artifact。

并发检查必须在 reservation 前完成，或在同一个可重试事务/租约中完成；不能先扣后发现“最多 2 个任务”。

## 7. 可观测性

### 产品漏斗

- `world_created`
- `entity_confirmed`
- `contract_viewed`
- `quote_accepted`
- `preview_ready`
- `preview_accepted`
- `final_ready`
- `artifact_accepted`
- `canon_fact_promoted`
- `artifact_reused`

### 可靠性

- quote-to-queue 延迟。
- time-to-first-preview p50/p95。
- provider attempt latency、timeout、retry。
- 空文件/格式/数量/可播放性失败率。
- Contract 硬约束违反率。
- 技术失败退款率与金额。
- 队列丢失、重复执行、幂等命中率。

### 经济

- 预留金额、实际 provider cost、FM fee、释放金额。
- 每个 accepted artifact 总成本和毛利。
- Scratch 与 World 的平均重试次数。
- 存储成本 / 活跃 World。
- B2B 每个团队节省的人工返工时间。

## 8. 必须守住的账单不变量

```text
settled + released <= reserved
available + reserved = wallet ledger balance
technical_no_delivery => user charge = 0（或显式全额补偿）
same idempotency key => same generation and no double charge
accepted Canon fact requires approved_by and approved_at
World artifact is not eligible for Scratch FIFO
```
