## 🌐 Choose your language / 选择语言

| 🌐 Language | 选择语言 |
|--------------|----------|
| [English](#english) | [中文](#中文) |

---

# 中文


### 背景
这个项目来自于自己在买股票，买基金时，经常遇到相对涨幅，基金折价率等简单运算。    
我不喜欢拿着手机按，windowss 自带的计算器输入又不够自由，所以产生了此项目


### 功能更新日志

- 2026-06-22：增加输出结果小数位控制，支持 `0~8` 位显示精度并保存到本地
- 2026-05-22：修复了快捷键绑定的问题

### 基于文本的计算器（带方程求解）

基于文本的计算器应用，一个静态前端项目.

允许用户通过在文本区域中输入表达式来求计算结果，支持一元一次方程。

项目使用 React、TypeScript、Vite、pnpm、Tailwind CSS 和 Shadcn UI 构建。

### 在线例子

我在`EdgeOne`上部署了一个纯静态页面，[text-calcer URL](https://text-calcer.knowckx.top/)，可以直接使用


![desc](images/demo-calc.png)



### 新功能
**2025-07-27 增加一个懒人功能: 一键复制**  
将鼠标悬停在计算结果的某一行时，会看到一个复制图标。点击它，就可以一键复制整行结果到剪贴板。

**2026-04 增加清屏功能**  
点击页面顶部的 `清屏` 按钮，或者在输入框聚焦时按下 `Ctrl + Shift + K`，即可清空当前输入、结果和本地缓存，开始下一轮计算。

**2026-04 增加语言切换**  
可以在页面顶部切换中文和英文，语言选择会保存在本地，下次打开页面会自动恢复。

**2026-06 增加输出小数位控制**  
可以在页面顶部选择结果显示的小数位，范围为 `0~8`。该设置只影响显示，不影响实际计算，并会保存在本地。普通结果、方程结果和百分比展示都会共用这套精度规则。

### 功能特性
*   **基础算术：** 执行加法、减法、乘法、除法和其他标准数学运算。
*   **乘法符号：** 可以选择你喜欢的乘法符号，为了更好的markdown兼容性，字符'x'和字符'\*'都会被视为乘法符号. "2*3=6"等价于"2x3=6".
*   **方程求解：** 求解具有单个变量 'a' 的线性方程。
*   **注释支持：** 允许用户使用 `#` 符号向其计算添加注释。 `#` 后面的部分将被视为注释，并在计算过程中被忽略。
*   **清屏功能：** 点击 `清屏` 按钮或按下 `Ctrl + Shift + K`，可重置编辑器、结果和缓存输入。
*   **中英文切换：** 可以在页面顶部切换中文和英文，语言选择会保存在本地并自动恢复。
*   **小数位控制：** 可自定义结果显示的小数位，范围 `0~8`，采用“最多保留 N 位小数”的规则，并保存到本地。
*   **格式化输出：** 以用户友好的方式显示数字，自动去除多余尾零；除法值可显示百分比，且百分比与普通结果共用同一显示精度。
*   **缓存输入内容：** 缓存用户输入的内容 下次打开网页时进行复原
*   **PWA支持：** 使用Https部署后可以通过PWA安装到本地应用
*   **云服务商pages部署：** 支持各种服务商的pages静态部署







### 技术栈

*   **前端框架:** [React](https://react.dev/)
*   **语言:** [TypeScript](https://www.typescriptlang.org/)
*   **构建工具:** [Vite](https://vitejs.dev/)
*   **包管理器:** [pnpm](https://pnpm.io/)
*   **样式:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI 组件:** [Shadcn UI](https://ui.shadcn.com/)
*   **数学库:** [Math.js](https://mathjs.org/)

### 快速开始

1.  **克隆仓库:**

    ```bash
    git clone https://github.com/Knowckx/text-calcer.git
    cd text-calcer
    ```

2.  **安装依赖:**

    ```bash
    pnpm install
    ```

3.  **运行开发服务器:**

    ```bash
    pnpm dev
    ```

    这将启动开发服务器，通常在 `http://localhost:3000` 上。在浏览器中打开此 URL 以查看应用程序。

4.  **本地部署，支持安装PWA应用:**

    ```bash
    pnpm run build
    pnpm preview --host
    ```

5.  **Docker 部署:**

    ```bash
    docker build -t text-calcer .
    docker run --rm -p 8080:80 text-calcer
    ```

    或者使用 Docker Compose：

    ```bash
    docker compose up --build
    ```

    然后打开 `http://localhost:8080`。




### 贡献

欢迎Fork / Star

如果您发现任何错误或有改进建议，请提交一个 issue 或 pull request。

### 许可证

本项目根据 [GPL3 许可证](LICENSE) 获得许可

# English

### Change Log

- 2026-06-22: Added output decimal-place control with `0-8` display precision and local persistence
- 2026-05-22: Fixed the shortcut binding issue

### Text-based Calculator (with Equation Solver)

A text-based calculator application, a static frontend project.

Allows users to calculate results by entering expressions in a text area, supporting linear equations with one variable.

The project is built using React, TypeScript, Vite, pnpm, Tailwind CSS, and Shadcn UI.

### Example

A demo page deployed -> [Demo URL](https://text-calcer.knowckx.top/)

![desc](images/demo-calc.png)

### New Features
**July 27, 2025: New One-Click Copy Feature**  
Hover over any result line to reveal a copy icon. Simply click it to copy the entire line to your clipboard.

**2026-04: Clear Workspace**  
Use the `Clear` button or press `Ctrl + Shift + K` while the editor is focused to clear the current workspace and start a new calculation batch.

**2026-04: Language Switcher**  
Switch between Chinese and English from the top bar. Your selection is remembered locally and restored on the next visit.

**2026-06: Decimal Display Control**  
Choose the number of displayed decimal places from the top bar, with a range of `0-8`. This affects display only, not the actual calculation, and is stored locally. Standard results, equation results, and percentage display all follow the same precision rule.

### Features
*   **Basic Arithmetic:** Performs addition, subtraction, multiplication, division, and other standard mathematical operations.  
*   **Multiplication symbols:** For better **markdown** file compatibility, You can choose the multiplication symbol you like. "2*3=6" is equals to "2x3=6".
*   **Equation Solving:** Solves linear equations with a single variable 'a'.
*   **Comment Support:** Allows users to add comments to their calculations using the `#` symbol.  The part after `#` will be treated as a comment and ignored during calculation.
*   **Clear Workspace:** Use the `Clear` button or `Ctrl + Shift + K` to reset the editor, results, and cached input.
*   **Internationalization:** Switch between Chinese and English from the top bar. The app remembers your language choice locally.
*   **Responsive Design:** Adapts to different screen sizes using a two-column layout.
*   **Decimal Display Control:** Customize displayed decimal places from `0` to `8`, using a “keep up to N decimal places” rule, with local persistence.
*   **Formatted Output:** Displays numbers in a user-friendly way, removes unnecessary trailing zeros, and applies the same precision rule to percentage display.
*   **Input Caching:** Caches the user's input.  Restores the input when the webpage is opened next time.
*   **PWA Support:**  After deployment using Https, it can be installed as a local application through PWA.
*   **Cloud Provider Pages Deployment:** Supports static deployment on various service providers' pages.


### Tech Stack

*   **Frontend Framework:** [React](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Package Manager:** [pnpm](https://pnpm.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Math Library:** [Math.js](https://mathjs.org/)

### Quick Start

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Knowckx/text-calcer.git
    cd text-calcer
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    This will start the development server, usually on `http://localhost:3000`. Open this URL in your browser to view the application.

4.  **Local deployment, supporting PWA application installation:**

    ```bash
    pnpm run build
    pnpm preview --host
    ```

5.  **Docker deployment:**

    ```bash
    docker build -t text-calcer .
    docker run --rm -p 8080:80 text-calcer
    ```

    Or use Docker Compose:

    ```bash
    docker compose up --build
    ```

    Then open `http://localhost:8080`.

### Contributing

Fork/Star are welcome.

If you find any bugs or have suggestions for improvement, please submit an issue or pull request.

### License

This project is licensed under the [GPL3 License](LICENSE).

---
