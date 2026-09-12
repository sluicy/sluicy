import { describe, expect, it } from "vitest";
import { signInDecision } from "./policy.js";

describe("signInDecision (SPEC 10: first signup becomes owner, registration off by default)", () => {
  it("lets an existing Account in regardless of registration", () => {
    expect(signInDecision({ accountExists: true, instanceHasAccounts: true, registration: "closed" })).toBe("existing");
  });

  it("makes the very first signup on an instance the owner even when registration is closed", () => {
    expect(signInDecision({ accountExists: false, instanceHasAccounts: false, registration: "closed" })).toBe("owner");
  });

  it("refuses unknown emails once an owner exists and registration is closed", () => {
    expect(signInDecision({ accountExists: false, instanceHasAccounts: true, registration: "closed" })).toBeNull();
  });

  it("admits unknown emails as members when registration is open", () => {
    expect(signInDecision({ accountExists: false, instanceHasAccounts: true, registration: "open" })).toBe("member");
  });
});
