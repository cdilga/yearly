import { test, expect } from '@playwright/test';

test.describe('Yearly - Year Visualization', () => {
  test('should display the year and page title', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Yearly/);

    // Check year is displayed
    const yearTitle = page.locator('#yearTitle');
    await expect(yearTitle).toBeVisible();

    const currentYear = new Date().getFullYear().toString();
    await expect(yearTitle).toHaveText(currentYear);
  });

  test('should render the dot grid', async ({ page }) => {
    await page.goto('/');

    // Wait for dots to be rendered
    const dotGrid = page.locator('#dotGrid');
    await expect(dotGrid).toBeVisible();

    // Check that dots exist
    const dots = page.locator('.dot');
    const dotCount = await dots.count();

    // Should be 365 or 366 dots depending on leap year
    expect(dotCount).toBeGreaterThanOrEqual(365);
    expect(dotCount).toBeLessThanOrEqual(366);
  });

  test('should show days left and percentage', async ({ page }) => {
    await page.goto('/');

    // Check days left
    const daysLeft = page.locator('#daysLeft');
    await expect(daysLeft).toBeVisible();
    await expect(daysLeft).toContainText('d');

    // Check percentage
    const percentage = page.locator('#percentage');
    await expect(percentage).toBeVisible();
    await expect(percentage).toContainText('%');
  });

  test('should show minute-level detail', async ({ page }) => {
    await page.goto('/');

    const detail = page.locator('#detail');
    await expect(detail).toBeVisible();

    // Should show hours and minutes
    const detailText = await detail.textContent();
    expect(detailText).toMatch(/\d+h \d+m/);
  });

  test('should have filled and empty dots', async ({ page }) => {
    await page.goto('/');

    // Wait for dots to render
    await page.waitForSelector('.dot');

    // Check for filled dots (past days)
    const filledDots = page.locator('.dot-filled');
    const filledCount = await filledDots.count();
    expect(filledCount).toBeGreaterThan(0);

    // Check for empty dots (future days)
    const emptyDots = page.locator('.dot-empty');
    const emptyCount = await emptyDots.count();
    expect(emptyCount).toBeGreaterThan(0);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Should still render properly
    const yearTitle = page.locator('#yearTitle');
    await expect(yearTitle).toBeVisible();

    const dotGrid = page.locator('#dotGrid');
    await expect(dotGrid).toBeVisible();
  });

  test('should have animations', async ({ page }) => {
    await page.goto('/');

    // Check that dots have animation classes
    const dots = page.locator('.dot').first();
    await expect(dots).toHaveCSS('animation-name', /dotPop/);
  });

  test('should have gradient background', async ({ page }) => {
    await page.goto('/');

    const body = page.locator('body');
    const background = await body.evaluate((el) =>
      window.getComputedStyle(el).background
    );

    expect(background).toContain('gradient');
  });

  test('should show current dot with pulse animation', async ({ page }) => {
    await page.goto('/');

    // Check for current dot
    const currentDots = page.locator('.current-dot');
    const currentCount = await currentDots.count();

    // Should have exactly one current dot
    expect(currentCount).toBe(1);
  });
});
