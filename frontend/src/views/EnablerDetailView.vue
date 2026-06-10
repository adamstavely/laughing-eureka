<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import BaseIcon from '@/components/BaseIcon.vue';
import ComplianceBadge from '@/components/ComplianceBadge.vue';
import StatusBadge from '@/components/StatusBadge.vue';

const store = useDataStore();
const router = useRouter();
const route = useRoute();

const enabler = computed(() => store.getEnabler(String(route.params.id)));

const meetsStandards = computed(() => {
  if (!enabler.value) return [];
  return enabler.value.meets.map((m) => ({
    ref: m,
    standard: store.getStandard(m.id),
  })).filter((x) => x.standard);
});

const COV_LABEL: Record<string, string> = {
  full:    'Full coverage',
  most:    'Mostly covered',
  partial: 'Partial coverage',
};

const COV_DESC: Record<string, string> = {
  full:    'Adopting this enabler fully satisfies this standard.',
  most:    'Covers the majority of requirements; a small gap remains.',
  partial: 'Covers part of the standard; additional work needed.',
};
</script>

<template>
  <div v-if="enabler" class="detail">
    <div class="wrap">

      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <button @click="router.push('/')" aria-label="Go to home">Home</button>
        <span class="sep" aria-hidden="true"><BaseIcon name="chevronRight" :size="13" /></span>
        <button @click="router.push('/enablers')" aria-label="Go to enablers">Enablers</button>
        <span class="sep" aria-hidden="true"><BaseIcon name="chevronRight" :size="13" /></span>
        <span aria-current="page">{{ enabler.name }}</span>
      </nav>

      <!-- Enabler hero -->
      <div class="ed-hero">
        <div class="ed-ico" aria-hidden="true">
          <BaseIcon name="bolt" :size="28" :sw="2" />
        </div>
        <div class="ed-hero-text">
          <div class="ed-tags">
            <span class="ed-type">{{ enabler.type }}</span>
            <span class="ed-team">
              <BaseIcon name="users" :size="13" aria-hidden="true" />
              {{ enabler.team }}
            </span>
          </div>
          <h1>{{ enabler.name }}</h1>
          <p class="ed-tagline">{{ enabler.tagline }}</p>
        </div>
        <div class="ed-actions">
          <button class="btn btn-enabler" :aria-label="`${enabler.cta} — opens go/${enabler.docs}`">
            <BaseIcon name="bolt" :size="15" aria-hidden="true" />
            {{ enabler.cta }}
          </button>
          <a class="ed-docs" :href="`https://${enabler.docs}`" target="_blank" rel="noopener noreferrer">
            <BaseIcon name="link" :size="13" aria-hidden="true" />
            {{ enabler.docs }}
          </a>
        </div>
      </div>

      <!-- Body + side rail -->
      <div class="detail-body">
        <div class="dcol-main">

          <!-- What it does -->
          <section aria-labelledby="what-it-does">
            <div class="dblock">
              <div class="db-label" id="what-it-does">
                <BaseIcon name="info" :size="14" aria-hidden="true" /> What it does
              </div>
              <p class="prose">{{ enabler.what }}</p>
            </div>
          </section>

          <!-- What you get -->
          <section aria-labelledby="what-you-get" style="margin-top: 28px;">
            <div class="dblock">
              <div class="db-label" id="what-you-get">
                <BaseIcon name="checkCircle" :size="14" aria-hidden="true" /> What you get
              </div>
              <ul class="practice-list" role="list">
                <li v-for="(item, i) in enabler.gets" :key="i" style="display: flex; gap: 11px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid var(--border);">
                  <span
                    style="width: 22px; height: 22px; border-radius: 50%; background: var(--enabler-50); color: var(--enabler); display: grid; place-items: center; flex-shrink: 0; margin-top: 1px; border: 1px solid var(--enabler-100);"
                    aria-hidden="true"
                  >
                    <BaseIcon name="check" :size="12" :sw="2.5" />
                  </span>
                  <span style="font-size: 15px; color: var(--ink-2); line-height: 1.55;">{{ item }}</span>
                </li>
              </ul>
            </div>
          </section>

          <!-- Standards it helps you meet -->
          <section aria-labelledby="standards-met" style="margin-top: 28px;">
            <div class="dblock">
              <div class="db-label" id="standards-met">
                <BaseIcon name="shield" :size="14" aria-hidden="true" /> Standards it helps you meet
              </div>
              <div class="meets-list" role="list">
                <button
                  v-for="item in meetsStandards"
                  :key="item.ref.id"
                  class="meets-row"
                  role="listitem"
                  :aria-label="`${item.ref.id}: ${item.standard!.title} — ${COV_LABEL[item.ref.covers]}`"
                  @click="router.push(`/standards/${item.ref.id}`)"
                >
                  <span class="mr-id">{{ item.ref.id }}</span>
                  <div class="mr-main">
                    <div class="mr-title">{{ item.standard!.title }}</div>
                    <div class="mr-meta">
                      <ComplianceBadge :level="item.standard!.compliance" />
                      <StatusBadge :status="item.standard!.status" />
                    </div>
                  </div>
                  <div class="mr-cov">
                    <span
                      :style="{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: '600',
                        color: item.ref.covers === 'full' ? 'var(--enabler-700)' : item.ref.covers === 'most' ? 'var(--should)' : 'var(--ink-3)',
                        background: item.ref.covers === 'full' ? 'var(--enabler-50)' : item.ref.covers === 'most' ? 'var(--should-50)' : 'var(--bg-sunken)',
                        border: '1px solid',
                        borderColor: item.ref.covers === 'full' ? 'var(--enabler-100)' : item.ref.covers === 'most' ? '#e6d5a8' : 'var(--border)',
                        borderRadius: '6px', padding: '3px 9px',
                      }"
                    >
                      <span
                        :class="`mc-dot mcd-${item.ref.covers}`"
                        style="width: 6px; height: 6px; border-radius: 50%;"
                        aria-hidden="true"
                      ></span>
                      {{ COV_LABEL[item.ref.covers] }}
                    </span>
                    <span class="mr-note">{{ COV_DESC[item.ref.covers] }}</span>
                  </div>
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- Side rail -->
        <aside class="dcol-side" aria-label="Enabler details">

          <!-- Owner card -->
          <div class="dcard" aria-labelledby="owner-heading">
            <div class="dc-head" id="owner-heading">
              <BaseIcon name="users" :size="13" aria-hidden="true" /> Owner
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div
                style="width: 42px; height: 42px; border-radius: 11px; background: var(--blue); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 14px; flex-shrink: 0;"
                aria-hidden="true"
              >
                {{ enabler.owner.name.split(' ').map((n) => n[0]).join('').slice(0, 2) }}
              </div>
              <div>
                <div style="font-weight: 700; font-size: 14.5px;">{{ enabler.owner.name }}</div>
                <div style="font-size: 12.5px; color: var(--ink-3); margin-top: 2px;">{{ enabler.owner.role }}</div>
              </div>
            </div>
            <a
              :href="`mailto:${enabler.owner.email}`"
              class="btn btn-ghost btn-sm"
              style="width: 100%; justify-content: center;"
              :aria-label="`Email ${enabler.owner.name}`"
            >
              <BaseIcon name="mail" :size="14" aria-hidden="true" /> Contact owner
            </a>
          </div>

          <!-- Details meta -->
          <div class="dcard">
            <div class="dc-head">
              <BaseIcon name="info" :size="13" aria-hidden="true" /> Details
            </div>
            <dl class="meta-list">
              <div class="meta-row">
                <dt>Type</dt>
                <dd>{{ enabler.type }}</dd>
              </div>
              <div class="meta-row">
                <dt>Team</dt>
                <dd>{{ enabler.team }}</dd>
              </div>
              <div class="meta-row">
                <dt>Standards</dt>
                <dd>{{ enabler.meets.length }} covered</dd>
              </div>
              <div class="meta-row">
                <dt>Docs</dt>
                <dd>
                  <a
                    :href="`https://${enabler.docs}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="color: var(--blue); font-weight: 600;"
                    :aria-label="`Open docs at ${enabler.docs}`"
                  >{{ enabler.docs }}</a>
                </dd>
              </div>
            </dl>
          </div>

          <!-- CTA card -->
          <div class="dcard" style="background: var(--enabler-50); border-color: var(--enabler-100);">
            <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px; color: var(--ink);">
              Ready to adopt?
            </div>
            <p style="font-size: 13px; color: var(--ink-2); line-height: 1.5; margin: 0 0 14px;">
              Adopt this enabler and {{ enabler.meets.filter(m => m.covers === 'full').length }} standard{{ enabler.meets.filter(m => m.covers === 'full').length !== 1 ? 's are' : ' is' }} met for you automatically.
            </p>
            <button
              class="btn btn-enabler btn-sm"
              style="width: 100%; justify-content: center;"
              :aria-label="enabler.cta"
            >
              <BaseIcon name="bolt" :size="14" aria-hidden="true" />
              {{ enabler.cta }}
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <!-- Not found -->
  <div v-else class="wrap" style="padding: 80px 0; text-align: center; color: var(--ink-3);">
    <BaseIcon name="alert" :size="40" :sw="1.5" aria-hidden="true" style="margin-bottom: 16px;" />
    <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px; color: var(--ink-2);">Enabler not found</div>
    <p>The enabler you're looking for doesn't exist or hasn't loaded yet.</p>
    <button class="btn btn-ghost" style="margin-top: 16px;" @click="router.push('/enablers')">
      Back to enablers
    </button>
  </div>
</template>
