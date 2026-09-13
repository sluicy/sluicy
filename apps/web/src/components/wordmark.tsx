import { Link } from "react-router";
import { cn } from "@/lib/utils";

/** The Sluicy brand mark; links home. */
export function Wordmark({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("font-heading text-xl font-extrabold tracking-tight", className)}>
      Sluicy
    </Link>
  );
}
