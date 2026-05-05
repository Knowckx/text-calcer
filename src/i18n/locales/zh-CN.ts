import type { Messages } from '../types';

const zhCN = {
  actions: {
    clear: '清屏',
    copyLine: '复制此行',
    copiedLine: '已复制',
    language: '语言',
  },
  titles: {
    input: '输入',
    result: '结果',
    quickTips: '使用提示',
  },
  links: {
    github: '源码',
    blog: '博客',
  },
  placeholders: {
    formula: '输入公式，例如：3x10+1 或 3*10+1',
  },
  notices: {
    cleared: '已清屏',
    copyFailed: '复制失败',
  },
  emptyState: {
    heading: '开始输入，结果会自动生成',
    description: '右侧会实时显示计算结果，空状态下这里展示的是这个工具能做什么。',
    bullet1: '支持多行输入，内容会自动缓存到本地',
    bullet2: '悬停某一行可复制整行结果',
    bullet3: '支持注释、乘号替换和线性方程求解',
  },
  noResults: {
    heading: '没有可显示的结果',
    description: '如果你删除了所有输入，这里会回到提示状态。',
  },
  languages: {
    'zh-CN': '中文',
    'en-US': 'English',
  },
  calculations: {
    equationFormatError: "方程格式不正确，应为 '表达式=表达式'",
    equationSolveFailed: '方程求解失败，请检查方程的格式',
    equationInfiniteSolutions: '无穷多解',
    equationNoSolution: '无解',
    equationPrefix: 'a = ',
  },
} satisfies Messages;

export default zhCN;
