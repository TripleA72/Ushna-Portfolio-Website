import { test, expect } from '@playwright/test'
import photos from '../src/data/gallery.json' with { type: 'json' }

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
})

test('photographs open, navigate, trap focus, close and restore focus', async ({ page }) => {
  const trigger = page.locator('.hero-photo').first()
  await trigger.click()
  const viewer = page.getByRole('dialog', { name: 'Photograph viewer' })
  await expect(viewer).toBeVisible()
  const image = viewer.locator('img')
  const firstSource = await image.getAttribute('src')
  await page.keyboard.press('ArrowRight')
  await expect(image).not.toHaveAttribute('src', firstSource!)
  await page.keyboard.press('ArrowLeft')
  await expect(image).toHaveAttribute('src', firstSource!)
  for (let index = 0; index < 7; index++) await page.keyboard.press('Tab')
  expect(await viewer.evaluate(element => element.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(viewer).not.toBeVisible()
  await expect(trigger).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
})

test('category filters, pagination, and empty-free final collection work', async ({ page }) => {
  await page.getByRole('button', { name: /^Live music/ }).click()
  await expect(page.locator('.gallery-card')).toHaveCount(10)
  await expect(page.locator('.gallery-caption h3').first()).toHaveText('In the live moment')
  await expect(page.getByRole('button', { name: /^Live music/ })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: /^All photographs/ }).click()
  await expect(page.locator('.gallery-card')).toHaveCount(12)
  while (await page.getByRole('button', { name: 'A little more to see' }).count()) {
    await page.getByRole('button', { name: 'A little more to see' }).click()
  }
  await expect(page.locator('.gallery-card')).toHaveCount(85)
  await expect(page.getByText('Showing 85 of 85 photographs')).toBeVisible()
  const sources = await page.locator('.gallery-photo img').evaluateAll(images => images.map(image => image.getAttribute('src')))
  expect(new Set(sources).size).toBe(85)
})

test('hero opens after a category excludes its photograph', async ({ page }) => {
  await page.getByRole('button', { name: /^Live music/ }).click()
  await page.locator('.hero-photo').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('alt', 'A portrait in red beneath sandstone arches')
  await page.getByRole('button', { name: 'Close photograph viewer' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('responsive navigation and reduced motion remain usable', async ({ page, isMobile }) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.getByRole('heading', { name: 'USHNA MEHTAB.' })).toBeVisible()
  if (isMobile) {
    await page.getByRole('button', { name: 'Open navigation' }).click()
    await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true')
  }
  await page.getByRole('link', { name: /^The person/ }).click()
  await expect(page.getByRole('heading', { name: 'A storyteller. An observer. A little curious.' })).toBeInViewport()
  if (isMobile) await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false')
  expect(await page.locator('.gallery-grid').evaluate(element => getComputedStyle(element).animationName)).toBe('none')
  await page.getByText('My film & production background').click()
  await expect(page.getByText('Assistant Producer', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Download my résumé' })).toHaveAttribute('href', '/documents/ushna-mehtab-resume.pdf')
})

test('supplied assets, local fonts, and real contact links resolve', async ({ page, request }) => {
  const allImages = [...photos.flatMap(photo => [photo.src, photo.thumbnail]), '/images/ushna-portrait.webp']
  for (let index = 0; index < allImages.length; index += 12) {
    await Promise.all(allImages.slice(index, index + 12).map(async path => {
      const response = await request.get(path)
      expect(response.ok(), path).toBe(true)
      expect(response.headers()['content-type']).toContain('image/webp')
    }))
  }
  const resume = await request.get('/documents/ushna-mehtab-resume.pdf')
  expect(resume.ok()).toBe(true)
  expect((await resume.body()).subarray(0, 4).toString()).toBe('%PDF')
  await expect(page.locator('.email-group a')).toHaveAttribute('href', 'mailto:ushnamehtabsiddiqui01@gmail.com')
  await expect(page.locator('.phone-link')).toHaveAttribute('href', 'tel:+923302459922')
  expect(await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('16px "Instrument Serif"') })).toBe(true)
  await page.locator('.hero-photo').first().click()
  await expect(page.getByRole('link', { name: 'Original post' })).toHaveAttribute('href', 'https://www.instagram.com/p/Cjqf1DFLhrT/')
})

test('viewer supports touch swipes and wraparound navigation', async ({ page }) => {
  await page.getByRole('button', { name: /^Live music/ }).click()
  await page.locator('.gallery-photo').first().click()
  const image = page.getByRole('dialog').locator('img')
  await expect(page.getByRole('dialog')).toBeVisible()
  const initial = await image.getAttribute('src')
  await image.evaluate(element => {
    const start = new Touch({ identifier: 1, target: element, clientX: 250, clientY: 100 })
    const end = new Touch({ identifier: 1, target: element, clientX: 100, clientY: 100 })
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [start] }))
    element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [end] }))
  })
  await expect(image).not.toHaveAttribute('src', initial!)
  await page.getByRole('button', { name: 'Previous photograph' }).click()
  await expect(image).toHaveAttribute('src', initial!)
  await page.getByRole('button', { name: 'Previous photograph' }).click()
  await expect(page.getByText('10 / 10')).toBeVisible()
})
