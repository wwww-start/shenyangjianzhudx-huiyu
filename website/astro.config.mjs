import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://wwww-start.github.io',
  base: '/shenyangjianzhudx-huiyu',
  trailingSlash: 'always',
  output: 'static',
  integrations: [starlight({
    title: '慧鱼实验室',
    description: '从第一行 C 代码，到理解机器人与人工智能。面向零基础新生的开放教材。',
    defaultLocale: 'root',
    locales: { root: { label: '简体中文', lang: 'zh-CN' } },
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/wwww-start/shenyangjianzhudx-huiyu' }],
    customCss: ['./src/styles/custom.css', 'katex/dist/katex.min.css'],
    sidebar: [
      { label: '学习地图', link: '/' },
      { label: '01 单片机基础', autogenerate: { directory: 'mcu' } },
      { label: '02 STM32 开发', autogenerate: { directory: 'stm32' } },
      { label: '03 PID 控制', autogenerate: { directory: 'pid' } },
      { label: '04 人工智能', autogenerate: { directory: 'ai' } },
      { label: '互动实验室', autogenerate: { directory: 'labs' } },
      { label: '原教材与学习资源', link: '/resources/' },
    ],
  }), react()],
  markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] },
});
