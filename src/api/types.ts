export type HnItemType =
  | 'story'
  | 'comment'
  | 'job'
  | 'poll'
  | 'pollopt';

export interface HnItem {
  id: number;
  type: HnItemType;
  by?: string;
  time?: number;
  title?: string;
  url?: string;
  score?: number;
  descendants?: number;
  kids?: number[];
  text?: string;
  deleted?: boolean;
  dead?: boolean;
}

export interface Story {
  id: number;
  title: string;
  url: string;
  by: string;
  score: number;
  time: number;
  domain: string;
}

export function isValidStory(item: HnItem | null | undefined): item is HnItem & {
  title: string;
  url: string;
  by: string;
  score: number;
  time: number;
} {
  return (
    !!item &&
    item.type === 'story' &&
    !item.deleted &&
    !item.dead &&
    typeof item.title === 'string' &&
    typeof item.url === 'string' &&
    typeof item.by === 'string' &&
    typeof item.score === 'number' &&
    typeof item.time === 'number'
  );
}
