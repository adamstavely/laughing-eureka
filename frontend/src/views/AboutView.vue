<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue';

const PRINCIPLES = [
  { title: 'Lead with the why', body: 'Every standard opens with its business impact. If we can\'t explain why it matters, it isn\'t ready to publish, and teams won\'t adopt what they don\'t understand.' },
  { title: 'Paved paths, not policing', body: 'The fastest way to compliance is a great default. Each standard points to an enterprise enabler that makes the right way the easy way, adopt it and you\'re compliant by construction.' },
  { title: 'Mandate sparingly', body: 'Must, Should, May means something. We reserve "Must" for what genuinely protects customers and the business, so a mandate always carries weight.' },
  { title: 'Federated ownership, central coherence', body: 'Standards are owned by the guilds closest to the work, published in one place with one voice. Local expertise, global consistency.' },
  { title: 'Living documents', body: 'A standard is versioned, dated, and owned. It evolves with the technology and the threat landscape, a stale standard is a liability, not an asset.' },
  { title: 'Exceptions are data', body: 'A well-reasoned exception isn\'t failure, it\'s a signal. Repeated exceptions tell us a standard needs to change, or an enabler needs to improve.' },
];

const MATURITY = [
  { lvl: 0, name: 'Ad hoc', tag: 'Unmanaged', color: '#9aa3b5',
    desc: 'No awareness of the standard. Practices vary team to team and depend on individuals.',
    signals: ['No shared approach', 'Tribal knowledge', 'Invisible risk'] },
  { lvl: 1, name: 'Aware', tag: 'Informed', color: '#b3431f',
    desc: 'Teams know the standard exists and understand why it matters, but adoption is manual and inconsistent.',
    signals: ['Read the standard', 'Understands the why', 'Manual effort'] },
  { lvl: 2, name: 'Adopting', tag: 'In progress', color: '#9a6206',
    desc: 'Teams are actively implementing the requirements, with gaps tracked and a remediation plan in place.',
    signals: ['Plan in place', 'Gaps tracked', 'Partial coverage'] },
  { lvl: 3, name: 'Compliant', tag: 'Meets the bar', color: '#1b7a4b',
    desc: 'The standard is fully met and evidenced. Compliance is verified and any deviations carry an approved exception.',
    signals: ['Fully met', 'Evidenced', 'Exceptions documented'] },
  { lvl: 4, name: 'Compliant by default', tag: 'Paved path', color: '#2353e6',
    desc: 'The team has adopted the enterprise enabler, so compliance is automatic and continuous, it can\'t regress without active effort.',
    signals: ['Enabler adopted', 'Continuous & automatic', 'Drift-proof'] },
];

const EA_TEAM = [
  { name: 'Elena Vasquez', initials: 'EV', role: 'Head of Enterprise Architecture', focus: 'Chairs the Architecture Review Board and owns the overall standards & compliance program.', color: '#2353e6' },
  { name: 'Tomas Berg', initials: 'TB', role: 'Principal Architect, Standards', focus: 'Owns the standards framework, taxonomy, and the bar for what earns a "Must."', color: '#1c43bd' },
  { name: 'Aisha Rahman', initials: 'AR', role: 'Compliance & Governance Lead', focus: 'Runs the maturity reviews and tracks adoption across every team and standard.', color: '#6936d3' },
  { name: 'Jordan Lee', initials: 'JL', role: 'Standards Program Manager', focus: 'Coordinates publishing, versioning, and the exceptions process end to end.', color: '#b3431f' },
];

const SIG_COLORS = ['#2353e6', '#1c43bd', '#6936d3', '#b3431f'];

const SIGNERS = [
  { name: 'Maya Chen', role: 'Chief Technology Officer', initials: 'MC' },
  { name: 'David Okafor', role: 'Chief Information Officer', initials: 'DO' },
  { name: 'Priya Nair', role: 'Chief Data & AI Officer', initials: 'PN' },
  { name: 'Sofia Reyes', role: 'Chief Information Security Officer', initials: 'SR' },
];

