export function parseDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    const match = url.match(/^(?:https?:\/\/)?([^/?#]+)/i);
    return match ? match[1].replace(/^www\./, '') : url;
  }
}

export function faviconUrl(domain: string, size = 64): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    domain,
  )}&sz=${size}`;
}
