import { describe, it, expect } from 'vitest'
import { BRAND } from '../config/brand'

describe('BRAND config', () => {
  it('has correct brand name', () => {
    expect(BRAND.name).toBe('NexusAI')
  })

  it('has short name', () => {
    expect(BRAND.shortName).toBe('nexusai')
  })

  it('has tagline', () => {
    expect(BRAND.tagline).toBeTruthy()
    expect(typeof BRAND.tagline).toBe('string')
  })

  it('has description', () => {
    expect(BRAND.description).toBeTruthy()
    expect(typeof BRAND.description).toBe('string')
  })

  it('has correct primary color', () => {
    expect(BRAND.colors.primary).toBe('#c8ff00')
  })

  it('has correct background color', () => {
    expect(BRAND.colors.bg).toBe('#03080a')
  })

  it('has navigation items', () => {
    expect(BRAND.nav.length).toBeGreaterThan(0)
    BRAND.nav.forEach(item => {
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('href')
    })
  })

  it('navigation includes key pages', () => {
    const labels = BRAND.nav.map(n => n.label)
    expect(labels).toContain('Models')
    expect(labels).toContain('Chat')
    expect(labels).toContain('Docs')
  })

  it('does not contain openrouter references', () => {
    const brandStr = JSON.stringify(BRAND).toLowerCase()
    expect(brandStr).not.toContain('openrouter')
  })
})
