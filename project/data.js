// ── Engineering Standards dataset ───────────────────────────────────────────
// Plain JS (no module) — exposed on window for the babel scripts.

const CATEGORIES = [
  { id: "security",   name: "Security",            blurb: "Protecting systems, data and customers.",        count: 0 },
  { id: "data",       name: "Data & Privacy",      blurb: "How we collect, store and govern data.",          count: 0 },
  { id: "reliability",name: "Reliability & SRE",   blurb: "Keeping services available and recoverable.",     count: 0 },
  { id: "frontend",   name: "Frontend",            blurb: "Web & client experience standards.",              count: 0 },
  { id: "services",   name: "Backend & APIs",      blurb: "Service contracts, APIs and integration.",        count: 0 },
  { id: "infra",      name: "Infrastructure",      blurb: "Cloud, networking and deployment.",               count: 0 },
  { id: "ai",         name: "AI & ML",             blurb: "Responsible model development and use.",          count: 0 },
  { id: "quality",    name: "Quality & Access",    blurb: "Testing, accessibility and inclusive design.",    count: 0 },
];

const TEAMS = [
  "Platform", "Payments", "Identity", "Data Platform", "Growth",
  "Mobile", "Infrastructure", "ML Systems", "Developer Experience",
];

// compliance: "must" | "should" | "may"
// status: "active" | "draft" | "deprecated"

