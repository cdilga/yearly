import { describe, it, expect } from 'vitest';

describe('Yearly Worker', () => {
  it('should return HTML response for root path', async () => {
    const { default: worker } = await import('../../src/index.js');

    const request = new Request('http://localhost/');
    const response = await worker.fetch(request, {}, {});

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8');

    const html = await response.text();
    expect(html).toContain('Yearly');
    expect(html).toContain('Your year in dots');
  });

  it('should include year visualization elements', async () => {
    const { default: worker } = await import('../../src/index.js');

    const request = new Request('http://localhost/');
    const response = await worker.fetch(request, {}, {});
    const html = await response.text();

    // Check for key elements
    expect(html).toContain('id="yearTitle"');
    expect(html).toContain('id="dotGrid"');
    expect(html).toContain('id="daysLeft"');
    expect(html).toContain('id="percentage"');
  });

  it('should include JavaScript for calculations', async () => {
    const { default: worker } = await import('../../src/index.js');

    const request = new Request('http://localhost/');
    const response = await worker.fetch(request, {}, {});
    const html = await response.text();

    expect(html).toContain('calculateYearProgress');
    expect(html).toContain('renderDotGrid');
  });

  it('should include Tailwind CSS', async () => {
    const { default: worker } = await import('../../src/index.js');

    const request = new Request('http://localhost/');
    const response = await worker.fetch(request, {}, {});
    const html = await response.text();

    expect(html).toContain('tailwindcss.com');
  });

  it('should include animations', async () => {
    const { default: worker } = await import('../../src/index.js');

    const request = new Request('http://localhost/');
    const response = await worker.fetch(request, {}, {});
    const html = await response.text();

    expect(html).toContain('@keyframes');
    expect(html).toContain('fadeIn');
    expect(html).toContain('dotPop');
    expect(html).toContain('pulse');
  });

  it('should return 404 for unknown paths', async () => {
    const { default: worker } = await import('../../src/index.js');

    const request = new Request('http://localhost/unknown');
    const response = await worker.fetch(request, {}, {});

    expect(response.status).toBe(404);
  });

  it('should be mobile responsive', async () => {
    const { default: worker } = await import('../../src/index.js');

    const request = new Request('http://localhost/');
    const response = await worker.fetch(request, {}, {});
    const html = await response.text();

    expect(html).toContain('viewport');
    expect(html).toContain('md:');
  });
});
