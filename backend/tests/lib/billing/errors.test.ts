import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  generateErrorId,
  createGenericErrorResponse,
  isPrismaUniqueConstraintError,
  isPrismaRecordNotFoundError,
  isOptimisticLockingConflict,
} from "@/lib/billing/errors"

describe("billing errors", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("generates error id prefix", () => {
    const id = generateErrorId()
    expect(id).toMatch(/^ERR-[A-F0-9]{8}$/)
  })

  it("creates generic response and logs", () => {
    const resp = createGenericErrorResponse(new Error("boom"), "u1", "checkout")
    expect(resp.errorId).toBeDefined()
    expect(resp.error).toContain("Unable to process")
  })

  it("detects prisma errors", () => {
    expect(isPrismaUniqueConstraintError({ code: "P2002" })).toBe(true)
    expect(isPrismaRecordNotFoundError({ code: "P2025" })).toBe(true)
    expect(isOptimisticLockingConflict({ code: "P2025" })).toBe(true)
  })
})
