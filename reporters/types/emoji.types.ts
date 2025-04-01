export interface EmojiSet {
  text: string;
  html: string;
}

export interface EmojiMap {
  [key: string]: EmojiSet;
}

export type TestStatus = 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted' | 'unknown'; 