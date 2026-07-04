# Text Calcer 功能状态交接

更新时间：2026-07-04

## 项目概况

- 项目类型：纯前端静态应用
- 技术栈：React 18、TypeScript、Vite 6、Tailwind CSS 4、mathjs、pnpm
- 主入口：`src/main.tsx`
- 核心页面与计算逻辑：`src/components/textCalcApp.tsx`
- i18n：`src/i18n/*`
- SEO 与语言路径：`src/lib/seo.ts`、`src/lib/site.ts`
- PWA / 构建配置：`vite.config.ts`

## 已实现功能状态

| 功能 | 状态 | 主要位置 | 说明 |
| --- | --- | --- | --- |
| 多行文本计算 | 已实现 | `src/components/textCalcApp.tsx` | 输入按行拆分，每行独立计算并实时输出 |
| 基础数学表达式 | 已实现 | `GetLineNoCommentResult` | 使用 `mathjs.evaluate` 计算普通表达式 |
| `x` 作为乘号 | 已实现 | `GetLineNoCommentResult` | 计算前将 `x` 替换为 `*` |
| `*` 作为乘号 | 已实现 | `mathjs.evaluate` | 原生支持 |
| 行内注释 | 已实现 | `HandleOneLine` | `#` 后内容作为注释，不参与计算，结果中保留 |
| 空行保留 | 已实现 | `calculateResults` | 输入空行时结果区也保留空行 |
| 纯数字直出 | 已实现 | `calculateResults` | 单行只有数字时不追加 `= result` |
| 一元一次方程求解 | 已实现 | `solveEquation` | 支持变量 `a`，格式为 `表达式=表达式` |
| 方程无解/无穷解提示 | 已实现 | `solveEquation` + i18n | 系数为 0 时区分无解和无穷多解 |
| 百分比展示优化 | 已实现 | `formatEvalResultNumber` | 除法结果在 0.7 到 1.3 范围内追加涨跌幅百分比 |
| 输出小数位控制 | 已实现 | `decimalPlaces` 状态 | 支持 0 到 8 位，影响普通结果、方程结果和百分比显示 |
| 小数位本地保存 | 已实现 | `text-calcer-decimal-places` | 使用 localStorage 保存 |
| 输入内容本地缓存 | 已实现 | `calcInput` | 页面重开后恢复输入并重新计算 |
| 清屏按钮 | 已实现 | `resetWorkspace` | 清空输入、结果和 `calcInput` |
| 清屏快捷键 | 已实现 | `Configs.ClearWorkspaceShortcut` | 默认 `ctrl+shift+k` |
| 结果行复制 | 已实现 | `handleCopy` | 鼠标悬停结果行显示复制按钮，复制整行结果 |
| 复制成功状态 | 已实现 | `copiedLineIndex` | 成功后短暂显示勾选图标 |
| 复制失败提示 | 已实现 | `showNotice` | clipboard 写入失败时显示提示 |
| 中英文切换 | 已实现 | `LanguageSwitcher`、`I18nProvider` | 支持 `zh-CN`、`en-US` |
| 语言本地保存 | 已实现 | `text-calcer-locale` | 使用 localStorage 保存 |
| 语言路径同步 | 已实现 | `src/lib/site.ts` | 支持 `/zh-CN/` 和 `/en-US/` |
| SEO 动态同步 | 已实现 | `syncSeoHead` | 根据语言更新 title、description、OG、canonical、alternate、JSON-LD |
| PWA | 已实现 | `vite.config.ts` | 使用 `vite-plugin-pwa`，自动更新 service worker |
| Docker 部署 | 已实现 | `Dockerfile`、`nginx.conf` | 构建静态文件后由 nginx 托管 |

## 关键配置

- `src/conf.ts`
  - `ShowNumPercentDetail: true`
  - `ClearWorkspaceShortcut: 'ctrl+shift+k'`
- `src/config/site.ts`
  - `siteUrl: 'https://text-calcer.knowckx.top'`
  - `bingVerifyCode` 已配置

## 当前计算流程

1. `handleInputChange` 接收文本输入。
2. `calculateResults` 按 `\n` 拆成多行。
3. `HandleOneLine` 分离公式和 `#` 注释。
4. 空行、注释行、纯数字行走特殊处理。
5. 含 `a` 且含 `=` 的行进入 `solveEquation`。
6. 其它表达式进入 `mathjs.evaluate`。
7. `formatEvalResult` / `formatEvalResultNumber` 负责结果格式化。
8. 最终结果数组渲染到右侧结果区。

## 已知注意点

- `solveEquation` 内部使用 `new Function` 执行表达式，功能直接但有代码执行风险。
- 方程识别条件是 `inpLine.includes('a') && inpLine.includes('=')`，可能误判包含字母 `a` 的非方程输入。
- 计算逻辑和 UI 当前都在 `src/components/textCalcApp.tsx`，后续如果继续加复杂功能，建议先抽出纯计算模块。
- 当前仓库未看到测试文件；本次交接未运行测试或程序。

## 下个 AI 窗口建议优先读

1. `README.md`
2. `src/components/textCalcApp.tsx`
3. `src/i18n/types.ts`
4. `src/i18n/locales/zh-CN.ts`
5. `src/i18n/locales/en-US.ts`
6. `src/conf.ts`
7. `vite.config.ts`
