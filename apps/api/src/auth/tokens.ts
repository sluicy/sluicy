import { createHash, randomBytes } from "node:crypto";

/** Opaque secret handed to the browser (magic-link token, session id). Only its hash is ever stored. */
export function newSecret(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}
