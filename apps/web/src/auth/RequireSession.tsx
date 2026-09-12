import { createContext, useContext, type ReactNode } from "react";
import { Navigate } from "react-router";
import type { Account } from "./api.js";
import { useSession } from "./useSession.js";

const AccountContext = createContext<Account | null>(null);

/** Gate for signed-in routes. Children read the Account with useAccount(). */
export function RequireSession({ children }: { children: ReactNode }) {
  const account = useSession();
  if (account === undefined) return null;
  if (account === null) return <Navigate to="/sign-in" replace />;
  return <AccountContext.Provider value={account}>{children}</AccountContext.Provider>;
}

export function useAccount(): Account {
  const account = useContext(AccountContext);
  if (!account) throw new Error("useAccount() needs a RequireSession ancestor");
  return account;
}
