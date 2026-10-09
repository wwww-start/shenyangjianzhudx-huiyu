# 慧育 · 机器人电控互动教材

公开网址：**https://wwww-start.github.io/shenyangjianzhudx-huiyu/**

这是原 Word/Markdown 教材的在线扩展。无需登录；手机、平板、电脑都能通过网址访问。PID 和其他实验在访问者的浏览器内计算，不需要后端服务器、模型接口或 API 密钥。首次打开仍需从 GitHub Pages 加载页面和资源，不宣称支持完全离线安装。

## 课程结构

- 单片机：供电与电平、CPU/GPU/RAM/Flash/SSD、寄存器、C 语法、.c/.h、编译与执行。
- STM32：F107 + Keil + STM32F10x SPL，最小系统、启动与时钟、GPIO 模式、EXTI/NVIC、TIM/PWM、ADC、UART/CAN、编码器和电机。
- PID：闭环、P/I/D、测量值微分、滤波、限幅、条件积分、位置式与增量式比较、调参与指标。
- AI：发展历史、神经网络、训练/推理、损失与梯度、CNN/RNN/Transformer、Token/Embedding/Attention、RAG/Agent/MCP/Skill。
- 独立实验：`labs/pid/`、`labs/cpu/`、`labs/gpio-pwm/`、`labs/ai/`。正文只放链接。
- 资源页保留原讲义、代码与视频入口，补充 Linux、DNS、VPN 概览。本文VPN只做讲解科学原理。

## 本地预览与生产检查

安装 Node.js 22.12 或以上（CI 使用 Node 22），在仓库根目录执行：

```sh
cd website
npm ci
npm run dev
```

打开终端给出的 `/shenyangjianzhudx-huiyu/` 地址。生产构建与检查：

```sh
npm test
npm run check
npm run build
node scripts/check-links.mjs
npm run preview
```

若环境限制 Astro 遥测配置写入，可设置 `ASTRO_TELEMETRY_DISABLED=1`；这不影响网站功能。依赖版本由 package-lock.json 锁定，CI 用 npm ci 安装。

## GitHub Pages 免费公开部署

1. 仓库保持公开，进入 **Settings → Pages**。
2. **Build and deployment → Source** 选择 **GitHub Actions**。
3. 提交网站更新到 main 后，Actions 中 `Deploy teaching website` 自动运行；也可在该工作流点 Run workflow。
4. 等待 build 和 deploy 都成功，再打开上方公开网址。访客无需 GitHub 账号。

工作流在 PR 上只检查和构建，在 main 才发布。部署使用 GitHub 提供的短期凭据，无需添加个人令牌。环境 `github-pages` 若另外设置了审核要求，部署会按仓库规则等待审核。

`astro.config.mjs` 固定 `site=https://wwww-start.github.io` 和 `base=/shenyangjianzhudx-huiyu`。所有站内手写链接带该前缀；Figure/LabLink 从 BASE_URL 构建地址。不要把 `dist` 文件直接用双击 HTML 的方式验收；它应通过 HTTP 服务在对应子路径下访问。

## 更新课程

正文在 `src/content/docs/`，可编辑 Markdown/MDX，frontmatter 的 sidebar.order 决定模块内顺序。原创图在 `public/diagrams/`，新增图必须同步 `IMAGE_SOURCES.md`。共享样式在 `src/styles/custom.css`。

React 互动组件在 `src/components/`，数值控制核心在 `src/lib/pid.mjs`。正文引用原 examples 使用 `?raw` 构建时读取，不覆盖原文件。修改 examples 后，自动部署也会触发。

在新分支编辑 → 运行上述检查 → 提交并合并到 main → 查看 Actions → 核对线上页面。更新 base 或仓库名时，应同步所有手写正文链接并运行链接检查。

## PID 模型与测试

一阶对象：`y[k+1] = y[k] + 0.01 * (G[k]*u[k]-y[k])/0.25`。0.5 s 目标阶跃，4 s 增益从 100 变 90，8 s 观测；输出 [0,1]、积分 [-0.8,0.8]、测量值微分低通时间常数 0.03 s。速度为教学单位，无噪声、死区、电流限制或真实电机参数辨识。

默认值逐点对照原 `examples/pid/simulate.py` 的 800 个样本，参考数据存于 tests/fixtures。增量模式对相同 P/I/D 状态作差并累加到未限幅输出，因此同初值与同策略时与位置式等价；不声称增量式天然抗积分饱和。关闭条件积分仍保留积分硬限幅。

## 原文件与许可

本次新增仅在 website/ 和 .github/workflows/deploy-website.yml。原 Word、Markdown、代码例子、来源与版权说明保持原样。示例是教学模块，不宣称经过实际开发板运行验证。本站使用原创 SVG，没有转载来源不明的硬件照片；不将第三方素材重新授权。

互助，开源，共享是科学真正的精神。