const STANDARDS = [
  {
    id: "SEC-001",
    title: "Encrypt data in transit and at rest",
    category: "security",
    compliance: "must",
    status: "active",
    version: "3.2",
    updated: "2026-05-18",
    owner: { name: "Priya Nair", role: "Principal Security Engineer", team: "Identity", email: "security-standards@acme.dev" },
    appliesTo: ["Platform", "Payments", "Identity", "Data Platform", "Mobile", "Infrastructure"],
    summary:
      "All customer and internal data must be encrypted while moving across networks and while stored on disk, using current, approved algorithms.",
    impactHeadline:
      "One unencrypted database is the difference between a non-event and a front-page breach.",
    impact: [
      { stat: "$4.9M", label: "average cost of a breach we avoid per incident" },
      { stat: "0", label: "regulatory findings since adoption across regulated units" },
      { stat: "SOC 2 + ISO 27001", label: "controls satisfied by this single standard" },
    ],
    why:
      "Encryption is the cheapest insurance we buy. It turns a stolen laptop, a misconfigured bucket, or an intercepted request from a reportable breach into a non-issue. It is also a precondition for every enterprise deal in our pipeline, procurement teams will not sign without it, and it satisfies overlapping obligations under GDPR, SOC 2, and ISO 27001 at once, so meeting it once clears several audits.",
    practice: [
      "TLS 1.2+ for all network traffic; TLS 1.3 preferred for new services.",
      "AES-256 (or approved equivalent) for data at rest, including backups and snapshots.",
      "Keys managed in the central KMS, never hard-coded or stored alongside data.",
      "Disable deprecated ciphers (SSLv3, TLS 1.0/1.1, RC4) at the load balancer.",
    ],
    related: ["SEC-004", "DATA-002", "INFRA-001"],
    exceptions:
      "Legacy systems unable to support TLS 1.2 may request a time-boxed exception (max 90 days) with a compensating control and a documented remediation date, approved by the Security guild.",
    history: [
      { v: "3.2", date: "2026-05-18", note: "Added backup/snapshot encryption requirement." },
      { v: "3.0", date: "2025-11-02", note: "Raised minimum to TLS 1.2; deprecated TLS 1.0/1.1." },
      { v: "2.1", date: "2025-03-14", note: "Centralised key management in KMS." },
    ],
  },
  {
    id: "SEC-004",
    title: "Multi-factor authentication for all privileged access",
    category: "security",
    compliance: "must",
    status: "active",
    version: "2.0",
    updated: "2026-04-09",
    owner: { name: "Marcus Webb", role: "Security Architect", team: "Identity", email: "security-standards@acme.dev" },
    appliesTo: ["Platform", "Identity", "Infrastructure", "Developer Experience"],
    summary:
      "Any access to production systems, source control, or customer data requires phishing-resistant multi-factor authentication.",
    impactHeadline:
      "Over 80% of breaches start with a stolen password. MFA closes that door.",
    impact: [
      { stat: "99.9%", label: "of automated credential attacks blocked by MFA" },
      { stat: "12 min", label: "median onboarding time with hardware keys" },
      { stat: "Cyber-insurance", label: "premium tier unlocked by enforcing this" },
    ],
    why:
      "Passwords leak constantly, through reuse, phishing, and third-party breaches we don't control. MFA, especially phishing-resistant hardware keys, neutralises the single most common attack path against us. Beyond risk, our cyber-insurance carrier now prices premiums on MFA coverage, so full enforcement directly lowers a line item on the company P&L.",
    practice: [
      "Hardware security keys (FIDO2/WebAuthn) for all engineers with production access.",
      "TOTP acceptable only as a fallback, never SMS.",
      "Re-authentication required for break-glass and root-equivalent actions.",
    ],
    related: ["SEC-001", "INFRA-003"],
    exceptions:
      "Service accounts use scoped, rotated credentials in the secrets manager in lieu of MFA, reviewed quarterly.",
    history: [
      { v: "2.0", date: "2026-04-09", note: "Mandated phishing-resistant keys; removed SMS." },
      { v: "1.0", date: "2025-01-20", note: "Initial publication." },
    ],
  },
  {
    id: "DATA-002",
    title: "Classify and label all data by sensitivity",
    category: "data",
    compliance: "must",
    status: "active",
    version: "1.4",
    updated: "2026-03-30",
    owner: { name: "Sofia Reyes", role: "Head of Data Governance", team: "Data Platform", email: "data-gov@acme.dev" },
    appliesTo: ["Data Platform", "Payments", "Growth", "ML Systems"],
    summary:
      "Every dataset must carry a sensitivity label (Public, Internal, Confidential, Restricted) that drives how it can be accessed, shared and retained.",
    impactHeadline:
      "You can't protect, or delete, what you can't find. Classification makes data governable.",
    impact: [
      { stat: "30 days", label: "to fulfil a data-subject deletion request, reliably" },
      { stat: "−60%", label: "reduction in over-broad access grants" },
      { stat: "Audit-ready", label: "evidence produced automatically for regulators" },
    ],
    why:
      "When a regulator or customer asks 'where is my data and who can see it?', a labelled estate answers in minutes instead of weeks. Classification is the foundation that makes retention, access control, and the right-to-be-forgotten actually enforceable, and it shrinks our breach blast radius by keeping Restricted data out of low-trust systems.",
    practice: [
      "Label at creation; unlabelled data defaults to Confidential.",
      "Restricted data (PII, payment, health) may not leave approved stores.",
      "Labels propagate through pipelines and into the data catalog.",
    ],
    related: ["SEC-001", "DATA-005"],
    exceptions:
      "Short-lived analytics scratch space is exempt for up to 14 days, after which data must be labelled or purged.",
    history: [
      { v: "1.4", date: "2026-03-30", note: "Added automatic propagation through pipelines." },
      { v: "1.0", date: "2025-06-11", note: "Initial publication." },
    ],
  },
  {
    id: "DATA-005",
    title: "Define a retention period for every dataset",
    category: "data",
    compliance: "should",
    status: "active",
    version: "1.1",
    updated: "2026-02-12",
    owner: { name: "Sofia Reyes", role: "Head of Data Governance", team: "Data Platform", email: "data-gov@acme.dev" },
    appliesTo: ["Data Platform", "Growth", "ML Systems"],
    summary:
      "Each dataset should declare how long it is kept and what happens at end of life, so data isn't retained indefinitely by default.",
    impactHeadline:
      "Data you no longer need is pure liability, storage cost today, breach exposure tomorrow.",
    impact: [
      { stat: "$310K/yr", label: "storage reclaimed in the first year" },
      { stat: "Lower", label: "legal exposure in discovery and disputes" },
    ],
    why:
      "Holding data 'just in case' quietly accrues cost and risk. Clear retention shrinks our storage bill, limits what can be exposed in a breach, and keeps us from producing years of irrelevant data in litigation. It also signals to customers that we are deliberate stewards of their information.",
    practice: [
      "Declare retention in the data catalog at dataset creation.",
      "Automate deletion or archival at end of life where possible.",
    ],
    related: ["DATA-002"],
    exceptions:
      "Data under legal hold is retained until the hold is lifted, regardless of policy.",
    history: [
      { v: "1.1", date: "2026-02-12", note: "Added archival tier guidance." },
      { v: "1.0", date: "2025-09-01", note: "Initial publication." },
    ],
  },
  {
    id: "REL-001",
    title: "Every service defines SLOs and an error budget",
    category: "reliability",
    compliance: "must",
    status: "active",
    version: "2.3",
    updated: "2026-05-02",
    owner: { name: "Dan Osei", role: "SRE Lead", team: "Platform", email: "sre-guild@acme.dev" },
    appliesTo: ["Platform", "Payments", "Identity", "Infrastructure", "Mobile"],
    summary:
      "Production services must publish Service Level Objectives and track an error budget that governs the balance between shipping features and protecting reliability.",
    impactHeadline:
      "SLOs turn 'is it down?' arguments into a shared number everyone can act on.",
    impact: [
      { stat: "−42%", label: "Sev-1 incidents year over year" },
      { stat: "$1.2M", label: "revenue protected during peak by error-budget freezes" },
      { stat: "Faster", label: "feature velocity when budget is healthy" },
    ],
    why:
      "Reliability is a feature customers pay for and notice when it's gone. Error budgets give teams an objective, pre-agreed rule for when to push features and when to stabilise, replacing politics with data. They also let leadership trade reliability against velocity intentionally instead of discovering the cost during an outage.",
    practice: [
      "Publish availability and latency SLOs per user-facing service.",
      "Burn-rate alerts page before the budget is exhausted, not after.",
      "Exhausted budget triggers a feature freeze until reliability recovers.",
    ],
    related: ["REL-003", "INFRA-001"],
    exceptions:
      "Internal tools with no external SLA may track a single availability SLO only.",
    history: [
      { v: "2.3", date: "2026-05-02", note: "Standardised burn-rate alerting thresholds." },
      { v: "2.0", date: "2025-10-15", note: "Introduced error-budget-based feature freezes." },
      { v: "1.0", date: "2025-02-01", note: "Initial publication." },
    ],
  },
  {
    id: "REL-003",
    title: "Blameless post-incident reviews within 5 business days",
    category: "reliability",
    compliance: "should",
    status: "active",
    version: "1.2",
    updated: "2026-01-28",
    owner: { name: "Dan Osei", role: "SRE Lead", team: "Platform", email: "sre-guild@acme.dev" },
    appliesTo: ["Platform", "Payments", "Infrastructure", "Mobile"],
    summary:
      "Every significant incident should get a written, blameless review with action items and an owner, completed within five business days.",
    impactHeadline:
      "An incident you don't learn from, you pay for twice.",
    impact: [
      { stat: "3×", label: "more repeat incidents on systems without reviews" },
      { stat: "Trust", label: "blameless culture keeps reporting honest and fast" },
    ],
    why:
      "The most expensive incident is the one that recurs. Blameless reviews surface the systemic causes (not the scapegoats) so we fix the conditions that produced the failure. Keeping them blameless is what keeps engineers reporting problems early instead of hiding them until they explode.",
    practice: [
      "Document timeline, impact, root causes and contributing factors.",
      "Each action item has a single owner and a due date.",
      "Share the review broadly; never name individuals as causes.",
    ],
    related: ["REL-001"],
    exceptions: "Sev-3 and below may use a lightweight template at the team's discretion.",
    history: [
      { v: "1.2", date: "2026-01-28", note: "Tightened completion window to 5 days." },
      { v: "1.0", date: "2025-04-22", note: "Initial publication." },
    ],
  },
  {
    id: "API-002",
    title: "Version public APIs and never break consumers silently",
    category: "services",
    compliance: "must",
    status: "active",
    version: "2.1",
    updated: "2026-04-25",
    owner: { name: "Lena Hoffmann", role: "Principal Engineer, APIs", team: "Platform", email: "api-guild@acme.dev" },
    appliesTo: ["Platform", "Payments", "Identity", "Growth"],
    summary:
      "Public and partner-facing APIs must be explicitly versioned, with backward-compatible changes only inside a version and a published deprecation path.",
    impactHeadline:
      "A silent breaking change is an outage you ship to your customers on purpose.",
    impact: [
      { stat: "0", label: "partner-facing breakages since enforcement" },
      { stat: "−70%", label: "support tickets from integration partners" },
      { stat: "Trust", label: "partners build on us because we don't surprise them" },
    ],
    why:
      "Every partner integration is a promise. Breaking an API without warning damages relationships we spent years building and floods support with avoidable tickets. Disciplined versioning lets us evolve quickly while giving consumers a predictable, well-signposted path to follow, which is itself a competitive advantage in partner deals.",
    practice: [
      "Major version in the URL or header; additive changes only within a version.",
      "Deprecations announced with a minimum 6-month window and migration guide.",
      "Contract tests gate releases against the published schema.",
    ],
    related: ["API-004", "REL-001"],
    exceptions:
      "Internal-only APIs may evolve faster by agreement between producer and all consumers.",
    history: [
      { v: "2.1", date: "2026-04-25", note: "Added contract-test gating requirement." },
      { v: "2.0", date: "2025-08-30", note: "Standardised 6-month deprecation windows." },
      { v: "1.0", date: "2025-01-15", note: "Initial publication." },
    ],
  },
  {
    id: "API-004",
    title: "Document every endpoint with an OpenAPI schema",
    category: "services",
    compliance: "should",
    status: "active",
    version: "1.0",
    updated: "2026-05-29",
    owner: { name: "Lena Hoffmann", role: "Principal Engineer, APIs", team: "Platform", email: "api-guild@acme.dev" },
    appliesTo: ["Platform", "Growth", "Developer Experience"],
    summary:
      "Services should ship a machine-readable OpenAPI description that stays in sync with the running code.",
    impactHeadline:
      "Documentation that drifts from reality is worse than none, schemas keep them honest.",
    impact: [
      { stat: "Days→hours", label: "partner integration time with generated SDKs" },
      { stat: "Self-serve", label: "fewer engineer hours answering 'how do I call this?'" },
    ],
    why:
      "A current OpenAPI schema is a force multiplier: it generates client SDKs, powers interactive docs, and lets partners self-serve instead of filing tickets. Generating it from code means it never silently drifts out of date, the most common and most damaging failure mode of hand-written docs.",
    practice: [
      "Generate the schema from code, not by hand.",
      "Publish to the central developer portal on every release.",
    ],
    related: ["API-002"],
    exceptions: "Internal experimental endpoints may defer documentation until promotion to beta.",
    history: [
      { v: "1.0", date: "2026-05-29", note: "Initial publication." },
    ],
  },
  {
    id: "FE-003",
    title: "Meet WCAG 2.2 AA accessibility on all user-facing UI",
    category: "quality",
    compliance: "must",
    status: "active",
    version: "1.3",
    updated: "2026-03-05",
    owner: { name: "Aisha Khan", role: "Staff Frontend Engineer", team: "Mobile", email: "frontend-guild@acme.dev" },
    appliesTo: ["Mobile", "Growth", "Platform", "Developer Experience"],
    summary:
      "All customer-facing interfaces must meet WCAG 2.2 Level AA, so the product is usable with assistive technology, keyboards, and a range of vision and motor abilities.",
    impactHeadline:
      "Accessibility isn't a feature for a few, it's the law, a market, and just better engineering.",
    impact: [
      { stat: "1 in 6", label: "people worldwide live with a disability, that's market reach" },
      { stat: "ADA / EAA", label: "legal exposure removed in the US and EU" },
      { stat: "Better for all", label: "captions, contrast and keyboard help everyone" },
    ],
    why:
      "Inaccessible products exclude a sixth of the population and expose us to real legal action under the ADA and the European Accessibility Act. But the upside is bigger than the downside: accessible engineering, semantic markup, keyboard support, sufficient contrast, produces interfaces that are faster, more robust, and easier for everyone, including users on bad networks and small screens.",
    practice: [
      "Keyboard operable end-to-end; visible focus states everywhere.",
      "4.5:1 text contrast; never rely on colour alone to convey meaning.",
      "Automated checks in CI plus manual screen-reader testing for key flows.",
    ],
    related: ["FE-005"],
    exceptions:
      "Internal admin tools target AA but may phase in over two quarters with a tracked plan.",
    history: [
      { v: "1.3", date: "2026-03-05", note: "Upgraded target from WCAG 2.1 to 2.2 AA." },
      { v: "1.0", date: "2025-05-19", note: "Initial publication." },
    ],
  },
  {
    id: "FE-005",
    title: "Ship a performance budget for every web page",
    category: "frontend",
    compliance: "should",
    status: "active",
    version: "1.0",
    updated: "2026-02-20",
    owner: { name: "Aisha Khan", role: "Staff Frontend Engineer", team: "Mobile", email: "frontend-guild@acme.dev" },
    appliesTo: ["Mobile", "Growth"],
    summary:
      "Key pages should set and enforce a performance budget (size and Core Web Vitals) so speed doesn't quietly regress over time.",
    impactHeadline:
      "Every 100ms of latency is measurable revenue walking out the door.",
    impact: [
      { stat: "+1%", label: "conversion for every 100ms faster on checkout" },
      { stat: "SEO", label: "Core Web Vitals directly affect search ranking" },
    ],
    why:
      "Speed is conversion. Slow pages lose customers before they ever see the product, and search engines now rank on Core Web Vitals, so performance is also acquisition. A budget enforced in CI stops the slow, invisible bloat that otherwise creeps in one library at a time.",
    practice: [
      "Define budgets for JS size, LCP and INP per critical page.",
      "Fail the build when a budget is exceeded.",
    ],
    related: ["FE-003"],
    exceptions: "Marketing campaign pages may exceed budgets for a fixed campaign window.",
    history: [
      { v: "1.0", date: "2026-02-20", note: "Initial publication." },
    ],
  },
  {
    id: "INFRA-001",
    title: "Provision all infrastructure as code",
    category: "infra",
    compliance: "must",
    status: "active",
    version: "2.2",
    updated: "2026-04-14",
    owner: { name: "Tomás Vidal", role: "Head of Infrastructure", team: "Infrastructure", email: "infra-guild@acme.dev" },
    appliesTo: ["Infrastructure", "Platform", "Payments", "ML Systems"],
    summary:
      "Cloud resources must be created and changed through version-controlled infrastructure-as-code, never by manual console changes.",
    impactHeadline:
      "Click-ops can't be reviewed, reproduced, or rolled back. Code can.",
    impact: [
      { stat: "Minutes", label: "to rebuild an environment from scratch after a failure" },
      { stat: "−85%", label: "config-drift incidents after adoption" },
      { stat: "Auditable", label: "every change reviewed and attributable" },
    ],
    why:
      "Manual cloud changes are invisible, unreviewable, and impossible to reproduce, the root cause of a huge share of outages and surprise bills. Infrastructure as code makes every change a reviewed, version-controlled artifact, so we can rebuild any environment on demand, recover from disasters in minutes, and prove to auditors exactly what changed and why.",
    practice: [
      "All resources defined in Terraform/Pulumi and applied via CI.",
      "Console access is read-only in production except for break-glass.",
      "Drift detection runs continuously and alerts on divergence.",
    ],
    related: ["INFRA-003", "SEC-001", "REL-001"],
    exceptions:
      "Break-glass console changes are permitted during incidents and must be codified within 48 hours.",
    history: [
      { v: "2.2", date: "2026-04-14", note: "Added continuous drift detection." },
      { v: "2.0", date: "2025-09-10", note: "Made production console read-only." },
      { v: "1.0", date: "2025-03-01", note: "Initial publication." },
    ],
  },
  {
    id: "INFRA-003",
    title: "Tag every cloud resource with owner and cost center",
    category: "infra",
    compliance: "should",
    status: "active",
    version: "1.1",
    updated: "2026-01-10",
    owner: { name: "Tomás Vidal", role: "Head of Infrastructure", team: "Infrastructure", email: "infra-guild@acme.dev" },
    appliesTo: ["Infrastructure", "Platform", "ML Systems", "Data Platform"],
    summary:
      "Every cloud resource should carry tags identifying its owning team, cost center and environment.",
    impactHeadline:
      "Untagged spend is spend nobody is accountable for, and it always grows.",
    impact: [
      { stat: "$540K/yr", label: "waste found and cut once spend was attributable" },
      { stat: "100%", label: "of spend traceable to a team for budgeting" },
    ],
    why:
      "When cloud cost can't be attributed, nobody owns it and it balloons. Consistent tagging turns the monthly bill into per-team accountability, makes idle resources visible, and lets finance forecast accurately instead of guessing. It's the smallest possible change with an outsized impact on the bottom line.",
    practice: [
      "Required tags: owner, cost-center, environment, data-classification.",
      "Untagged resources are flagged and, after grace, deprovisioned.",
    ],
    related: ["INFRA-001", "DATA-002"],
    exceptions: "Shared platform resources use a designated platform cost-center tag.",
    history: [
      { v: "1.1", date: "2026-01-10", note: "Added data-classification tag." },
      { v: "1.0", date: "2025-07-08", note: "Initial publication." },
    ],
  },
  {
    id: "AI-001",
    title: "Human review before AI output reaches customers",
    category: "ai",
    compliance: "must",
    status: "active",
    version: "1.1",
    updated: "2026-05-25",
    owner: { name: "Grace Liu", role: "Head of ML Systems", team: "ML Systems", email: "ml-guild@acme.dev" },
    appliesTo: ["ML Systems", "Growth", "Platform"],
    summary:
      "Customer-facing decisions or content produced by AI models must have a defined human-review or appeal path before they take material effect.",
    impactHeadline:
      "A model's mistake is the company's mistake, keep a human in the loop where it matters.",
    impact: [
      { stat: "Brand", label: "one viral bad output can undo years of trust" },
      { stat: "EU AI Act", label: "alignment with emerging regulation, ahead of deadline" },
    ],
    why:
      "Models are powerful but confidently wrong in ways that can harm customers and the brand. For high-stakes decisions (eligibility, moderation, financial actions) a human checkpoint or appeal route protects customers, limits our liability, and keeps us ahead of regulation like the EU AI Act rather than scrambling to comply later.",
    practice: [
      "Classify each AI use by risk; high-risk uses require human review.",
      "Provide a visible appeal/override path for affected users.",
      "Log model version and inputs for every consequential decision.",
    ],
    related: ["AI-003", "DATA-002"],
    exceptions:
      "Low-risk uses (e.g. drafting suggestions a human accepts) need disclosure but not pre-review.",
    history: [
      { v: "1.1", date: "2026-05-25", note: "Added decision-logging requirement." },
      { v: "1.0", date: "2026-01-30", note: "Initial publication." },
    ],
  },
  {
    id: "AI-003",
    title: "Evaluate models for bias before and after deployment",
    category: "ai",
    compliance: "should",
    status: "draft",
    version: "0.3",
    updated: "2026-06-01",
    owner: { name: "Grace Liu", role: "Head of ML Systems", team: "ML Systems", email: "ml-guild@acme.dev" },
    appliesTo: ["ML Systems"],
    summary:
      "Models affecting people should be tested for disparate impact across protected groups, both before launch and continuously in production.",
    impactHeadline:
      "A biased model scales unfairness at machine speed, measure it before it ships.",
    impact: [
      { stat: "Fairness", label: "demonstrable equity across user groups" },
      { stat: "Defensible", label: "evidence if a decision is ever challenged" },
    ],
    why:
      "Bias in a model isn't a one-off error, it's systematic harm applied to everyone it touches. Measuring disparate impact protects customers from unfair outcomes and gives us defensible evidence if a decision is ever challenged. Continuous monitoring catches drift, because a model fair at launch can become unfair as the world changes.",
    practice: [
      "Define protected groups and fairness metrics per use case.",
      "Gate launch on agreed thresholds; monitor in production.",
    ],
    related: ["AI-001"],
    exceptions: "Draft, exceptions process to be finalised before promotion to active.",
    history: [
      { v: "0.3", date: "2026-06-01", note: "Open for guild review." },
      { v: "0.1", date: "2026-04-18", note: "Initial draft." },
    ],
  },
  {
    id: "SEC-009",
    title: "Store secrets in the central secrets manager",
    category: "security",
    compliance: "must",
    status: "active",
    version: "1.2",
    updated: "2026-02-28",
    owner: { name: "Marcus Webb", role: "Security Architect", team: "Identity", email: "security-standards@acme.dev" },
    appliesTo: ["Platform", "Payments", "Identity", "Infrastructure", "Developer Experience"],
    summary:
      "API keys, tokens and credentials must live in the central secrets manager, never in source code, config files, or environment files committed to a repo.",
    impactHeadline:
      "A secret in a Git history is a secret you've already lost.",
    impact: [
      { stat: "Hours→never", label: "secrets that used to leak via repos, now don't" },
      { stat: "Instant", label: "rotation when a credential is suspected compromised" },
    ],
    why:
      "Credentials committed to source control leak constantly (through forks, public mirrors, and laptops) and live forever in history. Centralising secrets means they can be rotated instantly, access can be revoked in one place, and we get an audit trail of who used what. It removes an entire category of self-inflicted breaches.",
    practice: [
      "No secrets in code, config, or CI logs, scanned and blocked in CI.",
      "Inject secrets at runtime from the manager with short-lived leases.",
      "Rotate on a schedule and immediately on suspected compromise.",
    ],
    related: ["SEC-001", "SEC-004"],
    exceptions: "Local development may use a developer vault profile, never shared credentials.",
    history: [
      { v: "1.2", date: "2026-02-28", note: "Added CI secret scanning." },
      { v: "1.0", date: "2025-06-30", note: "Initial publication." },
    ],
  },
  {
    id: "REL-007",
    title: "Test restore from backups quarterly",
    category: "reliability",
    compliance: "should",
    status: "deprecated",
    version: "1.0",
    updated: "2025-12-01",
    owner: { name: "Dan Osei", role: "SRE Lead", team: "Platform", email: "sre-guild@acme.dev" },
    appliesTo: ["Platform", "Infrastructure", "Data Platform"],
    summary:
      "Teams should perform and document a full restore-from-backup test every quarter to prove backups actually work.",
    impactHeadline:
      "A backup you've never restored is a hope, not a plan.",
    impact: [
      { stat: "Proven", label: "recovery, not assumed recovery" },
    ],
    why:
      "Superseded by REL-001's broader recoverability requirements, which fold backup-restore testing into error-budget and disaster-recovery objectives. Retained here for historical reference.",
    practice: [
      "Perform a documented full restore each quarter.",
      "Record restore time and any gaps; feed into DR planning.",
    ],
    related: ["REL-001"],
    exceptions: "Deprecated, see REL-001 for current guidance.",
    history: [
      { v: "1.0", date: "2025-12-01", note: "Deprecated in favour of REL-001." },
    ],
  },
];

