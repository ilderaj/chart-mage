# Cloudflare Pages 对外部署迁移任务

## Goal
- 将 ChartMage 的对外部署目标从历史 `github_page` 分支模式切换为 Cloudflare Pages Git 集成。
- 达成目标状态：当变更合并并推送到 `origin/main` 后，生产站点自动更新；PR / 非生产分支自动生成 preview 部署；站点可通过 `*.pages.dev` 或自有域名访问。

## Current State
Status: blocked
Archive Eligible: no
Close Reason: Production is live on Cloudflare Pages via a direct-upload fallback, but the original target state is only partially complete. Git integration / automatic previews remain blocked by the Cloudflare Pages GitHub installation issue (`8000011`), and Cloudflare direct-upload projects cannot be converted in place to Git integration later.

## Current Phase
Phase 6

## Companion Plan
- Path: `docs/superpowers/plans/2026-04-29-cloudflare-pages-deployment.md`
- Summary: 采用 Cloudflare Pages Git integration 直接连接 `ilderaj/chart-mage`，生产分支使用 `main`，预览部署覆盖 PR / 非生产分支；仓库侧优先收敛到“可直接托管的静态产物约定”，不再依赖 `github_page` 发布分支。
- Follow-up path: `docs/superpowers/plans/2026-04-29-cloudflare-pages-convergence.md`
- Follow-up summary: 核验 direct-upload fallback 后的真实完成度，并规划仓库收敛、manual redeploy 自动化、Git-integrated project 重建、preview 验证、自有域名切换和旧资源清理。
- Sync-back status: synced on 2026-04-29 after deployment review

## Phases
1. 盘点当前仓库发布结构、上游历史发布方式和 Cloudflare Pages 能力边界（已完成）
2. 形成仓库侧发布契约与实施计划（已完成）
3. 执行仓库侧改动：补部署元信息、文档和必要配置（待执行）
4. 在 Cloudflare 中创建 Pages 项目并连接 GitHub 仓库（待执行）
5. 配置 production / preview 分支行为与 `pages.dev` 域名（待执行）
6. 绑定自有域名并完成上线验证、回滚说明和运维约定（待执行）
7. direct-upload fallback 后的仓库与 Cloudflare 收敛计划（已完成计划，待执行）

## Risk Assessment

| 风险 | 触发条件 | 影响范围 | 缓解 / 回退方案 |
|---|---|---|---|
| 继续依赖历史 `github_page` 分支 | 发布逻辑仍建立在手工同步分支上 | 生产更新路径混乱、容易漏发 | 明确以 Cloudflare Pages + `main` 为唯一生产发布入口，`github_page` 只作为历史参考 |
| 直接把旧 Gulp 构建接到 Cloudflare Pages | 构建镜像 Node 版本变化或老依赖不兼容 | 首次上线或后续自动部署失败 | 首阶段优先以静态目录直发为主，减少对老旧构建链的耦合；若后续需要压缩构建，再单独升级构建链 |
| 本地 `git push` HTTPS 存在 LibreSSL `SSL_ERROR_SYSCALL` | 开发机网络 / TLS 栈异常 | 仓库配置提交无法推到 GitHub，进而无法触发 Pages 自动部署 | 将该问题单独记录为外部阻塞项；必要时切换 SSH remote 或改用其他网络环境完成首次推送 |
| 自有域名接入方式选择错误 | apex / subdomain 场景未区分 | 域名解析失败或证书签发卡住 | 优先用 `pages.dev` 完成验证，再分流到 apex 或 subdomain 的独立域名接入步骤 |
| Preview 部署默认公开 | Pages preview 未启用 Access 保护 | PR 预览链接可被外部访问 | 默认先接受公开 preview，若进入私有协作阶段再追加 Access 策略 |
| 项目内 `.worktrees/` 未被忽略 | 创建 project-local worktree 前缺少 ignore 保护 | worktree 内容可能污染仓库状态 | 先把 `.worktrees/` 写入 `.gitignore`，再创建隔离工作区 |
| direct-upload 项目无法原地切换到 Git integration | 当前 `chart-mage` 项目是 direct upload fallback | main 自动发布和 PR preview 不能在该项目上补齐 | GitHub 安装修复后新建 Git-integrated Pages 项目，验证后再切换域名 / 生产入口 |
| 部署仓库文件还停留在 `cloudflare-pages-deploy` 分支 | `app/_headers`、部署 README、runbook、脚本变更未合入当前 `main` | 当前 `main` 不能完整代表线上部署约定 | 先 cherry-pick / restore 非 planning 文件到 `main`，保留当前 planning 文件更新 |

