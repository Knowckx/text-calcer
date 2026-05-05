export type Locale = 'zh-CN' | 'en-US';

export interface Messages {
  seo: {
    title: string;
    description: string;
    siteName: string;
  };
  actions: {
    clear: string;
    copyLine: string;
    copiedLine: string;
    language: string;
  };
  titles: {
    input: string;
    result: string;
    quickTips: string;
  };
  links: {
    github: string;
    blog: string;
  };
  placeholders: {
    formula: string;
  };
  notices: {
    cleared: string;
    copyFailed: string;
  };
  emptyState: {
    heading: string;
    description: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
  };
  noResults: {
    heading: string;
    description: string;
  };
  languages: {
    'zh-CN': string;
    'en-US': string;
  };
  calculations: {
    equationFormatError: string;
    equationSolveFailed: string;
    equationInfiniteSolutions: string;
    equationNoSolution: string;
    equationPrefix: string;
  };
}

export type MessageKey =
  | 'actions.clear'
  | 'actions.copyLine'
  | 'actions.copiedLine'
  | 'actions.language'
  | 'titles.input'
  | 'titles.result'
  | 'titles.quickTips'
  | 'placeholders.formula'
  | 'notices.cleared'
  | 'notices.copyFailed'
  | 'emptyState.heading'
  | 'emptyState.description'
  | 'emptyState.bullet1'
  | 'emptyState.bullet2'
  | 'emptyState.bullet3'
  | 'noResults.heading'
  | 'noResults.description'
  | 'languages.zh-CN'
  | 'languages.en-US'
  | 'calculations.equationFormatError'
  | 'calculations.equationSolveFailed'
  | 'calculations.equationInfiniteSolutions'
  | 'calculations.equationNoSolution'
  | 'calculations.equationPrefix';
