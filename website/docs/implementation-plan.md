# 交互教材实施计划

Goal: 保留原教材，新增可公开访问、无后端的四模块课程。
Architecture: Starlight 静态生成正文；React 只在独立实验页加载；GitHub Actions 发布 Pages。
Tech Stack: Astro 5、Starlight、React、Recharts、KaTeX、原创 SVG。
Spec: 本次用户需求，STM32F107 + Keil + SPL；实验独立，仅以链接接入正文。

## 全局约束
- 原 Word、Markdown、examples 不改；新增 website 和部署 workflow。
- base=/shenyangjianzhudx-huiyu；不使用后台或 API 密钥。
- PID 数值模型对齐 examples/pid/simulate.py；增量式比较明确初始化与限幅策略。
- AI 同源词演示采用 act/action/active，区分词源、语义与分词。

## 任务及验证
1. 网站骨架及 PID 核心：先写数值测试并观察失败，再实现；与原 Python 800 个采样点核对。
2. PID 正文、独立实验和代码逐行解释；滑块、重置、播放/暂停、限幅和指标验证。
3. MCU、STM32、AI 正文和原创图；CPU、GPIO/PWM、神经元及词根实验；引用原示例。
4. build、类型检查、内部链接检查、浏览器桌面/移动检查；确认根路径资源均含 base。
5. 新增自动部署 workflow、使用说明；仅提交新增文件，启用公开 Pages，验证线上网址。

## Review Focus
零目标的超调计算、不可达目标积分饱和、暂停/重置竞争、子路径链接、原文件字节保留。

## 执行记录
- 独立克隆并建立 feat/interactive-course 分支，原目录不改。
- 原仓库 CRLF blob 与 text eol=lf 属性不一致；不暂存任何原文件，按 Git 树验证保留。
- 最新用户明确授权四模块开发与公开部署，按此执行。
