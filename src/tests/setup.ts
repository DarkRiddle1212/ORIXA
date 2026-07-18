import { vi } from 'vitest';

// Mock ResizeObserver for charts and responsive canvas elements
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
global.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock EventSource for real-time SSE syncing
class MockEventSource {
  url: string;
  onopen: any = null;
  onmessage: any = null;
  onerror: any = null;
  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      if (this.onopen) this.onopen({});
    }, 10);
  }
  close() {}
}
global.EventSource = MockEventSource as any;

// Handle relative URLs in jsdom fetch environment
const originalFetch = global.fetch;
global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  let url = typeof input === 'string' ? input : input.toString();
  if (url.startsWith('/')) {
    url = `http://localhost:3000${url}`;
  }
  try {
    return await originalFetch(url, init);
  } catch (err) {
    // Fallback for mock responses during test runs
    return {
      ok: true,
      status: 200,
      json: async () => ({
        investigation_id: "silent-schema-disaster",
        summary: "Simulated schema drift anomaly detected across postgres nodes.",
        evidence: [
          { id: "ev-1", source: "Sentry-X", detail: "Deadlock detected during migration." }
        ],
        status: "PENDING_DECISION",
        audit_trail: []
      }),
      text: async () => "Mock response",
    } as any as Response;
  }
};
