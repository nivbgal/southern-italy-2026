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
    await expect(page.locator('main')).toContainText(/boat/i)
    await expect(page.locator('main')).toContainText(/Radimare/i)
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

  test('shows responsive destination photography with visible credits', async ({ page }) => {
    await openRoute(page)
    const hero = page.locator('img[data-photo-id="polignano"]')
    await expect(hero).toBeVisible()
    await expect(hero).toHaveAttribute('alt', /Polignano/i)
    await expect(page.locator('source[type="image/avif"]')).toHaveCount(1)
    await openRoute(page, '/about')
    await expect(page.locator('main')).toContainText('ParisTaras')
    await expect(page.locator('main')).toContainText('CC BY-SA 4.0')
  })

  test('shows all eight of Rinat’s saved places with honest rating labels', async ({ page }) => {
    await openRoute(page)
    await expect(page.locator('.personal-pick-list article')).toHaveCount(8)
    await expect(page.locator('.personal-pick-list')).toContainText('Bari Vecchia')
    await expect(page.locator('.personal-pick-list')).toContainText('Clarks Shop Bari')
    await expect(page.locator('.personal-pick-list')).toContainText('Cooking Class Pugliamare')
    await expect(page.locator('.personal-pick-list')).toContainText('Saved for another day')
    await expect(page.locator('.personal-pick-list')).toContainText('Lido Bambù')
    await expect(page.locator('.personal-pick-list')).toContainText('Il Quadrifoglio')
    await expect(page.locator('.personal-pick-list')).toContainText('ACQUASANTA')
    await expect(page.locator('.personal-pick-list')).toContainText('Marina Serra')
    await expect(page.locator('.personal-pick-list')).toContainText('Santa Maria al Bagno')

    await openRoute(page, '/map')
    await page.getByRole('button', { name: 'Show Rinat’s picks' }).click()
    await expect(page.locator('.venue-grid .venue-card')).toHaveCount(8)
    await expect(page.locator('.venue-grid')).toContainText('Rating 4 / 5')
    await expect(page.locator('.venue-grid')).toContainText('Rating 4.7 / 5 · 231 reviews · Checked 30 Aug 2026')
    await expect(page.locator('.venue-grid')).toContainText('No place rating listed · Checked 30 Aug 2026')
    await expect(page.locator('.venue-grid')).toContainText('No place rating listed · Checked 1 Sep 2026')
  })

  test('shows Bari as a planned stop before the Polignano sunset', async ({ page }) => {
    await openRoute(page, '/day/2026-09-15')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Bari Vecchia')
    await expect(page.locator('main')).toContainText('Basilica San Nicola')
    await expect(page.locator('main')).toContainText('Park outside Bari Vecchia')
    await expect(page.locator('main')).toContainText('19:02')
    await expect(page.locator('main')).toContainText('Skip Bari and drive to Polignano')
  })

  test('shows exact stay details and route links inside the daily timeline', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 })
    await openRoute(page, '/day/2026-09-15')

    const checkIn = page.locator('.timeline-item').filter({ hasText: 'Check in and reset' })
    await expect(checkIn).toContainText('Don Nicola Tourist Location')
    await expect(checkIn).toContainText('Via Dante Alighieri 1')
    await expect(checkIn.getByRole('link', { name: 'Open in Google Maps' })).toBeVisible()
    await expect(checkIn.getByRole('link', { name: 'Open Booking.com' })).toBeVisible()

    const drive = page.locator('.timeline-item').filter({ hasText: 'Drive NAP' })
    await expect(drive).toContainText('Naples Airport to Bari Vecchia')
    await expect(drive.getByRole('link', { name: 'Open route' })).toBeVisible()

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
  })
})
