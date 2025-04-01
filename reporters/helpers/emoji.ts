import { EmojiMap, TestStatus } from '../types/emoji.types';

const emojis: EmojiMap = {
  passed: { text: '✅', html: '✅' },
  failed: { text: '❌', html: '❌' },
  skipped: { text: '⏩', html: '⏩' },
  timedOut: { text: '⏰', html: '⏰' },
  interrupted: { text: '⚠️', html: '⚠️' },
  unknown: { text: '❓', html: '❓' }
};

export const getStatusEmoji = (status: TestStatus, isHtml: boolean = false): string => {
  return isHtml ? emojis[status]?.html || emojis.unknown.html : emojis[status]?.text || emojis.unknown.text;
}; 