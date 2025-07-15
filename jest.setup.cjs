if (typeof window !== 'undefined') {
  require('@testing-library/jest-dom');
  const { getComputedStyle } = window;
  window.getComputedStyle = (elt) => getComputedStyle(elt);
  window.HTMLElement.prototype.scrollIntoView = () => {};

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;

  // Conditional MSW bootstrap (opt-in / opt-out)
  const MSW_ENABLED = (process.env.MSW ?? 'on') !== 'off';
  if (MSW_ENABLED && !globalThis.__MSW_OFF__) {
    try {
      const { server } = require('./test-utils/msw/server');
      beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
      afterEach(() => server.resetHandlers());
      afterAll(() => server.close());
    } catch (err) {
      /* silent */
    }
  }
}
