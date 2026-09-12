export type Registration = "open" | "closed";

/**
 * Who may sign in (SPEC 10): existing Accounts always; the very first signup on an instance, who becomes owner;
 * anyone else only when registration is open. Returns the role the new Account would get, or null to refuse.
 */
export function signInDecision(input: { accountExists: boolean; instanceHasAccounts: boolean; registration: Registration }): "existing" | "owner" | "member" | null {
  if (input.accountExists) return "existing";
  if (!input.instanceHasAccounts) return "owner";
  if (input.registration === "open") return "member";
  return null;
}
