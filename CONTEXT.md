# Sluicy

Growth analytics and a weekly planning loop for founders who market with content. This glossary holds the domain language; implementation decisions live in docs/adr.

## Language

### Tenancy

**Account**:
A Sluicy customer: the founder or team that signs in and pays Sluicy.
_Avoid_: Workspace, organization, tenant

**Product**:
One set of domains (root landing page plus app subdomain) and one payment provider connection owned by an Account. The unit of attribution and of the Weekly Page.
_Avoid_: Site, project, app

### People on the Product's side

**Visitor**:
An anonymous browser on a Product's domains, known by a first-party identifier.
_Avoid_: Session, anonymous user, lead

**User**:
A Visitor who has signed up on the Product and is known by the Product's own user id.
_Avoid_: Member, end user, account

**Customer**:
A User, or a pay-first buyer, with at least one successful payment.
_Avoid_: Subscriber, buyer, paying user

**Signup**:
The event that turns a Visitor into a User.
_Avoid_: Registration, identify, conversion

### Traffic

**Pageview**:
One page load by a Visitor, with its path, referrer, country and device class.
_Avoid_: Hit, view, event

**Touch**:
One arrival by a Visitor together with its Source. Each Visitor keeps a first Touch and a last Touch.
_Avoid_: Session, visit, click

**Source**:
Where a Touch came from: a Link, a referring domain, a UTM set, an AI assistant, or direct.
_Avoid_: Channel, referrer, medium

**Unattributed**:
A Signup or payment with no Touch inside the attribution window. A real category that is never redistributed.
_Avoid_: Unknown, other, direct

### Content

**Piece**:
One unit of published content: an article, post, answer, video or newsletter issue.
_Avoid_: Post, content, asset, campaign

**Placement**:
The platform a Piece was published on, from a closed list.
_Avoid_: Channel, network, platform

**Format**:
The kind of Piece, from a closed list: tutorial, story, announcement, answer, thread, video.
_Avoid_: Type, content type

**Link**:
A trackable URL to a page on the Product's own domains, bound to exactly one Piece. Exists as a tagged URL and optionally as a pretty redirect.
_Avoid_: Short link, UTM link, tracking link

**Cluster**:
The set of Pieces sharing a Placement and a Format. The unit the Weekly Page learns from.
_Avoid_: Segment, category, group

### The loop

**Ledger**:
The table of Pieces with their visits, Signups, Customers, revenue and retained revenue.
_Avoid_: Dashboard, report, analytics

**Weekly Page**:
The generated plan for one Product: earned, wasted, repeat, test, stop, with numbers and confidence.
_Avoid_: Digest, report, recommendations

**Brief**:
The angle, proven hook, call to action and evidence for one repeat or test. Never a drafted post.
_Avoid_: Draft, template, prompt

**Annotation**:
A dated note on a Product, such as a launch or a spike, used to flag confounded weeks.
_Avoid_: Event, marker, note
