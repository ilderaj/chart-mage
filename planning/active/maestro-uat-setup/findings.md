# Findings

## Requirements
- 为本项目部署 Maestro 测试框架，作为后续 UAT 的默认执行框架。
- 接入完成后必须完成一次验证。
- 需要回答未来是否会自动根据 spec 或 UI 设计产出 Maestro 测试用例。

## Research Findings
- ChartMage 当前是静态 Web 应用，入口依赖本地 HTTP 服务和浏览器 DOM，而非移动端打包产物。
- Maestro 官方 README 已明确支持 Android、iOS 和 Web。
- Maestro CLI 的 Web 模式可以用 `--platform web` 在 Chromium 上执行 YAML flows。
- Maestro 仓库代码和 MCP 说明都表明 Web flow 以 URL 为目标，并通过 `openLink`、`tapOn`、`assertVisible`、`inputText` 等命令驱动浏览器。
- ChartMage 的核心 UAT 路径可围绕 `Sample sequence diagram`、`Diagram Input`、`Live Preview`、`new-flowchart-button`、`flowchart-name-input`、`show-charts-button` 等稳定文本和 id 展开。
- 当前 macOS 环境存在 `/usr/bin/java` stub，但没有实际 Java Runtime；`maestro` 命令也尚未安装。
- 安装完成后，`java -version` 已返回 Homebrew OpenJDK 17.0.19，`maestro --version` 已返回 2.5.0。
- 当前 smoke flow 改为直接打开 `http://127.0.0.1:8000/index.html?maestro=1`，由页面内联脚本原地写入 `localStorage.visited`，避免额外跳转。
- Maestro Web `ClassCastException` 的仓库侧触发器已定位：隐藏 modal 中的表单依赖 `input name="name"`，导致 DOM 的 `form.name` 返回 `HTMLInputElement` 对象；Maestro Web 脚本把该对象塞进属性树后，`CdpWebDriver.parseDomAsTreeNodes` 在字符串强转时崩溃。
- 去除这三个输入框的 `name="name"` 并改用显式 id 读取值后，`openLink` 阶段的 `LinkedHashMap cannot be cast to String` 已不再复现。
- 进一步将 smoke flow 从 `graphDiv` / 文本按钮匹配切到 `clearState + deterministic text + stable ids` 后，`./scripts/run-maestro-web-smoke.sh` 已完整通过。
- 已新增并实测通过 `web-create-sequence.yaml`、`web-rename-chart.yaml`、`web-delete-chart.yaml` 三条补充 flow，覆盖 sequence 创建、chart rename、chart delete 三条独立主链路。
- rename/delete 初始不稳定并不是 Maestro 单独问题，而是产品侧 drawer backdrop 在 modal 打开后仍拦截点击；从 drawer 进入 rename/delete 时先关闭 drawer 后，Maestro 与人工交互都恢复稳定。

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| 新增 `scripts/install-maestro.sh` | 让本机依赖安装有仓库内入口，而不是只存在口头说明 |
| 新增 `scripts/run-maestro-web-smoke.sh` | 固化 `--platform web`、debug 输出目录和 headless 默认行为 |
| 新增 `.maestro/flows/web-smoke.yaml` | 让项目具备第一条可执行 UAT 样板 |
| 改用 `index.html?maestro=1` 作为 smoke 入口 | 保留首访绕过能力，同时避免额外跳转层级 |
| 为关键入口补稳定 id | 让 Maestro Web 不依赖易漂移的文本匹配或 SVG 内部结构 |
| 从 drawer 进入 destructive / rename modal 前先关闭 drawer | 避免 backdrop 截获 modal 的输入与按钮点击 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Maestro 文档页部分 URL 抓取失败 | 改为结合官方 README 与源码片段确认 Web flow 结构和命令形态 |
| 本机缺少 Java Runtime 与 Maestro CLI | 进入依赖安装阶段，待安装后重跑同一条 smoke flow |
| Maestro Web smoke flow 在导航后触发 CDP/DOM 解析异常 | 已定位到仓库侧 DOM 触发器并修复，随后 smoke flow 通过 |

## Destructive Operations Log
| Command | Target | Checkpoint | Rollback |
|---------|--------|------------|----------|
|         |        |            |          |

## Resources
- https://github.com/mobile-dev-inc/maestro
- https://docs.maestro.dev/

## Visual/Browser Findings
- 当前主工作台包含 `Diagram Input`、`Live Preview`、`Sample sequence diagram` 等稳定可见文案，适合作为 smoke flow 文本锚点。
- `#new-flowchart-button` 与 `#show-charts-button` 已作为关键交互入口的稳定 UAT selector。