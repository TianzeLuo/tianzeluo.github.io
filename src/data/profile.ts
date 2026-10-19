/** Public profile details. Empty contacts render no dead links. */
export const profile = {
  name: { en: 'Tianze Luo', zh: '罗天泽' },
  initials: 'TL',
  isPlaceholder: false,
  email: '2500017742@stu.pku.edu.cn',
  github: 'https://github.com/tianzeluo',
  scholar: '',
  role: {
    en: 'Undergraduate at Peking University · Yuanpei College · Tong Class',
    zh: '北京大学元培学院本科生 · 通用人工智能实验班'
  },
  intro: {
    en: 'Personal portfolio of Tianze Luo, an undergraduate at Peking University building open-source software.',
    zh: '罗天泽的个人主页：北京大学本科生，做开源软件。'
  },
  about: {
    en: 'I am an undergraduate at Peking University’s Yuanpei College, in the Tong Class for artificial intelligence. I like turning what I learn into open-source software I can run, test, and share.',
    zh: '我是北京大学元培学院本科生，就读于通用人工智能实验班（Tong Class）。我喜欢把学到的东西做成可以运行、测试和分享的开源软件。'
  }
} as const;
