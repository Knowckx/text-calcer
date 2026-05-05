import type { Messages } from '../types';

const enUS = {
  actions: {
    clear: 'Clear',
    copyLine: 'Copy line',
    copiedLine: 'Copied',
    language: 'Language',
  },
  titles: {
    input: 'Input',
    result: 'Result',
    quickTips: 'Quick Tips',
  },
  links: {
    github: 'GitHub',
    blog: 'Blog',
  },
  placeholders: {
    formula: 'Enter formula, for example: 3x10+1 or 3*10+1',
  },
  notices: {
    cleared: 'Cleared',
    copyFailed: 'Copy failed',
  },
  emptyState: {
    heading: 'Start typing and results will appear',
    description: 'The right side updates in real time. When empty, it shows what the tool can do.',
    bullet1: 'Supports multi-line input and caches content locally',
    bullet2: 'Hover a row to copy the full result line',
    bullet3: 'Supports comments, multiplication symbols, and linear equations',
  },
  noResults: {
    heading: 'No results to display',
    description: 'If you remove all input, this area will return to the tips view.',
  },
  languages: {
    'zh-CN': '中文',
    'en-US': 'English',
  },
  calculations: {
    equationFormatError: "Equation format is invalid. Use 'expression=expression'.",
    equationSolveFailed: 'Equation solving failed. Check the equation format.',
    equationInfiniteSolutions: 'Infinite solutions',
    equationNoSolution: 'No solution',
    equationPrefix: 'a = ',
  },
} satisfies Messages;

export default enUS;
