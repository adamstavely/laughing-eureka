<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue';

const LEADERS = [
  { initials: 'AK', name: 'Alex Kim', role: 'CTO', color: '#2353e6', script: 'Alex Kim' },
  { initials: 'SR', name: 'Sofia Reyes', role: 'VP Engineering', color: '#1b7a4b', script: 'Sofia Reyes' },
  { initials: 'NB', name: 'Noah Bennett', role: 'Principal Engineer, Platform', color: '#9a6206', script: 'Noah Bennett' },
  { initials: 'LH', name: 'Lena Hoffmann', role: 'Principal Engineer, APIs', color: '#c81e3a', script: 'Lena Hoffmann' },
];

const EA_TEAM = [
  { initials: 'MJ', name: 'Marcus Johnson', role: 'Head of Enterprise Architecture', color: '#2353e6', focus: 'Leads the Architecture Review Board, shapes the standards roadmap, and partners with engineering leadership on the long-term technical strategy.' },
  { initials: 'PR', name: 'Priya Rajan', role: 'Principal Architect', color: '#1b7a4b', focus: 'Domain architect for security and data. Authors must-level standards, runs threat-modelling workshops, and owns the exception review process.' },
  { initials: 'TW', name: 'Tom Walsh', role: 'Compliance & Governance Lead', color: '#9a6206', focus: 'Maps standards to regulatory obligations (SOC 2, GDPR, ISO 27001), tracks audit findings, and maintains the maturity model.' },
  { initials: 'AV', name: 'Anika Voss', role: 'Program Manager, Standards', color: '#c81e3a', focus: 'Runs the quarterly review cycle, coordinates cross-guild working groups, and ensures proposed standards move from draft to active on schedule.' },
];

const PRINCIPLES = [
  { n: '01', title: 'Impact first', body: 'Every standard leads with the business outcome it protects or enables. If we can\'t articulate the why, we shouldn\'t be writing the what.' },
  { n: '02', title: 'Paved path over mandate', body: 'The best standard is one teams adopt by default, not by force. We build enterprise enablers that make compliance the path of least resistance.' },
  { n: '03', title: 'Owned, not curated', body: 'Every standard has a named owner who is accountable for its accuracy, relevance, and lifecycle. No orphaned docs.' },
  { n: '04', title: 'Exception as signal', body: 'A well-used exception process surfaces friction. When we see clusters of the same exception, that\'s a standard that needs revisiting, not just more enforcement.' },
  { n: '05', title: 'Federated, not centralised', body: 'Domain teams own domain standards. The EA guild sets the bar for quality and process, not the content of every rule.' },
  { n: '06', title: 'Living documents', body: 'Standards rot. We commit to a regular review cadence and version every change, so teams can trust what they\'re reading is current.' },
];

const MATURITY = [
  {
    n: '1', name: 'Aware', tag: 'Starting out', color: '#6c768c',
    desc: 'Teams know the standards exist and reference them occasionally. No systematic adoption tracking.',
    signals: ['Standards portal visited', 'Some standards referenced in ADRs'],
  },
  {
    n: '2', name: 'Adopting', tag: 'In progress', color: '#9a6206',
    desc: 'Must-level standards are being worked toward. Exceptions are filed; plans exist.',
    signals: ['Exception process in use', 'Active remediation plans', 'Owner contacts known'],
  },
  {
    n: '3', name: 'Compliant', tag: 'Baseline met', color: '#2353e6',
    desc: 'All must-level standards met. Most should-level in place. Evidence available for audit.',
    signals: ['Zero open must exceptions', 'Audit evidence ready', 'Most shoulds met'],
  },
  {
    n: '4', name: 'Optimising', tag: 'Ahead of the curve', color: '#1b7a4b',
    desc: 'Teams adopt enterprise enablers proactively. They contribute proposals and flag gaps.',
    signals: ['Enablers adopted', 'Standard proposals submitted', 'No drift detected'],
  },
  {
    n: '5', name: 'Leading', tag: 'Setting the bar', color: '#c81e3a',
    desc: 'Teams co-author standards, mentor others, and run guilds. Their practices become the standard.',
    signals: ['Guild participation', 'Standards co-authored', 'Cross-team mentoring'],
  },
];

