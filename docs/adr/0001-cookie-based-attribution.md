---
status: accepted
date: 2026-09-12
---

# Cookie-based attribution over cookieless

Sluicy's promise is "this person came from that post and became a Customer," often days after the click. Cookieless approaches (daily salted hashes as in Plausible and Datafast's cookieless mode, or ids carried only in the URL) cannot connect a click on Monday to a Signup on Thursday, so the default is a first-party cookie set server-side on the Product's own registrable domain through the SDK route. Server-set is required because Safari caps script-set cookies and storage at seven days, shorter than the 30-day attribution window.

## Considered options

- Cookieless daily hash: no consent question, but same-day attribution only. Deferred to a later opt-in mode with its limits stated on the Weekly Page.
- Script-set cookie: simpler install, but silently loses multi-day journeys on Safari.
- Server-set first-party cookie via the SDK route: chosen.

## Consequences

The SDK must mount a server route on the Product's domain before attribution works fully; the snippet never talks to a Sluicy domain. Founders in the EU may need a consent posture for the cookie; Sluicy documents the trade-off and does not give legal advice.
