import type { IMessageSource } from '@/types/message.types';

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'];

export function formatBytes(bytes?: number) {
  if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes <= 0)
    return '—';

  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }

  const precision = unit === 0 || value >= 10 ? 0 : 1;
  return `${value.toFixed(precision)} ${BYTE_UNITS[unit]}`;
}

export function formatRelativeTime(iso: string) {
  const seconds = Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 1000),
  );

  if (seconds < 60) return 'now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;

  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatAbsoluteTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatFileCount(count: number) {
  return `${count} ${count === 1 ? 'document' : 'documents'}`;
}

export function formatChatCount(count: number) {
  return `${count} ${count === 1 ? 'chat' : 'chats'}`;
}

export function formatPageText(source: IMessageSource) {
  let text = 'Page';

  if (source.page_start !== source.page_end) {
    text += 's ';
    text += `${source.page_start}-${source.page_end}`;
  } else {
    text += ' ' + source.page_start;
  }

  return text;
}

export function formatParagraphText(source: IMessageSource) {
  let text = 'Paragraph';

  if (source.paragraph_start !== source.paragraph_end) {
    text += 's ';
    text += `${source.paragraph_start}-${source.paragraph_end}`;
  } else {
    text += ' ' + source.paragraph_start;
  }

  return text;
}
