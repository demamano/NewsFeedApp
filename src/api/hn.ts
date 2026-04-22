import axios, { AxiosInstance } from 'axios';
import { HnItem, Story, isValidStory } from './types';
import { parseDomain } from '../utils/url';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const DEFAULT_LIMIT = 20;
const DEFAULT_TIMEOUT_MS = 10_000;

function makeClient(): AxiosInstance {
  return axios.create({ baseURL: BASE_URL, timeout: DEFAULT_TIMEOUT_MS });
}

export class HnApi {
  constructor(private readonly client: AxiosInstance = makeClient()) {}

  async topStoryIds(limit = DEFAULT_LIMIT): Promise<number[]> {
    const res = await this.client.get<number[]>('/topstories.json');
    const ids = Array.isArray(res.data) ? res.data : [];
    return ids.slice(0, limit);
  }

  async item(id: number): Promise<HnItem | null> {
    const res = await this.client.get<HnItem | null>(`/item/${id}.json`);
    return res.data ?? null;
  }

  async topStories(limit = DEFAULT_LIMIT): Promise<Story[]> {
    const ids = await this.topStoryIds(limit);
    const items = await Promise.all(ids.map(id => this.item(id).catch(() => null)));
    const stories: Story[] = [];
    for (const item of items) {
      if (!isValidStory(item)) continue;
      stories.push({
        id: item.id,
        title: item.title,
        url: item.url,
        by: item.by,
        score: item.score,
        time: item.time,
        domain: parseDomain(item.url),
      });
    }
    return stories;
  }
}

export const hnApi = new HnApi();
