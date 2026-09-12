import { waitlist } from "@sluicy/db";
import { getDb } from "../db.js";

export async function joinWaitlist(input: { email: string; form: string; referrer: string }): Promise<{ ok: true } | { ok: false; message: string }> {
  const conn = getDb();
  if (!conn) {
    return { ok: false, message: "The waitlist isn't connected to a database yet. Email hello@sluicy.dev and we'll add you by hand." };
  }
  try {
    await conn
      .insert(waitlist)
      .values({ email: input.email, form: input.form, referrer: input.referrer })
      .onConflictDoNothing({ target: waitlist.email });
    return { ok: true };
  } catch (err) {
    console.error("waitlist insert failed", err);
    return { ok: false, message: "Couldn't save your spot. Give it a second and try again." };
  }
}
