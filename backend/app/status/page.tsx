async function getStatus() {
  try {
    const res = await fetch('http://localhost:3000/api/status', {
      cache: 'no-store',
    })
    const data = await res.json()
    return {
      isHealthy: data.status === 'healthy',
      timestamp: data.timestamp,
    }
  } catch (error) {
    return {
      isHealthy: false,
      timestamp: new Date().toISOString(),
    }
  }
}

export default async function StatusPage() {
  const { isHealthy, timestamp } = await getStatus()

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Back Link */}
        <div className="mb-8">
          <a href="/" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-center gap-6">
          <span className="relative flex h-16 w-16">
            {isHealthy && (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e0ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-16 w-16 bg-[#00e0ff]"></span>
              </>
            )}
            {!isHealthy && (
              <span className="relative inline-flex rounded-full h-16 w-16 bg-red-500"></span>
            )}
          </span>

          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {isHealthy ? 'All Systems Operational' : 'Service Degraded'}
            </h1>
            <p className="text-lg text-[#a1a1aa]">
              PersistQ API is {isHealthy ? 'running smoothly' : 'experiencing issues'}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <div className="pt-8">
          <p className="text-sm text-[#a1a1aa]">
            Last checked: {new Date(timestamp).toLocaleString()}
          </p>
        </div>

        {/* Support Info */}
        <div className="mt-12 p-6 rounded-lg border border-[#2a2a2a] bg-[#181818]/50">
          <p className="text-sm text-[#a1a1aa]">
            For detailed system information and monitoring,{' '}
            <a href="https://persistq.com/docs" className="text-[#00e0ff] hover:underline">
              view our documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