// ── Enterprise enablers — the capability catalog ────────────────────────────
// The paved / golden path. Adopt a capability and you are compliant by construction.
// Each capability has an owner, a description of what it does, and the standards
// it helps you meet (with the coverage it provides for each).
// type: "Platform" | "Service" | "Library" | "Template"
const ENABLERS = [
  {
    id: "service-mesh",
    name: "Paved-Path Service Mesh + KMS",
    type: "Platform", team: "Platform", cat: "security",
    owner: { name: "Noah Bennett", role: "Principal Engineer", email: "platform-eng@acme.dev" },
    tagline: "mTLS in transit and KMS encryption at rest, with zero per-team config.",
    what: "Services deployed on the platform mesh get mutual-TLS in transit and KMS-backed encryption at rest (including backups and snapshots) with no per-team configuration. Keys are issued, wrapped, and rotated centrally, and every access is audited.",
    gets: ["mTLS on all service-to-service traffic", "AES-256 at rest via central KMS", "Automatic key rotation & audit trail"],
    cta: "Onboard to the mesh", docs: "go/paved-mesh",
    meets: [{ id: "SEC-001", covers: "full" }],
  },
  {
    id: "acme-sso",
    name: "Acme SSO (Identity Platform)",
    type: "Platform", team: "Identity", cat: "security",
    owner: { name: "Marcus Webb", role: "Security Architect", email: "security-standards@acme.dev" },
    tagline: "Phishing-resistant MFA on every privileged action, no code to write.",
    what: "Connecting an app to central SSO enforces phishing-resistant MFA for every privileged action, with step-up re-authentication for break-glass. Access reviews and revocation are managed centrally, so there is no MFA logic to build or maintain.",
    gets: ["FIDO2 / WebAuthn enforced by default", "Step-up auth for break-glass", "Centrally managed access reviews"],
    cta: "Connect via SSO", docs: "go/sso",
    meets: [{ id: "SEC-004", covers: "full" }],
  },
  {
    id: "secrets-manager",
    name: "Secrets Manager",
    type: "Service", team: "Identity", cat: "security",
    owner: { name: "Priya Nair", role: "Principal Security Engineer", email: "security-standards@acme.dev" },
    tagline: "Runtime secret injection with short-lived leases; CI scanning on by default.",
    what: "Deploy with the secrets sidecar and credentials are injected at runtime from the central manager using short-lived leases, nothing lives in code, config, or CI logs. Secret scanning runs in CI for every repo and blocks committed credentials.",
    gets: ["Runtime secret injection, nothing in code", "Instant rotation & revocation", "CI scanning blocks committed secrets"],
    cta: "Add the sidecar", docs: "go/secrets",
    meets: [{ id: "SEC-009", covers: "full" }],
  },
  {
    id: "data-catalog",
    name: "Data Catalog",
    type: "Platform", team: "Data Platform", cat: "data",
    owner: { name: "Sofia Reyes", role: "Head of Data Governance", email: "data-gov@acme.dev" },
    tagline: "Auto-classification, label propagation, and lifecycle policies in one place.",
    what: "Registering a dataset runs classification scanners, applies sensitivity labels automatically, and propagates them downstream through lineage. Declarative retention and lifecycle policies enforce TTL, archival, and legal holds without manual cleanup.",
    gets: ["Automatic PII / sensitivity detection", "Labels propagate through pipelines", "Declarative retention & automated archival", "Access policy enforced from the label"],
    cta: "Register a dataset", docs: "go/catalog",
    meets: [{ id: "DATA-002", covers: "full" }, { id: "DATA-005", covers: "full" }],
  },
  {
    id: "reliability-platform",
    name: "Reliability Platform",
    type: "Platform", team: "Platform", cat: "reliability",
    owner: { name: "Dan Osei", role: "SRE Lead", email: "sre-guild@acme.dev" },
    tagline: "SLOs, error budgets, and burn-rate alerting out of the box.",
    what: "Onboard a service and get SLO definitions, error-budget tracking, and burn-rate alerting wired to the standard dashboards. Its disaster-recovery objectives fold in automated restore drills and recorded recovery times.",
    gets: ["SLO & error-budget dashboards", "Burn-rate paging before exhaustion", "Auto feature-freeze signals", "Automated restore / DR drills"],
    cta: "Onboard a service", docs: "go/reliability",
    meets: [{ id: "REL-001", covers: "full" }, { id: "REL-007", covers: "full" }],
  },
  {
    id: "incident-mgmt",
    name: "Incident Management Platform",
    type: "Platform", team: "Platform", cat: "reliability",
    owner: { name: "Dan Osei", role: "SRE Lead", email: "sre-guild@acme.dev" },
    tagline: "Declare an incident and a blameless review is created and tracked for you.",
    what: "Declaring an incident automatically creates a blameless review doc with the timeline pre-filled, and tracks action items with owners and due dates against the 5-day completion window.",
    gets: ["Auto-generated review doc & timeline", "Action items with owners & due dates", "Completion-window tracking"],
    cta: "Use the incident bot", docs: "go/incidents",
    meets: [{ id: "REL-003", covers: "full" }],
  },
  {
    id: "api-gateway",
    name: "Central API Gateway",
    type: "Platform", team: "Platform", cat: "services",
    owner: { name: "Lena Hoffmann", role: "Principal Engineer, APIs", email: "api-guild@acme.dev" },
    tagline: "Version routing, deprecation signalling, and breaking-change blocking at the edge.",
    what: "Publish through the gateway and version routing, deprecation headers, and consumer notifications are handled for you. Contract tests gate every publish, so breaking changes are blocked before they reach a consumer.",
    gets: ["Enforced version routing", "Automated deprecation notices", "Contract-test gating at publish"],
    cta: "Publish via gateway", docs: "go/api-gateway",
    meets: [{ id: "API-002", covers: "full" }],
  },
  {
    id: "service-scaffold",
    name: "Service Scaffold + Dev Portal",
    type: "Template", team: "Developer Experience", cat: "services",
    owner: { name: "Maya Lindqvist", role: "Head of Developer Experience", email: "dx-guild@acme.dev" },
    tagline: "OpenAPI generated from code and published to the portal on every release.",
    what: "The standard service template generates an OpenAPI schema from code and publishes it to the developer portal on every release, never hand-written, never stale, and produces client SDKs from the same source.",
    gets: ["OpenAPI generated from code", "Auto-published to dev portal", "Generated client SDKs"],
    cta: "Start from the scaffold", docs: "go/scaffold",
    meets: [{ id: "API-004", covers: "full" }],
  },
  {
    id: "design-system",
    name: "Acme Design System",
    type: "Library", team: "Developer Experience", cat: "quality",
    owner: { name: "Aisha Khan", role: "Staff Frontend Engineer", email: "frontend-guild@acme.dev" },
    tagline: "WCAG-AA components with keyboard support and contrast built in.",
    what: "Build with the design-system component library and you inherit semantic markup, keyboard support, focus states, and AA contrast. Automated accessibility checks in CI catch the rest before it ships.",
    gets: ["WCAG-AA components out of the box", "Keyboard & screen-reader support built in", "Automated a11y checks in CI"],
    cta: "Use the components", docs: "go/design-system",
    meets: [{ id: "FE-003", covers: "most" }],
  },
  {
    id: "web-build",
    name: "Web Build Pipeline",
    type: "Template", team: "Developer Experience", cat: "frontend",
    owner: { name: "Maya Lindqvist", role: "Head of Developer Experience", email: "dx-guild@acme.dev" },
    tagline: "Performance budgets enforced in CI; the build fails on regression.",
    what: "The shared web build pipeline ships with performance budgets configured for Core Web Vitals and bundle size, and fails the build when a page regresses. Field Web Vitals are reported per page.",
    gets: ["Pre-set LCP / INP / size budgets", "Build fails on regression", "Per-page Web Vitals reporting"],
    cta: "Adopt the pipeline", docs: "go/web-build",
    meets: [{ id: "FE-005", covers: "full" }],
  },
  {
    id: "landing-zone",
    name: "Cloud Landing Zone",
    type: "Template", team: "Infrastructure", cat: "infra",
    owner: { name: "Tomás Vidal", role: "Head of Infrastructure", email: "infra-guild@acme.dev" },
    tagline: "Golden Terraform modules, CI-applied changes, and mandatory tags.",
    what: "Provision through the golden Terraform modules and your infrastructure is code by construction, reviewed and applied via CI with drift detection on. Resources inherit required owner, cost-center, environment, and data-classification tags automatically, so untagged spend can't be created.",
    gets: ["Golden Terraform modules", "CI-applied, peer-reviewed changes", "Continuous drift detection", "Mandatory cost & ownership tags"],
    cta: "Use the landing zone", docs: "go/landing-zone",
    meets: [{ id: "INFRA-001", covers: "full" }, { id: "INFRA-003", covers: "full" }],
  },
  {
    id: "ml-serving",
    name: "ML Serving Platform",
    type: "Platform", team: "ML Systems", cat: "ai",
    owner: { name: "Grace Liu", role: "Head of ML Systems", email: "ml-guild@acme.dev" },
    tagline: "Risk classification, human-review gates, and decision logging at deploy.",
    what: "Deploy models through the ML platform and risk classification, human-review gates, appeal routing, and decision logging are wired in for high-risk use cases.",
    gets: ["Risk classification at deploy", "Human-review & appeal gates", "Full decision logging"],
    cta: "Deploy via ML platform", docs: "go/ml-platform",
    meets: [{ id: "AI-001", covers: "most" }],
  },
  {
    id: "model-eval",
    name: "Model Evaluation Harness",
    type: "Library", team: "ML Systems", cat: "ai",
    owner: { name: "Grace Liu", role: "Head of ML Systems", email: "ml-guild@acme.dev" },
    tagline: "Fairness and disparate-impact metrics, gated pre-launch and monitored live.",
    what: "The evaluation harness runs fairness and disparate-impact metrics pre-launch and monitors them in production, you supply the protected groups and thresholds, and it provides defensible evaluation evidence.",
    gets: ["Pre-launch fairness gating", "Production drift monitoring", "Defensible evaluation evidence"],
    cta: "Add the eval harness", docs: "go/model-eval",
    meets: [{ id: "AI-003", covers: "partial" }],
  },
];

