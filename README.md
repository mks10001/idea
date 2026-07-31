# Idea-to-Funding 平台（MVP）

## 项目简介

这是一个把“从想法筹钱到落地到融资”流程落地的平台。核心理念：用户可以在平台发布经过审核的 idea，平台给发布者发放“网站币”（内部代币）；投资者可以购买网站币并与 idea 发布者进行兑换（线上撮合或线下结算），平台承担托管/结算与争议处理功能。

本 README 面向快速启动的 MVP，包含功能列表、技术栈、简要数据模型、关键 API 与下一步实施计划。

---

## MVP 优先级（最小可行产品）

1. 用户注册/登录（邮箱验证）
2. 简易 KYC（在兑换/提现前需完成）
3. 发布 idea 表单（标题、描述、附件、目标金额、回报模型）
4. 管理员审核流程（待审核 -> 通过/拒绝）
5. 审核通过后给发布者发放网站币（内部账本记账）
6. 投资者购买网站币（Stripe 集成，支付成功后增加余额）
7. 投资撮合：投资者对 idea 出价（使用网站币或法币），管理员/双方确认后完成结算或进入托管
8. 基本纠纷/仲裁流程（管理员介入）

---

## 技术选型（推荐用于快速迭代）

- 前端：Next.js + TypeScript
- 后端：Node.js + NestJS 或 Express + TypeScript
- 数据库：PostgreSQL
- ORM：Prisma（或 TypeORM）
- 缓存/队列：Redis（余额锁、任务队列）
- 支付：Stripe（Checkout / Payment Intents / Webhooks）
- KYC：第三方服务（Onfido / Sumsub）或先做轻量上传方案
- 部署：Vercel（前端） + Cloud Run / Heroku（后端）

---

## 简要数据模型（关键表）

- users
  - id, email, password_hash, name, role, kyc_status, created_at
- profiles
  - user_id, bio, contact, attachments
- ideas
  - id, author_id, title, description, attachments, status (draft/pending/approved/rejected), target_amount, created_at
- idea_reviews
  - id, idea_id, admin_id, decision, comment, created_at
- wallets
  - id, user_id, currency_type ('SITE_TOKEN','USD'), balance
- token_transactions
  - id, from_user_id, to_user_id, amount, type ('ISSUE','PURCHASE','TRANSFER','REWARD','BURN'), status, meta, created_at
- offers
  - id, idea_id, investor_id, offered_tokens, offered_fiat, status (pending/accepted/declined/escrowed/completed), created_at
- escrows
  - id, offer_id, status, stripe_payment_intent, locked_until, created_at
- audits
  - id, entity_type, entity_id, action, actor_id, payload, created_at

---

## 关键 API 草案

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-email
- GET /api/ideas
- POST /api/ideas
- GET /api/ideas/:id
- POST /api/ideas/:id/submit-for-review
- GET /api/admin/ideas/pending
- POST /api/admin/ideas/:id/review
- GET /api/wallet
- POST /api/wallet/buy  (创建 Stripe checkout)
- POST /api/webhook/stripe
- POST /api/ideas/:id/offers
- POST /api/offers/:id/accept
- POST /api/escrow/:id/complete

---

## 安全与合规要点

- 法律风险：代币（网站币）可能被视为货币或证券，不同地区有不同监管，务必咨询法律顾问。MVP 建议内部代币账本并在条款中明确用途。
- KYC/AML：兑换法币时强制 KYC；对高额交易做额外审核。
- 支付安全：使用 Stripe 等成熟方案，避免直接处理卡信息。
- 风控：限制短期内大量注册+领取奖励，设计发币阈值和锁定期（vesting）。
- 资金隔离：建议把用户资金与平台运营资金隔离，使用受监管的托管账户或支付服务。

---

## 开发与运行（本地快速启动建议）

1. 安装依赖（示例后端）
   - Node >= 16, pnpm/npm/yarn
   - PostgreSQL
2. 本地运行（后端）
   - 配置 .env（DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY 等）
   - prisma migrate dev --name init
   - npm run dev
3. 前端（Next.js）
   - npm run dev

（后续我可以在 repo 中 scaffold 后端/前端代码与 Prisma schema）

---

## 初始里程碑（建议）

1. 初始化仓库 & README（已完成）
2. 设计并提交 Prisma schema + SQL migration
3. 后端 scaffold：认证、Idea CRUD、Admin 审核接口、钱包与 token 账本、Stripe 集成（checkout + webhook）
4. 前端 scaffold：注册/登录、发布 idea、idea 列表与详情、钱包页面
5. 上线测试：KYC、纠纷流程、风控规则

---

## 下一步（我将按你要求逐步执行）

我会按序完成下面任务：
1. 在仓库添加 README（已完成）。
2. 添加 Prisma schema（prisma/schema.prisma）与初始 migration（下一步）。
3. 在后端 scaffold 认证与 idea CRUD 接口。
4. 集成 Stripe 基本购买流程与 webhook 处理。
5. 添加前端最小页面用于交互与测试。

现在我已经把 README.md 提交到仓库。接下来我将创建 prisma/schema.prisma 并提交初始 migration文件（如果你同意我就继续）。
