---
status: accepted
date: 2026-09-13
---

# Opportunities scan conversations through official APIs; drafting and scheduling stay outside

Measurement alone does not change what a founder does on Monday. The decision that drives everything else is where to post, so Sluicy adds Opportunities: live conversations on Reddit and Hacker News matching the Topics a Product earns from, ranked and delivered with the Brief to answer them. Answering one creates a Piece, which closes the loop: find, publish, measure, learn, find again.

The boundary is deliberate. Drafting stays with the founder or the founder's own agent through MCP, because drafting is commoditized, a drafting editor would put Sluicy against every ghostwriter tool, and the spec's promise is that the founder writes the words. Scheduling stays with Postiz, Typefully and Buffer through integrations, at least through the initial release, because it is months of platform APIs for no differentiation.

## Considered options

- Measurement and planning only (v0.2): rejected as a vitamin. Weekly engagement depends on the founder remembering to look.
- Full content operations suite, scanning plus drafting plus scheduling plus measuring: rejected. Three products for one maintainer, two of them already well served.
- Opportunities from official APIs only, drafting by agent, scheduling by integration: chosen.
- Scraping platforms without API access for wider coverage: rejected. Terms of service risk for a hosted product and for self-hosters, and it contradicts the non-goal on scraping.

## One product, Opportunities as the front door

Opportunities and the analytics are one product, not two. The ranking is the moat, and it needs the revenue data; split them and Opportunities is a keyword alert and the analytics is a vitamin again. What the two-product idea gets right is that Opportunities has value with nothing installed, so it becomes the front door: a new Account sees Opportunities within five minutes, and installing the snippet and connecting Stripe is the upgrade inside the product. One plan, one price.

## Consequences

Sources live behind one interface so X and LinkedIn can be added when their API cost is justified. Reddit API access for a hosted service polling for many Accounts is an open question; self-hosters may need their own Reddit app credentials. The Weekly Page caps Opportunities at five per week and reports the Signup rate of answers, so answering for volume shows up as Wasted rather than being rewarded. The MCP server gains `list_opportunities` and `claim_opportunity`. The hero promise on the landing page changes from measurement to the decision: where to post, and which posts pay.