function gradient(color: string) {
  return `linear-gradient(135deg, ${color}, ${color}cc)`;
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="about-hero" aria-labelledby="about-heading">
      <div class="wrap about-hero-row">
        <div class="about-hero-text">
          <div class="eyebrow">
            <BaseIcon name="compass" :size="15" :sw="2" aria-hidden="true" /> About these standards
          </div>
          <h1 id="about-heading">Why we hold a shared bar, and how we help you clear it.</h1>
          <p>Acme is a federated engineering organization: many teams, one set of expectations. These standards exist to make the right way the obvious way, explained in plain language, grounded in business impact, and backed by tools that do the heavy lifting for you.</p>
        </div>
        <div class="about-hero-art" aria-hidden="true">
          <BaseIcon name="scale" :size="150" :sw="1.3" />
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="about-section" aria-labelledby="mission-heading">
      <div class="wrap">
        <div class="about-eyebrow">Our purpose</div>
        <h2 id="mission-heading">Mission &amp; vision</h2>
        <div class="mv-grid" style="margin-top: 28px;">
          <div class="mv-card">
            <div class="mv-ic" style="background: var(--blue);" aria-hidden="true">
              <BaseIcon name="flag" :size="22" :sw="2" />
            </div>
            <h3>Mission</h3>
            <p>Enable every team to ship software that is secure, reliable, and worthy of our customers' trust, fast, by making the right way the easy way.</p>
          </div>
          <div class="mv-card">
            <div class="mv-ic" style="background: var(--enabler);" aria-hidden="true">
              <BaseIcon name="sparkles" :size="22" :sw="2" />
            </div>
            <h3>Vision</h3>
            <p>A federated organization where standards are understood by all, adopted by default, and trusted by engineers, partners, and regulators alike.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Leadership letter -->
    <section class="about-section" style="background: var(--bg-sunken);" aria-labelledby="letter-heading">
      <div class="wrap">
        <div class="about-eyebrow" style="text-align: center;">A note from leadership</div>
        <h2 id="letter-heading" style="text-align: center; margin-bottom: 36px;">A joint letter from your engineering leaders</h2>
        <div class="letter" role="article" aria-label="Leadership letter">
          <p class="salutation">To every engineer, manager, and partner who builds with us,</p>
          <p class="lead-line">We wrote these standards for one reason: so that doing excellent work doesn't depend on knowing the right person or having been here the longest.</p>
          <p>In a distributed organization, good intentions don't scale, shared, well-explained expectations do. The standards in this portal are not a compliance checklist handed down from above. They are the hard-won lessons of our guilds, written down, so the whole company can move faster without relearning them the hard way.</p>
          <p class="pull">"We will never ask you to meet a standard we can't explain, and wherever we can, we'll give you a tool that meets it for you."</p>
          <p>That is our commitment to you. Every standard leads with its business impact, names a real owner you can talk to, and points to an enterprise enabler, the paved path that makes compliance the default, not a chore. When a standard gets in your way, tell us; an exception is a signal we take seriously, and often the start of a better standard.</p>
          <p>Hold the bar. Help us raise it. And build things you're proud of.</p>
          <div class="signatures" role="list" aria-label="Signatories">
            <div
              v-for="(s, i) in SIGNERS"
              :key="s.name"
              class="sig"
              role="listitem"
            >
              <div
                class="savatar"
                :style="{ background: gradient(SIG_COLORS[i]) }"
                aria-hidden="true"
              >{{ s.initials }}</div>
              <div>
                <div class="sig-script">{{ s.name }}</div>
                <div class="srole">{{ s.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enterprise Architecture team -->
    <section class="about-section" aria-labelledby="ea-team-heading">
      <div class="wrap">
        <div class="about-eyebrow">Who oversees this</div>
        <h2 id="ea-team-heading">The Enterprise Architecture team</h2>
        <p style="font-size: 16.5px; color: var(--ink-2); max-width: 64ch; margin: 0 0 8px;">
          A small, central team stewards the standards and compliance program, not by writing every standard, but by holding the framework together. They chair the <b>Architecture Review Board</b>, run the quarterly maturity reviews, and shepherd exceptions into better standards and enablers.
        </p>
        <div class="team-grid" role="list">
          <div
            v-for="m in EA_TEAM"
            :key="m.name"
            class="team-card"
            role="listitem"
          >
            <div
              class="team-av"
              :style="{ background: gradient(m.color) }"
              aria-hidden="true"
            >{{ m.initials }}</div>
            <div class="tc-name">{{ m.name }}</div>
            <div class="tc-role">{{ m.role }}</div>
            <p class="tc-focus">{{ m.focus }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Guiding principles -->
    <section class="about-section" aria-labelledby="principles-heading">
      <div class="wrap">
        <div class="about-eyebrow">How we write standards</div>
        <h2 id="principles-heading">Guiding principles</h2>
        <p style="font-size: 16.5px; color: var(--ink-2); max-width: 62ch; margin: 0 0 30px;">
          Six principles shape every standard in this portal, what we choose to mandate, how we explain it, and how we help you meet it.
        </p>
        <div class="principles" role="list">
          <div
            v-for="(p, i) in PRINCIPLES"
            :key="p.title"
            class="principle"
            role="listitem"
          >
            <div class="pn" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</div>
            <div>
              <h4>{{ p.title }}</h4>
              <p>{{ p.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Maturity model -->
    <section class="about-section" style="background: var(--bg-sunken);" aria-labelledby="maturity-heading">
      <div class="wrap">
        <div class="about-eyebrow">Measuring adoption</div>
        <h2 id="maturity-heading">The compliance maturity model</h2>
        <p style="font-size: 16.5px; color: var(--ink-2); max-width: 64ch; margin: 0 0 28px;">
          We measure each team against every applicable standard on a five-stage scale. The goal isn't just to reach <b>Compliant</b>, it's to reach <b>Compliant by default</b>, where adopting the enterprise enabler makes compliance automatic and impossible to silently regress.
        </p>

        <div
          class="mat-bar"
          role="img"
          aria-label="Maturity model progress bar: 5 levels from Ad hoc to Compliant by default"
        >
          <span
            v-for="m in MATURITY"
            :key="m.lvl"
            :style="{ background: m.color }"
            :title="`Level ${m.lvl}: ${m.name}`"
          ></span>
        </div>

        <div class="maturity" role="list">
          <div
            v-for="m in MATURITY"
            :key="m.lvl"
            class="mat-row"
            role="listitem"
            :aria-label="`Level ${m.lvl}: ${m.name} — ${m.tag}`"
          >
            <div class="mat-left">
              <div class="mat-level" :style="{ background: m.color }" aria-hidden="true">{{ m.lvl }}</div>
              <div>
                <div class="ml-name">{{ m.name }}</div>
                <div class="ml-tag">{{ m.tag }}</div>
              </div>
            </div>
            <div class="mat-right">
              <p class="mr-desc">{{ m.desc }}</p>
              <div class="mr-signals" role="list" :aria-label="`Signals for level ${m.lvl}`">
                <span
                  v-for="(s, j) in m.signals"
                  :key="j"
                  class="sg"
                  role="listitem"
                >{{ s }}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 28px; align-items: center; flex-wrap: wrap;">
          <RouterLink to="/browse" class="btn btn-primary">
            Browse the standards <BaseIcon name="arrowRight" :size="15" aria-hidden="true" />
          </RouterLink>
          <RouterLink to="/enablers" class="btn btn-ghost">
            <BaseIcon name="bolt" :size="15" :sw="2" aria-hidden="true" /> See compliant-by-default enablers
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
