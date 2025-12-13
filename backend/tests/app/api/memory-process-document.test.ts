import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

vi.mock('@/lib/auth', () => ({
  validateApiKey: vi.fn(async () => ({ id: 'user-1' })),
}))

const validateFileMock = vi.fn()
const processDocumentMock = vi.fn()
vi.mock('@/lib/document-processor', () => ({
  validateFile: validateFileMock,
  processDocument: processDocumentMock,
}))

describe('process-document route', () => {
  beforeEach(() => {
    vi.resetModules()
    validateFileMock.mockReset()
    processDocumentMock.mockReset()
  })

  it('returns 400 when schema validation fails', async () => {
    validateFileMock.mockReturnValue({ isValid: false, error: 'bad file' })
    const { POST } = await import('@/app/api/memory/process-document/route')

    const form = new FormData()
    // Missing chunkSize/processingMethod so UploadSchema fails
    form.append('file', new File(['abc'], 'bad.pdf'))

    const res = await POST({ formData: async () => form } as any)
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid parameters')
  })

  it('processes document and propagates project metadata', async () => {
    validateFileMock.mockReturnValue({ isValid: true, fileType: 'pdf' })
    processDocumentMock.mockResolvedValue({
      chunks: [{ content: 'text', metadata: { existing: true } }],
      stats: { totalChunks: 1 },
    })

    const { POST } = await import('@/app/api/memory/process-document/route')

    const form = new FormData()
    form.append('file', new File(['abc'], 'doc.pdf'))
    form.append('project', 'proj-1')
    form.append('chunkSize', '500')
    form.append('chunkOverlap', '10')
    form.append('processingMethod', 'recursive')

    const res = await POST({ formData: async () => form } as any)
    expect(res.status).toBe(200)
    expect(res.body.chunks[0].metadata.project).toBe('proj-1')
    expect(processDocumentMock).toHaveBeenCalled()
  })

  it('GET returns endpoint info', async () => {
    const { GET } = await import('@/app/api/memory/process-document/route')
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.body.supportedFormats).toContain('pdf')
  })
})
