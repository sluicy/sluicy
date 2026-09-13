import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { api, type VerifyError } from "@/api/client";
import { Wordmark } from "@/components/wordmark";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const verifyMessages: Record<VerifyError, string> = {
  invalid: "That link isn't valid. Request a new one.",
  expired: "That link has expired. Request a new one.",
  used: "That link was already used. Request a new one.",
  closed: "Registration is closed on this Sluicy. Ask the owner for an invite.",
};

/** Sign-in and sign-up are one flow: the first verified email creates the Account. */
export function SignInPage() {
  const [params] = useSearchParams();
  const linkError = params.get("error") as VerifyError | null;
  const [email, setEmail] = useState("");
  const signIn = api.useMutation("post", "/v1/auth/sign-in");

  function submit(e: FormEvent) {
    e.preventDefault();
    signIn.mutate({ body: { email: email.trim().toLowerCase() } });
  }

  const error = signIn.isError
    ? "That email doesn't look right, or the mail couldn't be sent. Check it and try again."
    : linkError && linkError in verifyMessages && signIn.isIdle
      ? verifyMessages[linkError]
      : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-7 p-6">
      <Wordmark />
      <Card className="w-full max-w-md">
        {signIn.isSuccess ? (
          <>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Check your email</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Alert aria-live="polite">
                <AlertDescription>
                  If <strong className="text-foreground">{email}</strong> can sign in, a link is on its way. It works once and expires in 15 minutes.
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">
                Wrong address?{" "}
                <Button variant="link" className="h-auto p-0" onClick={() => signIn.reset()}>
                  Try another
                </Button>
              </p>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Sign in</CardTitle>
              <CardDescription>No password. We email you a link; the first sign-in creates your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  placeholder="you@yourproduct.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={signIn.isError || undefined}
                />
                <Button type="submit" size="lg" disabled={signIn.isPending}>
                  {signIn.isPending ? "Sending…" : "Email me a sign-in link"}
                </Button>
                {error ? (
                  <Alert variant="destructive" role="alert">
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                ) : null}
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}
