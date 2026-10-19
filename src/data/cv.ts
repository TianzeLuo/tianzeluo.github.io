import type { Lang } from '../i18n/ui';

/** This is the single source for both the CV page and its printable version. */
export const cv: Record<Lang, {
  introduction: string;
  interests: string[];
  education: { period: string; title: string; description: string }[];
  experience: { period: string; title: string; description: string }[];
  awards: { period: string; title: string; description: string }[];
  skills: { title: string; description: string }[];
}> = {
  en: {
    introduction: 'Undergraduate at Peking University’s Yuanpei College, studying in the Tong Class for general artificial intelligence. Interested in generative models and agent systems, with hands-on experience building desktop tools, open-source plugins, and local-first knowledge systems.',
    interests: ['Generative models', 'Agent systems', 'Open-source research tools'],
    education: [
      {
        period: '2025 – 2029 (expected)',
        title: 'Peking University · Yuanpei College',
        description: 'Undergraduate, Tong Class (Artificial Intelligence).'
      }
    ],
    experience: [
      {
        period: '2026',
        title: 'OmniStudio',
        description: 'Built a cross-platform Qt desktop workspace that combines Markdown notebooks, code editing, AI assistance, and OpenJudge integration.'
      },
      {
        period: '2026 – present',
        title: 'DSH Plugin Suite',
        description: 'Designed and maintained plugins for academic search, paper reading, session workflows, and desktop notifications.'
      },
      {
        period: '2026',
        title: 'Yizhi',
        description: 'Built a local-first knowledge workbench with incremental indexing, cited Q&A, and Docker-based services.'
      },
      {
        period: '2026',
        title: 'Deep RL Practice',
        description: 'Implemented a unified PyTorch training framework for classic deep reinforcement learning algorithms across Gymnasium environments.'
      }
    ],
    awards: [
      {
        period: '2026',
        title: 'CUMCM · Beijing Division First Prize',
        description: 'China Undergraduate Mathematical Contest in Modeling, Problem B: fast localization and removal of radio interference sources.'
      },
      {
        period: '2026',
        title: 'Jiang Zehan Cup · Second Prize',
        description: 'The 23rd Peking University Mathematical Modeling and Computer Application Competition, Problem B: robustness and improvement of transportation networks.'
      },
      {
        period: '2026',
        title: 'Jiukun Cup Programming Contest · Third Prize',
        description: 'The 24th Peking University “Jiukun Cup” Programming Contest.'
      }
    ],
    skills: [
      { title: 'Programming', description: 'C++17, Python.' },
      { title: 'ML & simulation', description: 'PyTorch, Gymnasium, NumPy, Matplotlib.' },
      { title: 'Systems & tools', description: 'Qt 6, Docker, Git, Linux.' }
    ]
  },
  zh: {
    introduction: '北京大学元培学院本科生，就读于通用人工智能实验班（Tong Class）。关注生成模型与 Agent 系统，做过桌面工具、开源插件与本地知识系统。',
    interests: ['生成模型', 'Agent 系统', '开源研究工具'],
    education: [
      {
        period: '2025 – 2029（预计）',
        title: '北京大学 · 元培学院',
        description: '本科生，通用人工智能实验班（Tong Class）。'
      }
    ],
    experience: [
      {
        period: '2026',
        title: 'OmniStudio',
        description: '开发跨平台 Qt 桌面工作台，整合 Markdown 笔记本、代码编辑、AI 助手与 OpenJudge 在线评测。'
      },
      {
        period: '2026 – 至今',
        title: 'DSH 插件合集',
        description: '设计并维护学术检索、论文阅读、会话工作流与桌面通知等插件。'
      },
      {
        period: '2026',
        title: '易知',
        description: '开发本地优先的个人知识工作台，支持增量索引、带引用的问答与 Docker 服务。'
      },
      {
        period: '2026',
        title: '深度强化学习实践',
        description: '实现统一的 PyTorch 训练框架，在多个 Gymnasium 环境中复现经典深度强化学习算法。'
      }
    ],
    awards: [
      {
        period: '2026',
        title: '全国大学生数学建模竞赛 · 北京赛区一等奖',
        description: 'B 题：无线电干扰源的快速自动定位与清除。'
      },
      {
        period: '2026',
        title: '北京大学“江泽涵杯” · 二等奖',
        description: '第二十三届数学建模与计算机应用竞赛，B 题：交通网络的健壮性和提升。'
      },
      {
        period: '2026',
        title: '北京大学“九坤杯”程序设计竞赛 · 三等奖',
        description: '第二十四届“九坤杯”程序设计竞赛。'
      }
    ],
    skills: [
      { title: '编程语言', description: 'C++17、Python。' },
      { title: '机器学习与仿真', description: 'PyTorch、Gymnasium、NumPy、Matplotlib。' },
      { title: '系统与工具', description: 'Qt 6、Docker、Git、Linux。' }
    ]
  }
};
