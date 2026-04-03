import { createHash } from "crypto"

export function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex")
}

export function generateAnonId(): string {
  const hex = createHash("sha256")
    .update(Math.random().toString() + Date.now().toString())
    .digest("hex")
    .slice(0, 6)
  return `Anon#${hex}`
}
