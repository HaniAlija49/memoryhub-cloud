import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TypeScript SDK - PersistQ',
  description: 'Complete guide for the PersistQ TypeScript/JavaScript SDK. Install, configure, and integrate persistent memory into your applications.',
}

export default function TypeScriptSDKLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
