import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function openRoute(page: Page, route = '/') {
  await page.goto(`.#${route}`)
  await expect(page.locator('main')).toBeVisible()
}

test.describe('public itinerary', () => {
  test('loads under the GitHub Pages base with meaningful navigation', async ({ page }) => {
    await openRoute(page)
    await expect(page).toHaveTitle(/(?:Southern Italy|Puglia|Naples|Italy)/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const visibleNavigation = page.locator('nav:visible').filter({ hasText: 'All days' }).first()
    await expect(visibleNavigation).toContainText(/All days/i)
    await expect(visibleNavigation).toContainText(/Map/i)
    await expect(visibleNavigation).toContainText(/Budget/i)
    await expect(visibleNavigation).toContainText(/Bookings/i)
  })

  for (const [route, heading] of [
    ['/map', /Map/i],
    ['/budget', /Budget/i],
    ['/bookings', /Bookings/i],
    ['/about', /About|Sources|Trip notes/i],
    ['/privacy', /Privacy/i],
    ['/terms', /Terms/i],
  ] as const) {
    test(`${route} is directly addressable through the hash router`, async ({ page }) => {
      await openRoute(page, route)
      await expect(page).toHaveURL(new RegExp(`#${route.replace('/', '\\/')}`))
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)
    })
  }

  test('birthday day has a complete celebratory plan and uncertainty labels', async ({ page }) => {
    await openRoute(page, '/day/2026-09-16')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/16|Birthday/i)
    await expect(page.locator('main')).toContainText(/birthday/i)
    await expect(page.locator('main')).toContainText(/boat|cooking/i)
    await expect(page.locator('main')).toContainText(/confirm|planned|inquiry|book/i)
  })

  test('budget identifies the two-person cap and exclusions', async ({ page }) => {
    await openRoute(page, '/budget')
    await expect(page.locator('main')).toContainText(/€\s?3[,.]?000|3[,.]?000\s?€/i)
    await expect(page.locator('main')).toContainText(/two|2 people|couple/i)
    await expect(page.locator('main')).toContainText(/flight|shopping/i)
  })

  test('booking page does not imply unpurchased reservations are confirmed', async ({ page }) => {
    await openRoute(page, '/bookings')
    await expect(page.locator('main')).toContainText(/needs|shortlist|planned|not booked|inquiry/i)
  })

  test('has no serious or critical automated accessibility findings', async ({ page }) => {
    for (const route of ['/', '/day/2026-09-16', '/map', '/budget', '/bookings']) {
      await openRoute(page, route)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
      const blocking = results.violations.filter(({ impact }) =>
        ['critical', 'serious'].includes(impact ?? ''),
      )
      expect(blocking, `${route}: ${JSON.stringify(blocking, null, 2)}`).toEqual([])
    }
  })

  test('avoids horizontal overflow at compact widths', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 })
    await openRoute(page)
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
  })

  test('external new-tab links are protected against opener access', async ({ page }) => {
    await openRoute(page, '/day/2026-09-16')
    const unsafeLinks = await page.locator('a[target="_blank"]').evaluateAll((links) =>
      links
        .filter((link) => !link.rel.split(/\s+/).includes('noopener'))
        .map((link) => link.getAttribute('href')),
    )
    expect(unsafeLinks).toEqual([])
  })

  test('uses the custom text-led interface and publishes policy links', async ({ page }) => {
    await openRoute(page)
    await expect(page.locator('svg.lucide')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible()
  })
})
