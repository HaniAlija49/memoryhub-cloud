'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'

export default function TestSentryPage() {
  useEffect(() => {
    console.log('Sentry initialized:', !!window.Sentry)
    console.log('Environment:', process.env.NODE_ENV)
    console.log('NEXT_PUBLIC_OBSERVABILITY_ENABLED:', process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED)
  }, [])

  const testError = () => {
    console.log('Triggering test error...')
    Sentry.captureException(new Error('Test error from Sentry test page'))
    throw new Error('Test error - this should appear in Sentry!')
  }

  const testMessage = () => {
    console.log('Sending test message...')
    Sentry.captureMessage('Test message from Sentry test page', 'info')
    alert('Message sent to Sentry! Check your Sentry dashboard.')
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Sentry Test Page</h1>

        <div className="space-y-4">
          <div className="p-4 bg-surface rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Environment Info</h2>
            <p className="text-sm text-muted-foreground">
              Check browser console for environment details
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={testMessage}
              variant="outline"
              className="w-full"
            >
              Test Message (Safe - no error)
            </Button>

            <Button
              onClick={testError}
              variant="destructive"
              className="w-full"
            >
              Test Error (Will throw exception)
            </Button>
          </div>

          <div className="p-4 bg-surface rounded-lg text-sm">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Open browser DevTools Console</li>
              <li>Click "Test Message" button</li>
              <li>Check Sentry dashboard for the message</li>
              <li>If message appears, Sentry is working!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
