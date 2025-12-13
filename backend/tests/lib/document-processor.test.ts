import { describe, it, expect, vi, beforeEach } from "vitest"

const mockDocxExtract = vi.fn()

vi.mock("pdf2json", () => ({
  default: class PDFParser {
    on(event, cb) {
      if (event === "pdfParser_dataReady") this.ready = cb
      if (event === "pdfParser_dataError") this.err = cb
    }
    parseBuffer() {
      this.ready?.({
        Pages: [{ Texts: [{ R: [{ T: encodeURIComponent("hello world") }] }] }],
        Meta: { info: { Title: "Doc", Author: "Author" } },
      })
    }
  },
}))

vi.mock("mammoth", () => ({
  __esModule: true,
  default: {
    extractRawText: mockDocxExtract,
  },
}))

let docProcessor

beforeEach(async () => {
  vi.resetModules()
  vi.spyOn(console, "error").mockImplementation(() => {})
  mockDocxExtract.mockReset()
  docProcessor = await import("@/lib/document-processor")
})

describe("validateFile", () => {
  it("rejects oversized files", () => {
    const buf = Buffer.alloc(11)
    const result = docProcessor.validateFile(buf, "big.pdf", 10)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain("File size exceeds")
  })

  it("rejects unsupported extensions", () => {
    const buf = Buffer.from("hi")
    const result = docProcessor.validateFile(buf, "note.txt")
    expect(result.isValid).toBe(false)
    expect(result.error).toContain("Unsupported file type")
  })

  it("accepts pdf/docx with size under limit", () => {
    const buf = Buffer.from("ok")
    expect(docProcessor.validateFile(buf, "doc.pdf").isValid).toBe(true)
    expect(docProcessor.validateFile(buf, "doc.docx").isValid).toBe(true)
  })
})

describe("chunking helpers", () => {
  it("splits fixed size with overlap", () => {
    const chunks = docProcessor.fixedSizeSplit("abcdef", 4, 1)
    expect(chunks).toEqual(["abcd", "def"])
  })

  it("recursively splits respecting size", () => {
    const chunks = docProcessor.recursiveCharacterSplit("A sentence. Another sentence.", 10, 0)
    expect(chunks.every((c) => c.length <= 12)).toBe(true)
    expect(chunks.length).toBeGreaterThan(1)
  })
})

describe("processDocument", () => {
  it("processes pdf and returns chunks with metadata", async () => {
    const result = await docProcessor.processDocument(Buffer.from("file"), "file.pdf", {
      processingMethod: "fixed",
      chunkSize: 5,
      chunkOverlap: 1,
    })

    expect(result.chunks.length).toBeGreaterThan(0)
    expect(result.chunks[0].metadata.fileType).toBe("pdf")
    expect(result.stats.fileType).toBe("pdf")
  })

  it("throws when no text content extracted", async () => {
    mockDocxExtract.mockResolvedValue({ value: "   ", messages: [] })
    await expect(
      docProcessor.processDocument(Buffer.from("file"), "file.docx")
    ).rejects.toThrow("No text content found")
  })
})
