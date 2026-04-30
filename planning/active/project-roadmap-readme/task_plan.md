# Project Roadmap And README Refresh

## Current State
Status: waiting_review
Archive Eligible: no
Close Reason:

## Goal
为 Chart Mage fork 落盘一份约 5 个版本的 private English roadmap，并更新 README，使它准确表达本 fork 的维护方向、设计重构、modernization、UAT/部署状态与对原项目的充分 credit。

## Requirements
- Roadmap 保持 private，不作为公开站点或 README 导航内容。
- Roadmap 使用英文，并覆盖约 5 个版本。
- Roadmap 需要明确所有主要用户场景都必须有 Maestro 测试用例覆盖。
- 页面关键位置未来需要明确 credit 原始项目和作者，并只导向原始 repo。
- 后续清理所有导向原作者 contact/profile/GitHub 等路径，除 credit 中的原 repo 链接外不再保留。
- Roadmap 必须包含全面设计重构、现代化、体验优化和额外观察到的改进点。
- README 使用英文，贴合 forked and updated project，同时给足原 repo 和作者 credit。

## Phases
1. Context review - complete
   - Read current README, design notes, key app pages, package metadata, repo memories.
2. Roadmap drafting - complete
   - Draft private 5-version roadmap under this task directory.
3. README refresh - complete
   - Rewrite README around the maintained fork, credit, local usage, UAT, roadmap summary, and modernization direction.
4. Verification - complete
   - Check markdown formatting, unwanted public roadmap links, and obvious stale personal-contact references in updated docs.
5. Maestro coverage requirement update - complete
   - Add all-scenarios Maestro coverage policy to private roadmap and sync planning state.
6. Backlogs folder setup - complete
   - Add issue-level backlog files for bug fixes, new features, issues, and Maestro coverage mapping.

## Decisions
- Use `planning/active/project-roadmap-readme/private_roadmap.md` for the roadmap because the user requested a private roadmap.
- Do not publish or link the private roadmap from README.
- Credit should point to the original repository only: `https://github.com/heyjunlin/chart-mage`.
- README should describe this as a maintained fork and avoid personal contact/profile links for the original author.
- Use root-level `backlogs/` for concrete issue-sized work items that support roadmap versions or capture small standalone needs outside the roadmap.
- Backlog documentation should stay English and include a Maestro coverage field for user-facing scenarios.

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|

## Verification
- `get_errors` found no errors in README, private roadmap, and task planning files.
- Search confirmed README does not link to the private roadmap and does not contain newly introduced legacy contact or analytics strings.
- `git diff --check -- README.md planning/active/project-roadmap-readme` completed with no output.
