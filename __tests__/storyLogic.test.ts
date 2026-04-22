import { sortStories, filterStories } from '../src/store/stories';
import { parseDomain } from '../src/utils/url';
import { Story } from '../src/api/types';

const s = (over: Partial<Story>): Story => ({
  id: 1,
  title: 'x',
  url: 'https://example.com/a',
  by: 'alice',
  score: 10,
  time: 1000,
  domain: 'example.com',
  ...over,
});

describe('sortStories', () => {
  it('sorts by score descending by default', () => {
    const input = [
      s({ id: 1, score: 5 }),
      s({ id: 2, score: 50 }),
      s({ id: 3, score: 20 }),
    ];
    expect(sortStories(input, 'score').map(x => x.id)).toEqual([2, 3, 1]);
  });

  it('sorts by time descending (newest first)', () => {
    const input = [
      s({ id: 1, time: 100 }),
      s({ id: 2, time: 300 }),
      s({ id: 3, time: 200 }),
    ];
    expect(sortStories(input, 'time').map(x => x.id)).toEqual([2, 3, 1]);
  });

  it('does not mutate the input array', () => {
    const input = [s({ id: 1, score: 5 }), s({ id: 2, score: 50 })];
    const before = input.map(x => x.id);
    sortStories(input, 'score');
    expect(input.map(x => x.id)).toEqual(before);
  });
});

describe('filterStories', () => {
  const items = [
    s({ id: 1, title: 'React Native wins', domain: 'rn.dev', by: 'alice' }),
    s({ id: 2, title: 'JSI explained', domain: 'blog.io', by: 'bob' }),
    s({ id: 3, title: 'Hermes engine', domain: 'fb.com', by: 'carol' }),
  ];

  it('returns all stories for empty query', () => {
    expect(filterStories(items, '').length).toBe(3);
    expect(filterStories(items, '   ').length).toBe(3);
  });

  it('is case-insensitive across title, domain, and author', () => {
    expect(filterStories(items, 'JSI').map(x => x.id)).toEqual([2]);
    expect(filterStories(items, 'rn.dev').map(x => x.id)).toEqual([1]);
    expect(filterStories(items, 'CAROL').map(x => x.id)).toEqual([3]);
  });

  it('returns empty when nothing matches', () => {
    expect(filterStories(items, 'nope')).toEqual([]);
  });
});

describe('parseDomain', () => {
  it('strips www and path', () => {
    expect(parseDomain('https://www.example.com/path?q=1')).toBe('example.com');
  });
  it('handles subdomains', () => {
    expect(parseDomain('https://blog.example.co.uk/')).toBe('blog.example.co.uk');
  });
  it('falls back for malformed URLs', () => {
    expect(parseDomain('not a url')).toBe('not a url');
  });
});