const ENABLER_BY_ID = {};
ENABLERS.forEach((e) => { ENABLER_BY_ID[e.id] = e; });
function getEnabler(id) { return ENABLER_BY_ID[id]; }

// attach the best-coverage capability to each standard, carrying its per-standard coverage
const COV_RANK = { full: 0, most: 1, partial: 2 };
STANDARDS.forEach((s) => {
  let best = null, bestCov = null;
  ENABLERS.forEach((e) => {
    const m = e.meets.find((x) => x.id === s.id);
    if (m && (best === null || COV_RANK[m.covers] < COV_RANK[bestCov])) { best = e; bestCov = m.covers; }
  });
  s.enabler = best ? { ...best, covers: bestCov, desc: best.what } : null;
});

// derived counts
CATEGORIES.forEach((c) => { c.count = STANDARDS.filter((s) => s.category === c.id && s.status !== "deprecated").length; });

const COMPLIANCE = {
  must:   { label: "Must",   short: "MUST",   desc: "Mandatory. Non-compliance requires a formal exception." },
  should: { label: "Should", short: "SHOULD", desc: "Strongly recommended. Deviate only with good reason." },
  may:    { label: "May",    short: "MAY",    desc: "Optional best practice. Adopt where it helps." },
};

const STATUS = {
  active:     { label: "Active" },
  draft:      { label: "Draft" },
  deprecated: { label: "Deprecated" },
};

function catName(id) { const c = CATEGORIES.find((x) => x.id === id); return c ? c.name : id; }
function getStandard(id) { return STANDARDS.find((s) => s.id === id); }

window.SP_DATA = { CATEGORIES, TEAMS, STANDARDS, ENABLERS, COMPLIANCE, STATUS, catName, getStandard, getEnabler };
