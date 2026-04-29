# Findings

## Requirements
- 将本项目的对外部署与发布目标切换到 Cloudflare Pages。
- 目标行为是：向 `origin/main` 合并 / 推送后，生产环境自动更新到最新版本。
- 需要保留对 PR / 非生产分支预览访问的能力。
- 站点需要能够使用 Cloudflare 免费二级域名，也需要为未来绑定自有域名预留方案。
- 需要把任务以 `planning/active/<task-id>/` 的形式持续追踪，并输出一份可执行实现计划。

## Research Findings
- `ilderaj/chart-mage` 是 `heyjunlin/chart-mage` 的 fork；默认分支已切到 `main`，本地也已同步 `origin/HEAD -> main`。
- 上游历史上存在 `github_page` 分支，内容是一套独立静态站点资源（`index.html`、`CNAME`、CSS、JS、图片），可以视作旧的对外发布分支。
- 当前仓库主应用是纯静态 Web 站点，主入口在 `app/index.html`，落地页在 `app/intro.html`，资源路径均为相对路径，具备直接静态托管特征。
- 仓库中仍保留旧的 Gulp 构建链与 `dist/` 目录，但对 Cloudflare Pages 而言，不是首阶段上线的必要条件。
- 本机 `npm install` 已能完成；`npx gulp` 在当前本机 Node 11.11.0 环境下可生成产物，但这不能直接证明它在 Cloudflare Pages 默认现代构建镜像上长期稳定。
- Cloudflare Pages Git integration 支持连接 GitHub 仓库，并在每次 push 后自动构建部署。
- Cloudflare Pages 可以将指定分支设置为 Production branch；当 `main` 被指定为生产分支后，推送到 `main` 会更新生产站点。
- Cloudflare Pages 默认会为其他分支和 PR 生成 preview deployments；同仓库内 PR 会持续更新预览链接。
- Preview 部署默认公开，但可通过 Cloudflare Access 限制访问。
- Cloudflare Pages 支持 `*.pages.dev` 免费二级域名。
- 绑定自有域名时，subdomain 可以通过 CNAME 指向 `*.pages.dev`；apex domain 则需要该域名所在 zone 已托管到 Cloudflare。
- Cloudflare Pages 的 API 支持 project / deployment / domain 管理，但首次 Git 仓库集成通常仍更适合走控制台完成授权和项目建立。
- 当前开发机直接执行 `git push origin main:main` 时出现 LibreSSL `SSL_ERROR_SYSCALL`，这是后续实际接入与验证阶段需要处理的外部风险。

## Execution Findings
- 当前仓库位于 `main`，工作区干净，适合先创建隔离 worktree 再执行计划中的仓库改动。
- 仓库内不存在现成的 `.worktrees/` 或 `worktrees/` 目录，也没有可用的 `./scripts/harness worktree-name` 辅助脚本。
- 用户已选择使用项目内隐藏目录 `.worktrees/` 作为 worktree 根目录。
- `.worktrees/` 在开始执行前未被 Git ignore，需要先补充 `.gitignore` 保护。
- 部署目标仓库仍以 `origin = https://github.com/ilderaj/chart-mage.git` 为准；`upstream` 是 `heyjunlin/chart-mage`。
- Cloudflare Pages Git-integrated project 创建请求在当前账号下返回 API 错误 `8000011`，而不带 `source` 的 direct-upload project 创建成功，说明阻塞点在 Cloudflare Pages GitHub 安装状态，而不是 Pages API 或项目配置本身。
- 用户已明确选择 direct-upload fallback 以优先达成“站点先可用”。
- 当前 Cloudflare Pages 项目名为 `chart-mage`，生产 URL 为 `https://chart-mage.pages.dev`。
- 首个生产部署 ID 为 `010f65fe-098e-41bf-9582-40887adf4630`，部署状态为 `success`。
- `https://chart-mage.pages.dev` 返回 `200`；`/intro.html` 会规范化到 `/intro` 并返回 `200`，`/index.html?maestro=1` 会规范化到 `/?maestro=1` 并返回 `200`。
- 当前生产模式是 direct upload，因此 Git-based production / preview automation 和 branch preview 仍不可用，必须等待 Cloudflare GitHub 安装恢复后再继续。

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| 第一阶段采用 Cloudflare Pages 直连 GitHub 的 Git integration | 这是最直接满足“push 到 main 自动更新”的方式 |
| 第一阶段优先发布静态源目录，而不是先重构构建链 | 让部署迁移先成功，再决定是否需要把旧 Gulp 流程现代化 |
| 将 `github_page` 视为历史参考，不再视为生产发布分支 | 避免分支即部署的旧模型继续制造心智负担 |
| 将域名接入拆分为 `pages.dev` 验证和自有域名绑定两个阶段 | 便于隔离应用发布问题和 DNS / 证书问题 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| 本地 Git HTTPS 推送失败（LibreSSL / `SSL_ERROR_SYSCALL`） | 暂记为外部阻塞项；实施阶段优先改走 SSH remote 或在网络正常环境重试 |
| 仓库存在老旧 Gulp 工具链，与 Cloudflare 现代构建镜像的长期兼容性未完全验证 | 实施计划中避免把首次上线绑定在该构建链上 |

## Resources
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/preview-deployments/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/pages/configuration/build-image/
