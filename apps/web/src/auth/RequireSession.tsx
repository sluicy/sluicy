import { createContext, useContext, type ReactNode } from "react";
import { Navigate } from "react-router";
import { api, type Account } from "@/api/client";

const AccountContext = createContext<Account | null>(null);

/** Gate for signed-in routes. Children read the Account with useAccount(). A 401 means signed out, so no retries. */
export function RequireSession({ children }: { children: ReactNode }) {
  const me = api.useQuery("get", "/v1/auth/me", {}, { retry: false, staleTime: 5 * 60 * 1000 });
  if (me.isPending) return null;
  if (me.isError) return <Navigate to="/sign-in" replace />;
  return <AccountContext.Provider value={me.data}>{children}</AccountContext.Provider>;
}

export function useAccount(): Account {
  const account = useContext(AccountContext);
  if (!account) throw new Error("useAccount() needs a RequireSession ancestor");
  return account;
}