const MAT_COLORS = ['#e7e9ef', '#fbf2e0', '#dde6fd', '#e7f4ec', '#fdecef'];
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="about-hero" aria-labelledby="about-heading">
      <div class="wrap about-hero-row">
        <div class="about-hero-text">
          <div class="eyebrow" style="font-family: var(--mono); font-size: 12.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #7fa0ff; margin-bottom: 20px; display: inline-flex; align-items: center; gap: 9px;">
            <BaseIcon name="compass" :size="14" :sw="2" aria-hidden="true" /> About the programme
          </div>
          <h1 id="about-heading">Engineering standards that earn their place.</h1>
          <p>Every standard in this portal exists because someone asked "why does this matter to the business?" and could answer it. We publish the why alongside the what, because compliance without understanding doesn't stick.</p>
        </div>
        <div class="about-hero-art" aria-hidden="true">
          <BaseIcon name="scale" :size="200" :sw="1.3" />
        </div>
      </div>
    </section>

    <div class="wrap">

      <!-- Mission & Vision -->
      <section class="about-section" aria-labelledby="mission-heading">
        <div class="about-eyebrow">
          <BaseIcon name="compass" :size="13" aria-hidden="true" style="display: inline;" /> Mission &amp; Vision
        </div>
        <h2 id="mission-heading">Why this portal exists</h2>
        <div class="mv-grid">
          <div class="mv-card">
            <div class="mv-ic" style="background: var(--blue);" aria-hidden="true">
              <BaseIcon name="layers" :size="22" />
            </div>
            <h3>Mission</h3>
            <p>Make it easy for every engineer at Acme to build the right way, by surfacing the standards that protect the business, in a form that's honest about why they exist.</p>
          </div>
          <div class="mv-card">
            <div class="mv-ic" style="background: var(--active);" aria-hidden="true">
              <BaseIcon name="compass" :size="22" />
            </div>
            <h3>Vision</h3>
            <p>A world where compliance is the default path, not an afterthought, because the paved paths are genuinely better than the alternatives.</p>
          </div>
        </div>
      </section>

      <!-- Leadership letter -->
      <section class="about-section" aria-labelledby="letter-heading">
        <div class="about-eyebrow">
          <BaseIcon name="mail" :size="13" aria-hidden="true" style="display: inline;" /> From leadership
        </div>
        <h2 id="letter-heading">A note from the team</h2>
        <div class="letter" role="article" aria-label="Leadership letter">
          <p class="salutation">To every engineer at Acme,</p>
          <p class="lead-line">We wrote this portal because "it's policy" is not a good enough answer.</p>
          <p>For too long, engineering standards lived in shared drives, written in passive voice, last reviewed three years ago by someone who has since left. Nobody read them, nobody enforced them, and so nobody followed them. Then something went wrong, and we pointed at the document as if it were a defense.</p>
          <blockquote class="pull" role="blockquote">
            "A standard that doesn't explain its business impact is a standard that won't be followed."
          </blockquote>
          <p>The rules in this portal are the same rules we've always had. What changed is how we present them. Every standard now leads with the business impact: the breach we prevent, the audit we pass, the customer we don't lose. If we can't write that headline, the standard shouldn't exist.</p>
          <p>We also want compliance to be the easy path. That's why every standard points to an enterprise enabler, a paved road that makes you compliant by construction. No paperwork, no checklist, just adopt the platform and the standard is met.</p>
          <p>Thank you for holding yourselves and each other to a high bar. These standards are yours as much as ours. Propose changes, flag outdated content, file exceptions when you need them. This portal only works if it reflects the real world.</p>
          <div class="signatures" role="list" aria-label="Signatories">
            <div v-for="l in LEADERS" :key="l.name" class="sig" role="listitem">
              <div
                class="savatar"
                :style="{ background: l.color }"
                aria-hidden="true"
              >{{ l.initials }}</div>
              <div>
                <div class="sig-script">{{ l.script }}</div>
                <div class="sname">{{ l.name }}</div>
                <div class="srole">{{ l.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enterprise Architecture team -->
      <section class="about-section" aria-labelledby="ea-team-heading">
        <div class="about-eyebrow">
          <BaseIcon name="users" :size="13" aria-hidden="true" style="display: inline;" /> The team
        </div>
        <h2 id="ea-team-heading">Enterprise Architecture</h2>
        <p style="font-size: 16px; color: var(--ink-2); max-width: 64ch; line-height: 1.6; margin: 0 0 4px;">
          The EA guild chairs the Architecture Review Board, runs quarterly maturity reviews, shepherds exceptions, and is accountable for the quality and currency of every standard in this portal.
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
              :style="{ background: m.color }"
              aria-hidden="true"
            >{{ m.initials }}</div>
            <p class="tc-name">{{ m.name }}</p>
            <p class="tc-role">{{ m.role }}</p>
            <p class="tc-focus">{{ m.focus }}</p>
          </div>
        </div>
      </section>

      <!-- Guiding principles -->
      <section class="about-section" aria-labelledby="principles-heading">
        <div class="about-eyebrow">
          <BaseIcon name="compass" :size="13" aria-hidden="true" style="display: inline;" /> How we work
        </div>
        <h2 id="principles-heading">Guiding principles</h2>
        <div class="principles" role="list">
          <div
            v-for="p in PRINCIPLES"
            :key="p.n"
            class="principle"
            role="listitem"
          >
            <div class="pn" aria-hidden="true">{{ p.n }}</div>
            <div>
              <h4>{{ p.title }}</h4>
              <p>{{ p.body }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Maturity model -->
      <section class="about-section" aria-labelledby="maturity-heading">
        <div class="about-eyebrow">
          <BaseIcon name="activity" :size="13" aria-hidden="true" style="display: inline;" /> Maturity model
        </div>
        <h2 id="maturity-heading">Where is your team?</h2>
        <p style="font-size: 16px; color: var(--ink-2); max-width: 64ch; line-height: 1.6; margin: 0 0 28px;">
          Use this model to assess your team's current posture and chart a path forward. Maturity reviews happen quarterly through the Architecture Review Board.
        </p>

        <div
          class="mat-bar"
          role="img"
          aria-label="Maturity model progress bar: 5 levels from Aware to Leading"
        >
          <span
            v-for="(m, i) in MATURITY"
            :key="m.n"
            :style="{ background: MAT_COLORS[i] }"
            :title="`Level ${m.n}: ${m.name}`"
          ></span>
        </div>

        <div class="maturity" role="list">
          <div
            v-for="m in MATURITY"
            :key="m.n"
            class="mat-row"
            role="listitem"
            :aria-label="`Level ${m.n}: ${m.name} — ${m.tag}`"
          >
            <div class="mat-left">
              <div class="mat-level" :style="{ background: m.color }" aria-hidden="true">{{ m.n }}</div>
              <div>
                <div class="ml-name">{{ m.name }}</div>
                <div class="ml-tag">{{ m.tag }}</div>
              </div>
            </div>
            <div class="mat-right">
              <p class="mr-desc">{{ m.desc }}</p>
              <div class="mr-signals" role="list" :aria-label="`Signals for level ${m.n}`">
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
      </section>

      <!-- Process -->
      <section class="about-section" aria-labelledby="process-heading">
        <div class="about-eyebrow">
          <BaseIcon name="clock" :size="13" aria-hidden="true" style="display: inline;" /> Process
        </div>
        <h2 id="process-heading">How standards are maintained</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 8px;">
          <div style="padding: 26px 28px; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface);">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: var(--blue-50); color: var(--blue); display: grid; place-items: center; margin-bottom: 16px;" aria-hidden="true">
              <BaseIcon name="edit" :size="18" />
            </div>
            <h3 style="font-size: 16px; font-weight: 750; margin: 0 0 8px;">Propose</h3>
            <p style="font-size: 14px; color: var(--ink-2); line-height: 1.55; margin: 0;">Any engineer can propose a new standard or a change to an existing one via the proposal form. The owning guild reviews within two weeks.</p>
          </div>
          <div style="padding: 26px 28px; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface);">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: var(--active-50); color: var(--active); display: grid; place-items: center; margin-bottom: 16px;" aria-hidden="true">
              <BaseIcon name="checkCircle" :size="18" />
            </div>
            <h3 style="font-size: 16px; font-weight: 750; margin: 0 0 8px;">Review</h3>
            <p style="font-size: 14px; color: var(--ink-2); line-height: 1.55; margin: 0;">Proposed standards enter a 30-day comment period with cross-guild review. Must-level standards require ARB sign-off before publication.</p>
          </div>
          <div style="padding: 26px 28px; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface);">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: var(--should-50); color: var(--should); display: grid; place-items: center; margin-bottom: 16px;" aria-hidden="true">
              <BaseIcon name="clock" :size="18" />
            </div>
            <h3 style="font-size: 16px; font-weight: 750; margin: 0 0 8px;">Review cadence</h3>
            <p style="font-size: 14px; color: var(--ink-2); line-height: 1.55; margin: 0;">All active standards are reviewed annually by their owners. Must-level standards are reviewed quarterly. Deprecated standards are archived after 12 months.</p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>