## Key Questions
1. 首次上线是否应直接发布 `app/`，而不是继续依赖旧的 `dist/` 构建链？
2. 生产站点是否只需要一个稳定的 `pages.dev` 地址，还是首期就必须绑定自有域名？
3. `dev` 分支是否需要稳定 branch alias 作为长期测试入口？

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 生产发布入口切换为 Cloudflare Pages Git integration | 该模式天然支持 push-to-main 自动生产部署与 PR preview，符合目标状态 |
| `main` 作为 Production branch | 仓库默认分支已切到 `main`，与后续团队协作和 Cloudflare 生产环境定义一致 |
| 首阶段优先直接托管静态目录，而不是把 Cloudflare 生产绑定到旧 Gulp 构建 | 当前应用是纯静态站点，直接托管可降低构建不兼容风险，先完成稳定上线再决定是否恢复构建优化 |
| 保留自有域名为第二步，先用 `pages.dev` 验证 | 先缩短上线路径，避免把 DNS / 证书问题和应用托管问题绑在一起 |
| 继续保留 `dev` 分支，并让其由 Pages 生成 preview / branch alias | 这能提供稳定的非生产对外地址，适合后续联调和验收 |
| 本次执行采用项目内 `.worktrees/` 作为隔离工作区目录 | 用户已明确选择 project-local hidden directory，符合 worktree 技能推荐路径 |
| 当 Git integration 创建失败时，先以 direct upload fallback 让站点上线 | 用户明确选择“先用 direct upload 部署到 Pages，让站点先可用”，优先满足“能够开始使用”的目标 |
| 生产 Pages 项目名固定为 `chart-mage`，生产 URL 为 `https://chart-mage.pages.dev` | 该项目已成功创建并完成首个 production deployment，后续文档与运维都以此为准 |
| direct-upload fallback 不再被视作最终形态 | Cloudflare 文档确认 Direct Upload 项目不能切换成 Git integration；最终自动发布需要新建 Git-integrated project |
| 仓库收敛必须先于 Git 集成重试 | 当前 `main` 缺少部署文件，Cloudflare 后续从 Git 构建必须以 main 上的真实发布契约为准 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `fatal: unable to access 'https://github.com/ilderaj/chart-mage.git/': LibreSSL SSL_connect: SSL_ERROR_SYSCALL` | 1 | 目前仅记录为外部 Git 网络阻塞；不影响本次规划产出，但会影响后续首次推送与自动部署验证 |
| `.worktrees/` 当前未被 Git ignore | 1 | 已在执行开始阶段补充 `.gitignore` 保护，后续再创建 worktree |
| Cloudflare Pages API 创建 Git-integrated project 返回 `8000011` | 1 | 已确认普通 Pages API 与 direct-upload project 创建正常，根因定位为 Cloudflare Pages GitHub 安装状态异常；当前改走 direct-upload fallback，上线后等待外部修复 |
| 系统 Python 受 PEP 668 限制，无法直接 `pip install blake3` | 1 | 已改用 session 私有 virtualenv 安装 `blake3`，完成 Pages asset hash / upload 流程 |

## Completion Review 2026-04-29
| Area | Plan Target | Actual State | Verdict |
|------|-------------|--------------|---------|
| Production availability | Cloudflare Pages production URL accessible | `https://chart-mage.pages.dev/` returns `200`; deployment `010f65fe` is `success` | complete via fallback |
| Main auto-deploy | Push / merge to `origin/main` updates production | Current deployment trigger is `ad_hoc`; Git integration failed with `8000011` | incomplete / blocked |
| PR and branch preview | PR / non-production branches get preview deployments | Direct-upload project has no Git source previews | incomplete / blocked |
| Repository deploy contract | `main` contains scripts, `_headers`, README and runbook | These files exist on `cloudflare-pages-deploy`, but not current `main` | incomplete |
| Custom domain | `pages.dev` or custom domain usable externally | `pages.dev` is live; custom domain not yet selected or attached | partial |
| Runbook | Operators know current deploy mode and next recovery path | Runbook exists on `cloudflare-pages-deploy`, not current `main` | partial |
