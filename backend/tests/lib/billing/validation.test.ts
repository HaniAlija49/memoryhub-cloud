import { describe, it, expect } from 'vitest'
import {
  CheckoutSessionSchema,
  UpdateSubscriptionSchema,
  CancelSubscriptionSchema,
  validateInput,
  safeValidateInput,
  formatValidationErrors,
} from '@/lib/billing/validation'

describe('billing validation schemas', () => {
  it('accepts valid checkout input', () => {
    const data = validateInput(CheckoutSessionSchema, { planId: 'starter', interval: 'monthly' })
    expect(data.planId).toBe('starter')
  })

  it('rejects invalid plan', () => {
    const result = safeValidateInput(CheckoutSessionSchema, { planId: 'free', interval: 'monthly' })
    expect(result.success).toBe(false)
  })

  it('parses cancel subscription flag', () => {
    const data = validateInput(CancelSubscriptionSchema, { immediate: 'true' })
    expect(data.immediate).toBe(true)
  })

  it('formats validation errors per field', () => {
    const invalid = safeValidateInput(UpdateSubscriptionSchema, { planId: 'free', interval: 'weekly' })
    if (!invalid.success) {
      const formatted = formatValidationErrors(invalid.errors)
      expect(formatted.fields.planId?.[0]).toContain('Invalid plan ID')
      expect(formatted.fields.interval?.[0]).toContain('Invalid interval')
    } else {
      throw new Error('expected validation to fail')
    }
  })
})
