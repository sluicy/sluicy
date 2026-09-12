import { useEffect, useState } from "react";
import { fetchMe, type Account } from "./api.js";

/** undefined while loading, null when signed out. */
export function useSession(): Account | null | undefined {
  const [account, setAccount] = useState<Account | null | undefined>(undefined);
  useEffect(() => {
    fetchMe().then(setAccount, () => setAccount(null));
  }, []);
  return account;
}
