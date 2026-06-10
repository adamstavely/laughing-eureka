<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore } from '@/stores/data';
import BaseIcon from '@/components/BaseIcon.vue';

const store = useDataStore();
const router = useRouter();

const TYPES = ['Platform', 'Service', 'Library', 'Template'] as const;

const TYPE_BLURB: Record<string, string> = {
  Platform:  'Fully managed infrastructure you adopt, not build.',
  Service:   'Shared services with well-defined APIs.',
  Library:   'Code packages you include in your project.',
  Template:  'Starter scaffolds that encode best practices.',
};

const grouped = computed(() => {
  return TYPES.map((type) => ({
    type,
    blurb: TYPE_BLURB[type],
    items: store.enablers.filter((e) => e.type === type),
  })).filter((g) => g.items.length > 0);
});

const stats = computed(() => ({
  enablers: store.enablers.length,
  standardsCovered: new Set(store.enablers.flatMap((e) => e.meets.map((m) => m.id))).size,
  compliantByDefault: store.standards.filter(
    (s) => s.enabler && (s.enabler as any).covers === 'full' && s.status !== 'deprecated'
  ).length,
}));

const COV_LABEL: Record<string, string> = {
  full:    'Full coverage',
  most:    'Mostly covered',
  partial: 'Partial coverage',
};
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="cat-hero" aria-labelledby="enablers-heading">
      <div class="wrap cat-hero-row">
        <div class="cat-hero-text">
          <div class="ch-eyebrow">
            <BaseIcon name="bolt" :size="14" :sw="2" aria-hidden="true" /> Enterprise enablers
          </div>
          <h1 id="enablers-heading">Compliant by default</h1>
          <p>Adopt an enterprise enabler and the standards it satisfies are met for you — by construction, not by documentation.</p>
          <div class="ch-stats" role="list" aria-label="Enabler statistics">
            <div class="ch-stat" role="listitem">
              <span class="ch-stat-n">{{ stats.enablers }}</span>
              <span class="ch-stat-l">enablers available</span>
            </div>
            <div class="ch-stat" role="listitem">
              <span class="ch-stat-n">{{ stats.standardsCovered }}</span>
              <span class="ch-stat-l">standards covered</span>
            </div>
            <div class="ch-stat" role="listitem">
              <span class="ch-stat-n">{{ stats.compliantByDefault }}</span>
              <span class="ch-stat-l">compliant by default</span>
            </div>
          </div>
        </div>
        <div class="cat-hero-art" aria-hidden="true">
          <BaseIcon name="bolt" :size="200" :sw="1.3" />
        </div>
      </div>
    </section>

    <!-- Catalog -->
    <div class="wrap">
      <div
        v-for="group in grouped"
        :key="group.type"
        class="cap-group"
        :aria-label="`${group.type} enablers`"
      >
        <div class="cap-group-head">
          <h2>{{ group.type }}</h2>
          <span class="cgh-sub">{{ group.blurb }}</span>
        </div>
        <div class="cap-grid" role="list">
          <button
            v-for="e in group.items"
            :key="e.id"
            class="cap-card"
            role="listitem"
            :aria-label="`${e.name}: ${e.tagline}`"
            @click="router.push(`/enablers/${e.id}`)"
          >
            <div class="cap-top">
              <div class="cap-ico" aria-hidden="true">
                <BaseIcon name="bolt" :size="20" :sw="2" />
              </div>
              <span class="cap-team">{{ e.team }}</span>
            </div>
            <h3 class="cap-name">{{ e.name }}</h3>
            <p class="cap-tagline">{{ e.tagline }}</p>
            <div class="cap-foot">
              <div class="cap-owner">
                <div
                  class="cap-av"
                  aria-hidden="true"
                  style="width: 24px; height: 24px; border-radius: 6px; background: var(--blue); color: #fff; display: grid; place-items: center; font-size: 11px; font-weight: 700; flex-shrink: 0;"
                >
                  {{ e.owner.name.split(' ').map((n) => n[0]).join('').slice(0, 2) }}
                </div>
                <span class="cap-owner-name">{{ e.owner.name }}</span>
              </div>
              <div class="cap-meets" aria-label="Standards covered">
                <span
                  v-for="m in e.meets.slice(0, 3)"
                  :key="m.id"
                  class="meet-chip"
                  :title="`${m.id}: ${COV_LABEL[m.covers]}`"
                >
                  <span :class="`mc-dot mcd-${m.covers}`" aria-hidden="true"></span>
                  <span class="mc-id">{{ m.id }}</span>
                </span>
                <span
                  v-if="e.meets.length > 3"
                  class="meet-chip"
                  :title="`+${e.meets.length - 3} more standards`"
                >
                  <span class="mc-id">+{{ e.meets.length - 3 }}</span>
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
