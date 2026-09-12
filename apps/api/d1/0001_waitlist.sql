-- Pre-launch waitlist on Cloudflare D1. Mirrors the Postgres table in @sluicy/db; export and import when moving to Hetzner.
create table if not exists waitlist (
  email text primary key,
  form text,
  referrer text,
  created_at text not null
);
