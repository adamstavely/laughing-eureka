<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '@/stores/data';
import BaseIcon from '@/components/BaseIcon.vue';
import ComplianceBadge from '@/components/ComplianceBadge.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { AttachedEnabler, TechContent } from '@/types';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

const standard = computed(() => store.getStandard(String(route.params.id)));
const techOpen = ref(false);
const techRef = ref<HTMLElement | null>(null);

watch(() => route.params.id, () => {
  techOpen.value = false;
  window.scrollTo(0, 0);
});

function fmtDate(s: string) {
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function openDeepDive() {
  techOpen.value = true;
  requestAnimationFrame(() => {
    if (techRef.value) {
      const y = techRef.value.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      (techRef.value.querySelector('button') as HTMLElement)?.focus();
    }
  });
}

const impactCols = computed(() => {
  const n = standard.value?.impact?.length ?? 0;
  return n === 3 ? '' : n === 2 ? 'cols-2' : 'cols-1';
});

const coverageLabels: Record<string, string> = {
  full: 'Fully compliant',
  most: 'Mostly compliant',
  partial: 'Partial coverage',
};
</script>

<template>
  <div class="detail" v-if="standard">
    <div class="wrap">
      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <button @click="router.push('/')">Standards</button>
        <span class="sep" aria-hidden="true"><BaseIcon name="chevronRight" :size="14" /></span>
        <button @click="router.push({ path: '/browse', query: { cat: standard.category } })">
          {{ store.catName(standard.category) }}
        </button>
        <span class="sep" aria-hidden="true"><BaseIcon name="chevronRight" :size="14" /></span>
        <span class="mono" style="color: var(--ink-2);" aria-current="page">{{ standard.id }}</span>
      </nav>

      <!-- Detail hero -->
      <div class="detail-hero">
        <div class="dh-tags">
          <span class="idtag">{{ standard.id }}</span>
          <ComplianceBadge :level="standard.compliance" size="lg" />
          <StatusBadge :status="standard.status" />
          <span style="margin-left: auto; display: flex; gap: 10px; flex-wrap: wrap;">
            <button
              v-if="standard.enabler && standard.status !== 'deprecated'"
              class="btn btn-enabler btn-sm"
              @click="router.push(`/enablers/${(standard.enabler as AttachedEnabler).id}`)"
            >
              <BaseIcon name="bolt" :size="14" :sw="2" aria-hidden="true" />
              {{ (standard.enabler as AttachedEnabler).cta }}
            </button>
            <button
              v-if="standard.tech"
              class="btn btn-ghost btn-sm"
              @click="openDeepDive"
            >
              <BaseIcon name="server" :size="14" aria-hidden="true" />
              Technical deep dive
            </button>
            <button class="btn btn-ghost btn-sm" aria-label="Share this standard">
              <BaseIcon name="link" :size="14" aria-hidden="true" />
              Share
            </button>
          </span>
        </div>
        <h1>{{ standard.title }}</h1>
        <p class="dh-summary">{{ standard.summary }}</p>
      </div>

      <!-- Body -->
      <div class="detail-body">
        <div class="dcol-main">
          <!-- Deprecated banner -->
          <div v-if="standard.status === 'deprecated'" class="dep-banner" role="alert">
            <span class="db-ic"><BaseIcon name="alert" :size="18" aria-hidden="true" /></span>
            <span><b>This standard is deprecated.</b> {{ standard.exceptions }}</span>
          </div>

          <!-- Business impact -->
          <div class="impact" aria-labelledby="impact-label">
            <div class="ix">
              <div class="ilabel" id="impact-label">
                <BaseIcon name="bolt" :size="13" :sw="2" aria-hidden="true" /> Business impact
              </div>
              <h2 class="serif">{{ standard.impactHeadline }}</h2>
              <div :class="['impact-stats', impactCols]">
                <div v-for="(it, i) in standard.impact" :key="i" class="istat">
                  <div class="n">{{ it.stat }}</div>
                  <div class="l">{{ it.label }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enterprise enabler -->
          <div v-if="standard.enabler && standard.status !== 'deprecated'" class="dblock">
            <div class="enabler-card" :aria-labelledby="`enabler-name-${standard.id}`">
              <div class="ec-head">
                <div class="ec-icon" aria-hidden="true">
                  <BaseIcon name="bolt" :size="24" :sw="2" />
                </div>
                <div style="flex: 1;">
                  <div class="ec-eyebrow">
                    <BaseIcon name="sparkles" :size="12" :sw="2" aria-hidden="true" />
                    Enterprise enabler · the paved path
                  </div>
                  <h3 :id="`enabler-name-${standard.id}`" class="ec-name">{{ (standard.enabler as AttachedEnabler).name }}</h3>
                  <div class="ec-type">{{ (standard.enabler as AttachedEnabler).type }} · maintained by {{ (standard.enabler as AttachedEnabler).team }}</div>
                </div>
                <span :class="`coverage-tag cov-${(standard.enabler as AttachedEnabler).covers}`">
                  {{ coverageLabels[(standard.enabler as AttachedEnabler).covers] }}
                </span>
              </div>
              <p class="ec-desc">{{ (standard.enabler as AttachedEnabler).desc }}</p>
              <ul class="enabler-gets" aria-label="What you get">
                <li v-for="(g, i) in (standard.enabler as AttachedEnabler).gets" :key="i">
                  <span class="ck" aria-hidden="true"><BaseIcon name="checkSmall" :size="12" :sw="3" /></span>
                  {{ g }}
                </li>
              </ul>
              <div class="enabler-foot">
                <span class="ef-note">
                  <BaseIcon name="shield" :size="15" :sw="2" aria-hidden="true" />
                  <template v-if="(standard.enabler as AttachedEnabler).covers === 'full'">Adopt this and you are compliant by default, no extra work.</template>
                  <template v-else-if="(standard.enabler as AttachedEnabler).covers === 'most'">Covers most requirements automatically; review the rest.</template>
                  <template v-else>Covers part of this standard; you supply the specifics.</template>
                </span>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="mono" style="font-size: 12px; color: var(--enabler-700);">{{ (standard.enabler as AttachedEnabler).docs }}</span>
                  <button
                    class="btn btn-enabler btn-sm"
                    @click="router.push(`/enablers/${(standard.enabler as AttachedEnabler).id}`)"
                  >
                    {{ (standard.enabler as AttachedEnabler).cta }}
                    <BaseIcon name="arrowRight" :size="14" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Why it matters -->
          <div class="dblock">
            <h3>
              <BaseIcon name="book" :size="14" aria-hidden="true" /> Why it matters
            </h3>
            <div class="prose"><p>{{ standard.why }}</p></div>
          </div>

          <!-- What good looks like -->
          <div class="dblock">
            <h3>
              <BaseIcon name="check" :size="14" aria-hidden="true" /> What good looks like
            </h3>
            <ul class="practice-list">
              <li v-for="(p, i) in standard.practice" :key="i">
                <span class="pk" aria-hidden="true"><BaseIcon name="checkSmall" :size="13" :sw="2.6" /></span>
                <span>{{ p }}</span>
              </li>
            </ul>
          </div>

          <!-- Exceptions -->
          <div class="dblock">
            <h3>
              <BaseIcon name="flag" :size="14" aria-hidden="true" /> Exceptions &amp; deviations
            </h3>
            <div class="callout" role="note" aria-label="Exception process">
              <span class="co-ic" aria-hidden="true"><BaseIcon name="alert" :size="20" /></span>
              <div>
                <h4>How to request an exception</h4>
                <p>{{ standard.exceptions }}</p>
              </div>
            </div>
          </div>

          <!-- Technical deep dive -->
          <section
            v-if="standard.tech"
            :class="['techdive', { 'is-open': techOpen }]"
            ref="techRef"
            :aria-label="`Technical deep dive for ${standard.id}`"
          >
            <button
              class="td-bar"
              @click="techOpen = !techOpen"
              :aria-expanded="techOpen"
              aria-controls="techdive-body"
            >
              <span class="td-bar-ic" aria-hidden="true"><BaseIcon name="server" :size="18" :sw="2" /></span>
              <span class="td-bar-text">
                <span class="td-bar-title">Technical deep dive</span>
                <span class="td-bar-sub">{{ (standard.tech as TechContent).tagline }}</span>
              </span>
              <span class="td-bar-tag" aria-hidden="true">For implementers</span>
              <BaseIcon name="chevronDown" :size="18" class="td-chev" aria-hidden="true" />
            </button>

            <div v-if="techOpen" id="techdive-body" class="td-body">
              <!-- Conformance criteria -->
              <div class="td-section">
                <div class="td-head" aria-hidden="true">
                  <BaseIcon name="scale" :size="14" /> Conformance criteria
                </div>
                <h4 class="sr-only">Conformance criteria</h4>
                <div class="conf-list" role="list">
                  <div
                    v-for="c in (standard.tech as TechContent).conformance"
                    :key="c.ref"
                    class="conf-row"
                    role="listitem"
                  >
                    <span class="conf-ref mono">{{ c.ref }}</span>
                    <span :class="`conf-lvl cl-${c.level}`">{{ c.level.toUpperCase() }}</span>
                    <span class="conf-text">{{ c.text }}</span>
                  </div>
                </div>
              </div>

              <!-- Reference config -->
              <div v-if="(standard.tech as TechContent).config" class="td-section">
                <div class="td-head" aria-hidden="true">
                  <BaseIcon name="layout" :size="14" /> Reference configuration
                </div>
                <h4 class="sr-only">Reference configuration</h4>
                <div class="code-block">
                  <div class="cb-head">
                    <span class="cb-label">{{ (standard.tech as TechContent).config!.label }}</span>
                    <span class="cb-lang mono">{{ (standard.tech as TechContent).config!.lang }}</span>
                  </div>
                  <pre class="cb-pre"><code>{{ (standard.tech as TechContent).config!.code }}</code></pre>
                </div>
              </div>

              <!-- Verify + References grid -->
              <div class="td-grid">
                <div class="td-section">
                  <div class="td-head" aria-hidden="true">
                    <BaseIcon name="checkSmall" :size="15" :sw="2.4" /> How compliance is verified
                  </div>
                  <h4 class="sr-only">How compliance is verified</h4>
                  <ul class="verify-list">
                    <li v-for="(v, i) in (standard.tech as TechContent).verify" :key="i">
                      <span class="vk" aria-hidden="true"><BaseIcon name="checkSmall" :size="12" :sw="3" /></span>
                      <span>{{ v }}</span>
                    </li>
                  </ul>
                </div>
                <div class="td-section">
                  <div class="td-head" aria-hidden="true">
                    <BaseIcon name="book" :size="14" /> Normative references
                  </div>
                  <h4 class="sr-only">Normative references</h4>
                  <div class="refs-list">
                    <div v-for="(r, i) in (standard.tech as TechContent).refs" :key="i" class="ref-row">
                      <span class="ref-label">{{ r.label }}</span>
                      <span class="ref-note">{{ r.note }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Side rail -->
        <aside class="dcol-side" aria-label="Standard details">
          <!-- Metadata -->
          <div class="rail-card">
            <div class="rc-title" id="details-heading">Details</div>
            <dl class="meta-list" aria-labelledby="details-heading" style="margin-top: 10px;">
              <div class="meta-row">
                <dt class="mk">Standard ID</dt>
                <dd class="mv mono" style="margin: 0;">{{ standard.id }}</dd>
              </div>
              <div class="meta-row">
                <dt class="mk">Compliance</dt>
                <dd class="mv" style="margin: 0;"><ComplianceBadge :level="standard.compliance" /></dd>
              </div>
              <div class="meta-row">
                <dt class="mk">Status</dt>
                <dd class="mv" style="margin: 0;"><StatusBadge :status="standard.status" /></dd>
              </div>
              <div class="meta-row">
                <dt class="mk">Domain</dt>
                <dd class="mv" style="margin: 0;">{{ store.catName(standard.category) }}</dd>
              </div>
              <div class="meta-row">
                <dt class="mk">Version</dt>
                <dd class="mv mono" style="margin: 0;">v{{ standard.version }}</dd>
              </div>
              <div class="meta-row">
                <dt class="mk">Updated</dt>
                <dd class="mv" style="margin: 0;">{{ fmtDate(standard.updated) }}</dd>
              </div>
            </dl>
          </div>

          <!-- Owner -->
          <div class="rail-card">
            <div class="rc-title" style="padding-bottom: 6px;">Owner</div>
            <div class="owner-card" style="padding-top: 4px;">
              <div class="owner-id">
                <div class="avatar" aria-hidden="true">
                  {{ standard.owner.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('') }}
                </div>
                <div>
                  <div class="on">{{ standard.owner.name }}</div>
                  <div class="or">{{ standard.owner.role }}</div>
                </div>
              </div>
              <a
                class="btn btn-ghost btn-sm"
                :href="`mailto:${standard.owner.email}`"
                style="justify-content: center;"
                :aria-label="`Contact owner ${standard.owner.name} by email`"
              >
                <BaseIcon name="mail" :size="14" aria-hidden="true" /> Contact owner
              </a>
            </div>
          </div>

          <!-- Applies to -->
          <div class="rail-card">
            <div class="rc-title" style="padding-bottom: 8px;">Applies to</div>
            <div class="applies-tags" role="list" aria-label="Teams this standard applies to">
              <span v-for="t in standard.appliesTo" :key="t" class="tg" role="listitem">{{ t }}</span>
            </div>
          </div>

          <!-- Related standards -->
          <div v-if="standard.related.length > 0" class="rail-card">
            <div class="rc-title" style="padding-bottom: 6px;">Related standards</div>
            <div class="related-list" role="list">
              <button
                v-for="rid in standard.related"
                :key="rid"
                class="related-row"
                role="listitem"
                :aria-label="`View related standard ${rid}: ${store.getStandard(rid)?.title ?? rid}`"
                @click="router.push(`/standards/${rid}`)"
              >
                <span class="rr-id">{{ rid }}</span>
                <span class="rr-t">{{ store.getStandard(rid)?.title }}</span>
                <BaseIcon name="chevronRight" :size="16" style="color: var(--ink-4); margin-left: auto; flex-shrink: 0;" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Version history -->
          <div class="rail-card">
            <div class="rc-title" style="padding-bottom: 10px;">Version history</div>
            <div style="padding: 4px 16px 18px;">
              <ol class="timeline" aria-label="Version history" style="list-style: none; margin: 0; padding-left: 22px;">
                <li
                  v-for="(h, i) in standard.history"
                  :key="i"
                  :class="['tl-item', { cur: i === 0 }]"
                >
                  <div class="tl-head">
                    <span class="tl-v">v{{ h.v }}</span>
                    <span class="tl-date">{{ fmtDate(h.date) }}</span>
                  </div>
                  <div class="tl-note">{{ h.note }}</div>
                </li>
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <!-- Not found -->
  <div v-else class="wrap" style="padding: 60px 0; text-align: center;">
    <p>Standard not found. <RouterLink to="/browse">Browse all standards</RouterLink></p>
  </div>
</template>
