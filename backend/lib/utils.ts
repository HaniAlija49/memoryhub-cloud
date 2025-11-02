import { NextResponse } from 'next/server'

export function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message, status: 'error' },
    { status }
  )
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(
    { ...data, status: 'success' },
    { status }
  )
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeInput(input: string, maxLength: number = 10000): string {
  if (!input) return ''
  return input.slice(0, maxLength).trim()
}
