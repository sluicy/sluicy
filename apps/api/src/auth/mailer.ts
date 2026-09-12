import nodemailer from "nodemailer";
import type { Config } from "../config.js";

export type Mail = { to: string; subject: string; text: string };
export type Mailer = (mail: Mail) => Promise<void>;

/** SMTP is the baseline, Resend optional (SPEC 10). In development with neither, the mail is printed to the console. */
export function createMailer({ production, mail }: Pick<Config, "production" | "mail">): Mailer {
  if (mail.smtpUrl) {
    const transport = nodemailer.createTransport(mail.smtpUrl);
    return async (m) => {
      await transport.sendMail({ from: mail.from, ...m });
    };
  }
  if (mail.resendApiKey) {
    return async (m) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${mail.resendApiKey}`, "content-type": "application/json" },
        body: JSON.stringify({ from: mail.from, ...m }),
      });
      if (!res.ok) throw new Error(`resend responded ${res.status}: ${await res.text()}`);
    };
  }
  if (production) throw new Error("Sign-in is magic link only: set SMTP_URL or RESEND_API_KEY");
  return async (m) => {
    console.log(`\n[mail] to: ${m.to}\n[mail] subject: ${m.subject}\n${m.text}\n`);
  };
}
