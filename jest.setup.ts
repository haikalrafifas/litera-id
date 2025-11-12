// Try to load jest-dom if available
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@testing-library/jest-dom/extend-expect');
} catch (err) {
  // optional package not installed — ignore
}

// Polyfill TextEncoder / TextDecoder for environments (jsdom) that don't expose them
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const util = require('util');
  if (typeof (global as any).TextEncoder === 'undefined' && util && util.TextEncoder) {
    (global as any).TextEncoder = util.TextEncoder;
  }
  if (typeof (global as any).TextDecoder === 'undefined' && util && util.TextDecoder) {
    (global as any).TextDecoder = util.TextDecoder;
  }
} catch (e) {
  // ignore if util can't be required (very old node) — tests may still fail in that case
}

// Polyfill Response for Next.js server utilities
(global as any).Response = class Response {
  body: any;
  status: number;
  headers: Record<string, string>;

  constructor(body: any, options: any = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = options.headers || {};
  }
  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
};

// Simple global fetch mock for tests that call fetch
if (!(global as any).fetch) {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    })
  );
}
