import type { TechContent } from './types';

export const TECH: Record<string, TechContent> = {
  'SEC-001': {
    tagline: 'Negotiated cipher suites, key custody, and at-rest envelope encryption.',
    conformance: [
      { ref: 'TR-1', level: 'must', text: 'TLS 1.2 is the negotiated floor; TLS 1.3 is the default for any new listener. SSLv3 and TLS 1.0/1.1 are disabled at the edge.' },
      { ref: 'TR-2', level: 'must', text: 'Data at rest uses AES-256-GCM (or an approved FIPS 140-3 equivalent), including backups, snapshots, and replicas.' },
      { ref: 'TR-3', level: 'must', text: 'Data-encryption keys are issued and wrapped by the central KMS. No key material is stored in application config, images, or alongside ciphertext.' },
      { ref: 'TR-4', level: 'should', text: 'Certificates and DEKs rotate automatically; rotation does not require a redeploy.' },
    ],
    config: {
      label: 'Envoy edge listener, TLS 1.3 floor',
      lang: 'yaml',
      code: `tls_context:\n  common_tls_context:\n    tls_params:\n      tls_minimum_protocol_version: TLSv1_2\n      tls_maximum_protocol_version: TLSv1_3\n      cipher_suites:\n        - ECDHE-ECDSA-AES256-GCM-SHA384\n        - ECDHE-RSA-AES256-GCM-SHA384\n    tls_certificate_sds_secret_configs:\n      - name: spiffe://acme/edge   # KMS-backed, rotated`,
    },
    verify: [
      'CI runs testssl against every public endpoint and fails below grade A.',
      'KMS key-policy audit confirms no exportable DEKs and rotation <= 90 days.',
      'Load-balancer config lint blocks deprecated cipher suites on merge.',
    ],
    refs: [
      { label: 'RFC 8446', note: 'TLS 1.3' },
      { label: 'NIST SP 800-52r2', note: 'TLS configuration' },
      { label: 'FIPS 197', note: 'AES' },
    ],
  },
  'SEC-004': {
    tagline: 'Authenticator assurance level, accepted factors, and step-up triggers.',
    conformance: [
      { ref: 'TR-1', level: 'must', text: 'Production, source-control, and customer-data access require a phishing-resistant authenticator (FIDO2/WebAuthn). The IdP asserts amr=hwk.' },
      { ref: 'TR-2', level: 'must', text: 'TOTP is accepted only as a recovery fallback. SMS and email OTP are not valid factors.' },
      { ref: 'TR-3', level: 'must', text: 'Break-glass and root-equivalent actions trigger step-up re-authentication regardless of session age.' },
      { ref: 'TR-4', level: 'should', text: 'Service accounts use scoped, short-lived credentials from the secrets manager in lieu of interactive MFA, reviewed quarterly.' },
    ],
    config: {
      label: 'IdP authentication policy',
      lang: 'json',
      code: `{\n  "policy": "prod-access",\n  "required_acr": "phishing-resistant",\n  "allowed_amr": ["hwk", "fido"],\n  "denied_amr": ["sms", "email"],\n  "step_up": { "actions": ["break_glass", "role_assume"], "max_age": "0s" }\n}`,
    },
    verify: [
      'Auth logs are asserted in CI: every prod session carries amr in {hwk, fido}.',
      'Quarterly access review reconciles privileged grants against the directory.',
      'Policy test denies any login presenting an SMS/email factor.',
    ],
    refs: [
      { label: 'NIST SP 800-63B', note: 'AAL3' },
      { label: 'W3C WebAuthn L2', note: 'Web Authentication' },
      { label: 'FIDO2 CTAP', note: 'Authenticator protocol' },
    ],
  },
  'DATA-002': {
    tagline: 'Label taxonomy, default-deny classification, and lineage propagation.',
    conformance: [
      { ref: 'TR-1', level: 'must', text: 'Every dataset carries exactly one sensitivity label: Public, Internal, Confidential, or Restricted. Unlabelled data is treated as Confidential.' },
      { ref: 'TR-2', level: 'must', text: 'Restricted data (PII, payment, health) may only reside in approved stores; the policy engine denies writes elsewhere.' },
      { ref: 'TR-3', level: 'must', text: 'Labels propagate through pipelines via lineage; a derived dataset inherits the highest sensitivity of its inputs.' },
      { ref: 'TR-4', level: 'should', text: 'The data catalog is the system of record; labels set out-of-band are reconciled on the next scan.' },
    ],
    config: {
      label: 'Dataset manifest',
      lang: 'yaml',
      code: `dataset: payments.tx_ledger\nclassification: restricted\ncontains_pii: true\napproved_stores: [warehouse-eu, kms-vault]\nretention: 2555d   # see DATA-005\nowner: payments`,
    },
    verify: [
      'Catalog completeness report: 100% of registered datasets carry a label.',
      'Lineage scan confirms derived tables inherit the max input sensitivity.',
      'Policy engine integration test denies a Restricted write to a non-approved store.',
    ],
    refs: [
      { label: 'Data Classification Policy', note: 'go/data-classes' },
      { label: 'ISO 27001 A.8', note: 'Asset management' },
    ],
  },
  'DATA-005': {
    tagline: 'Declarative retention, automated TTL, and legal-hold precedence.',
    conformance: [
      { ref: 'TR-1', level: 'should', text: 'Retention period and end-of-life action (delete | archive) are declared in the catalog at dataset creation.' },
      { ref: 'TR-2', level: 'should', text: 'TTL and archival are enforced by automation, not manual cleanup jobs.' },
      { ref: 'TR-3', level: 'must', text: 'An active legal hold overrides any retention policy until the hold is lifted.' },
    ],
    config: {
      label: 'Lifecycle policy',
      lang: 'yaml',
      code: `lifecycle:\n  retain: 365d\n  at_end_of_life: archive   # delete | archive\n  archive_tier: glacier\n  legal_hold: respected     # blocks deletion`,
    },
    verify: [
      'Catalog report flags datasets with no declared retention.',
      'TTL job audit confirms deletions/archival fire on schedule and are logged.',
    ],
    refs: [
      { label: 'GDPR Art. 5(1)(e)', note: 'Storage limitation' },
      { label: 'Retention Schedule', note: 'go/retention' },
    ],
  },
  'REL-001': {
    tagline: 'SLI specification, error-budget math, and multi-window burn-rate alerting.',
    conformance: [
      { ref: 'TR-1', level: 'must', text: 'Each user-facing service publishes availability and latency SLIs with explicit good-event definitions.' },
      { ref: 'TR-2', level: 'must', text: 'An SLO target and rolling-window error budget are computed and visible on the standard dashboard.' },
      { ref: 'TR-3', level: 'must', text: 'Multi-window, multi-burn-rate alerts page before the budget is exhausted (e.g. 2% in 1h, 5% in 6h).' },
      { ref: 'TR-4', level: 'should', text: 'An exhausted budget triggers a feature freeze until reliability recovers.' },
    ],
    config: {
      label: 'OpenSLO definition',
      lang: 'yaml',
      code: `apiVersion: openslo/v1\nkind: SLO\nmetadata: { name: checkout-availability }\nspec:\n  objectives:\n    - displayName: 99.9% availability\n      target: 0.999\n  indicator:\n    ratioMetric: { good: http_2xx, total: http_total }\n  timeWindow: [{ duration: 28d, isRolling: true }]`,
    },
    verify: [
      'SLO registry completeness check: every user-facing service is registered.',
      'Alert-rule lint validates multi-window burn-rate thresholds exist.',
      'Budget dashboard auto-provisioned from the SLO spec.',
    ],
    refs: [
      { label: 'OpenSLO 1.0', note: 'Spec' },
      { label: 'Google SRE Workbook', note: 'Alerting on SLOs' },
    ],
  },
  'REL-003': {
    tagline: 'Review SLA, required sections, and action-item tracking.',
    conformance: [
      { ref: 'TR-1', level: 'should', text: 'Sev-1/Sev-2 incidents get a written review within 5 business days.' },
      { ref: 'TR-2', level: 'must', text: 'The review documents timeline, customer impact, root cause, and contributing factors, never individuals as causes.' },
      { ref: 'TR-3', level: 'must', text: 'Each action item has a single owner and a due date, tracked to closure.' },
    ],
    config: {
      label: 'Postmortem front-matter',
      lang: 'yaml',
      code: `incident: INC-2026-0418\nseverity: SEV1\ndetected: 2026-04-18T09:12Z\nresolved: 2026-04-18T10:03Z\nreview_due: 2026-04-25\naction_items:\n  - { owner: platform, due: 2026-05-02, status: open }`,
    },
    verify: [
      'Incident tracker reports review completion against the 5-day SLA.',
      'Action-item closure rate tracked per team; overdue items escalate.',
    ],
    refs: [
      { label: 'Incident Management Runbook', note: 'go/incidents' },
    ],
  },
  'API-002': {
    tagline: 'Version routing, compatibility rules, and machine-readable deprecation.',
    conformance: [
      { ref: 'TR-1', level: 'must', text: 'A major version appears in the URL path or a version header; only additive, backward-compatible changes are allowed within a version.' },
      { ref: 'TR-2', level: 'must', text: 'Deprecations are announced with a >= 6-month window and signalled with Deprecation and Sunset response headers.' },
      { ref: 'TR-3', level: 'must', text: 'Contract tests run against the published schema and gate every release; a breaking diff fails the build.' },
    ],
    config: {
      label: 'Deprecation signalling',
      lang: 'http',
      code: `GET /v2/payments HTTP/1.1\n\nHTTP/1.1 200 OK\nDeprecation: Sun, 01 Nov 2026 00:00:00 GMT\nSunset: Sun, 01 May 2027 00:00:00 GMT\nLink: </v3/payments>; rel="successor-version"`,
    },
    verify: [
      'oasdiff compares the new spec against the published one; breaking changes block merge.',
      'Consumer-driven contract tests run in CI against the gateway.',
    ],
    refs: [
      { label: 'RFC 9745', note: 'Deprecation header' },
      { label: 'RFC 8594', note: 'Sunset header' },
      { label: 'SemVer 2.0', note: 'Versioning' },
    ],
  },
  'API-004': {
    tagline: 'Schema generated from code, linted, and published per release.',
    conformance: [
      { ref: 'TR-1', level: 'should', text: 'The OpenAPI description is generated from code annotations or types, never hand-maintained.' },
      { ref: 'TR-2', level: 'should', text: 'The schema passes lint (style + completeness) and is published to the developer portal on every release.' },
      { ref: 'TR-3', level: 'should', text: 'A drift check confirms the spec matches the running service\'s responses.' },
    ],
    config: {
      label: 'CI publish step',
      lang: 'bash',
      code: `# generate from code, lint, publish\nopenapi-gen ./src > openapi.json\nspectral lint openapi.json --ruleset .spectral.yaml\nportal publish openapi.json --service "$SERVICE" --version "$TAG"`,
    },
    verify: [
      'Spectral lint gate: zero errors on merge.',
      'Drift check replays portal examples against staging and diffs responses.',
    ],
    refs: [
      { label: 'OpenAPI 3.1', note: 'Specification' },
      { label: 'Spectral', note: 'Linting' },
    ],
  },
  'FE-003': {
    tagline: 'Keyboard model, contrast thresholds, and the automated + manual gate.',
    conformance: [
      { ref: 'TR-1', level: 'must', text: 'Every interactive control is keyboard operable end-to-end with a visible focus indicator.' },
      { ref: 'TR-2', level: 'must', text: 'Text contrast is >= 4.5:1 (>= 3:1 for large text); colour is never the sole carrier of meaning.' },
      { ref: 'TR-3', level: 'must', text: 'Names, roles, and states are programmatically determinable (semantic HTML or correct ARIA).' },
      { ref: 'TR-4', level: 'should', text: 'Key flows pass automated checks in CI and manual screen-reader testing each release.' },
    ],
    config: {
      label: 'Playwright + axe CI check',
      lang: 'js',
      code: `test('checkout is accessible', async ({ page }) => {\n  await page.goto('/checkout');\n  const results = await new AxeBuilder({ page })\n    .withTags(['wcag22aa'])\n    .analyze();\n  expect(results.violations).toEqual([]);\n});`,
    },
    verify: [
      'axe-core CI gate: zero critical/serious violations on key flows.',
      'Manual NVDA + VoiceOver pass recorded per release for checkout and auth.',
    ],
    refs: [
      { label: 'WCAG 2.2 AA', note: 'Success criteria' },
      { label: 'WAI-ARIA 1.2', note: 'Roles & states' },
    ],
  },
  'FE-005': {
    tagline: 'Lab budgets enforced in CI, field vitals monitored in production.',
    conformance: [
      { ref: 'TR-1', level: 'should', text: 'Each critical page declares budgets for JS transfer size, LCP, and INP.' },
      { ref: 'TR-2', level: 'should', text: 'The build fails when a budget is exceeded in the lab (Lighthouse CI).' },
      { ref: 'TR-3', level: 'should', text: 'Field Web Vitals (CrUX/RUM) are monitored; sustained regressions open a ticket.' },
    ],
    config: {
      label: 'Lighthouse CI budget',
      lang: 'json',
      code: `{\n  "ci": { "assert": { "assertions": {\n    "resource-summary:script:size": ["error", { "maxNumericValue": 170000 }],\n    "largest-contentful-paint":      ["error", { "maxNumericValue": 2500 }],\n    "interaction-to-next-paint":     ["error", { "maxNumericValue": 200 }]\n  } } }\n}`,
    },
    verify: [
      'Lighthouse CI assertions fail the PR on budget breach.',
      'RUM dashboard tracks p75 LCP/INP per route against the budget.',
    ],
    refs: [
      { label: 'Web Vitals', note: 'LCP · INP · CLS' },
      { label: 'Lighthouse CI', note: 'Budgets' },
    ],
  },
  'INFRA-001': {
    tagline: 'Declarative state, CI-applied changes, and continuous drift detection.',
    conformance: [
      { ref: 'TR-1', level: 'must', text: 'All cloud resources are defined in Terraform/Pulumi and applied through CI, never the console.' },
      { ref: 'TR-2', level: 'must', text: 'Production console access is read-only except for audited break-glass roles.' },
      { ref: 'TR-3', level: 'must', text: 'Break-glass changes are codified back into IaC within 48 hours.' },
      { ref: 'TR-4', level: 'should', text: 'Drift detection runs continuously and alerts on divergence from state.' },
    ],
    config: {
      label: 'CI plan/apply gate',
      lang: 'yaml',
      code: `steps:\n  - terraform plan -out tfplan\n  - conftest test tfplan         # policy as code\n  - require_approval: [infra-reviewers]\n  - terraform apply tfplan       # CI identity only`,
    },
    verify: [
      'CloudTrail alerts on any console write to production resources.',
      'Drift detector reconciles live state against the store every hour.',
      'State coverage report: % of resources under management trends to 100%.',
    ],
    refs: [
      { label: 'Terraform', note: 'IaC' },
      { label: 'Cloud Landing Zone', note: 'go/landing-zone' },
    ],
  },
  'INFRA-003': {
    tagline: 'Mandatory tag set enforced at creation, untagged spend blocked.',
    conformance: [
      { ref: 'TR-1', level: 'should', text: 'Every resource carries owner, cost-center, environment, and data-classification tags.' },
      { ref: 'TR-2', level: 'should', text: 'Tags are applied at creation via the landing zone; manual creation of untagged resources is blocked.' },
      { ref: 'TR-3', level: 'should', text: 'Untagged resources are flagged and, after a grace period, deprovisioned.' },
    ],
    config: {
      label: 'Tag policy (OPA)',
      lang: 'rego',
      code: `deny[msg] {\n  required := {"owner","cost-center","environment","data-classification"}\n  missing := required - {k | input.tags[k]}\n  count(missing) > 0\n  msg := sprintf("missing required tags: %v", [missing])\n}`,
    },
    verify: [
      'Tag-policy report lists non-compliant resources per account.',
      'Cost-allocation coverage: % of spend attributable to a team.',
    ],
    refs: [
      { label: 'Cloud Tagging Policy', note: 'go/tagging' },
    ],
  },
  'AI-001': {
    tagline: 'Risk tiering, the human-review gate, and consequential-decision logging.',
    conformance: [
      { ref: 'TR-1', level: 'must', text: 'Each AI use is classified by risk; high-risk uses require a human-review or appeal path before output takes material effect.' },
      { ref: 'TR-2', level: 'must', text: 'A visible appeal/override route is available to affected users.' },
      { ref: 'TR-3', level: 'must', text: 'Model version and inputs are logged for every consequential decision.' },
      { ref: 'TR-4', level: 'should', text: 'Low-risk assistive uses require disclosure but not pre-review.' },
    ],
    config: {
      label: 'Model deploy manifest',
      lang: 'yaml',
      code: `model: eligibility-scorer@4.2\nrisk_tier: high\ngates:\n  human_review: required\n  appeal_path: /support/appeal\nlogging:\n  decisions: full   # model version + inputs + outcome`,
    },
    verify: [
      'Serving platform enforces the review gate for high-risk tiers at deploy.',
      'Decision-log completeness audit samples production decisions.',
    ],
    refs: [
      { label: 'EU AI Act', note: 'Risk tiers' },
      { label: 'Model Governance', note: 'go/ml-governance' },
    ],
  },
  'AI-003': {
    tagline: 'Protected groups, fairness metrics, and pre-launch + production gates.',
    conformance: [
      { ref: 'TR-1', level: 'should', text: 'Protected groups and fairness metrics (e.g. disparate impact ratio) are defined per use case.' },
      { ref: 'TR-2', level: 'should', text: 'Launch is gated on agreed metric thresholds.' },
      { ref: 'TR-3', level: 'should', text: 'Fairness metrics are monitored in production to catch drift.' },
    ],
    config: {
      label: 'Evaluation harness config',
      lang: 'yaml',
      code: `fairness:\n  protected_groups: [age_band, region]\n  metrics:\n    disparate_impact: { min: 0.8, max: 1.25 }\n  gate: pre_launch\n  monitor: { schedule: daily, drift_alert: 0.1 }`,
    },
    verify: [
      'Pre-launch gate blocks promotion when a metric is out of bounds.',
      'Scheduled production monitor alerts on fairness drift.',
    ],
    refs: [
      { label: 'Fairness Guidelines', note: 'go/ml-fairness' },
    ],
  },
  'SEC-009': {
    tagline: 'Runtime injection, short-lived leases, and CI secret scanning.',
    conformance: [
      { ref: 'TR-1', level: 'must', text: 'No secrets in code, config, or CI logs; commits are scanned and blocked on detection.' },
      { ref: 'TR-2', level: 'must', text: 'Secrets are injected at runtime from the central manager using short-lived leases.' },
      { ref: 'TR-3', level: 'must', text: 'Credentials rotate on a schedule and immediately on suspected compromise.' },
    ],
    config: {
      label: 'Vault agent injection',
      lang: 'yaml',
      code: `annotations:\n  vault.hashicorp.com/agent-inject: "true"\n  vault.hashicorp.com/role: "payments"\n  vault.hashicorp.com/agent-inject-secret-db: "kv/payments/db"\n  vault.hashicorp.com/agent-inject-template-db: |\n    {{ with secret "kv/payments/db" }}{{ .Data.dsn }}{{ end }}\n  vault.hashicorp.com/agent-ttl: "1h"`,
    },
    verify: [
      'gitleaks runs in CI and on the full history; a hit blocks the merge.',
      'Lease TTL audit confirms no static long-lived credentials in production.',
    ],
    refs: [
      { label: 'Secrets Policy', note: 'go/secrets' },
    ],
  },
  'REL-007': {
    deprecated: true,
    tagline: 'Superseded, recoverability now lives in REL-001\'s DR objectives.',
    conformance: [
      { ref: 'TR-1', level: 'should', text: 'Historical: perform and document a full restore-from-backup test each quarter, recording restore time and gaps.' },
    ],
    config: {
      label: 'Restore drill (historical)',
      lang: 'bash',
      code: `# superseded by REL-001 disaster-recovery objectives\nrestore --from latest-snapshot --to dr-env\nmeasure_rto && record_results.sh`,
    },
    verify: [
      'See REL-001, restore testing folds into error-budget / DR objectives.',
    ],
    refs: [
      { label: 'REL-001', note: 'Current guidance' },
    ],
  },
};
