import { formatDistanceToNowStrict, format } from 'date-fns';

export function relativeTime(unixSeconds: number): string {
  return formatDistanceToNowStrict(new Date(unixSeconds * 1000), {
    addSuffix: true,
  });
}

export function absoluteTime(unixSeconds: number): string {
  return format(new Date(unixSeconds * 1000), 'PPpp');
}
