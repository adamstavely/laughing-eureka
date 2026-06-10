<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import BaseIcon from '@/components/BaseIcon.vue';
import ComplianceBadge from '@/components/ComplianceBadge.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import EnablerPill from '@/components/EnablerPill.vue';
import { CAT_ICON } from '@/types';
import type { Standard } from '@/types';

const store = useDataStore();
const router = useRouter();
const route = useRoute();

const q = ref(String(route.query.q ?? ''));
const cats = ref<Set<string>>(new Set(route.query.cat ? [String(route.query.cat)] : []));
const comps = ref<Set<string>>(new Set(route.query.compliance ? [String(route.query.compliance)] : []));
const stats = ref<Set<string>>(new Set(['active', 'draft']));
const team = ref<string>(String(route.query.team ?? ''));
const enablerOnly = ref(route.query.enablerOnly === 'true');
const sort = ref('relevance');

function toggle<T>(set: Set<T>, val: T): Set<T> {
  const n = new Set(set);
  n.has(val) ? n.delete(val) : n.add(val);
  return n;
}

const results = computed<Standard[]>(() => {
  const t = q.value.trim().toLowerCase();
  let r = store.standards.filter((s) => {
    if (cats.value.size && !cats.value.has(s.category)) return false;
    if (comps.value.size && !comps.value.has(s.compliance)) return false;
    if (stats.value.size && !stats.value.has(s.status)) return false;
    if (team.value && !s.appliesTo.includes(team.value)) return false;
    if (enablerOnly.value && !(s.enabler && (s.enabler as any).covers === 'full')) return false;
    if (t) {
      const hay = `${s.title} ${s.id} ${s.summary} ${s.impactHeadline} ${store.catName(s.category)} ${s.enabler ? (s.enabler as any).name : ''}`.toLowerCase();
      if (!hay.includes(t)) return false;
    }
    return true;
  });
  if (sort.value === 'az') r = [...r].sort((a, b) => a.title.localeCompare(b.title));
  else if (sort.value === 'updated') r = [...r].sort((a, b) => b.updated.localeCompare(a.updated));
  else if (sort.value === 'level') {
    const ord = { must: 0, should: 1, may: 2 };
    r = [...r].sort((a, b) => ord[a.compliance] - ord[b.compliance]);
  }
  return r;
});

const activeFilters = computed(() =>
  cats.value.size + comps.value.size + (team.value ? 1 : 0) + (enablerOnly.value ? 1 : 0)
);

function countFor(key: keyof Standard, val: string): number {
  return store.standards.filter((s) => s[key] === val).length;
}

function clearAll() {
  cats.value = new Set();
  comps.value = new Set();
  stats.value = new Set(['active', 'draft']);
  team.value = '';
  enablerOnly.value = false;
  q.value = '';
}

function fmtDate(s: string) {
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="cat-hero" aria-labelledby="browse-heading">
      <div class="wrap cat-hero-row">
        <div class="cat-hero-text">
          <div class="ch-eyebrow">
            <BaseIcon name="search" :size="14" :sw="2" aria-hidden="true" /> Browse
          </div>
          <h1 id="browse-heading">All standards</h1>
          <p>Filter by domain, compliance level, owning team, or jump straight to the standards you get for free by adopting an enterprise enabler.</p>
        </div>
        <div class="cat-hero-art" aria-hidden="true">
          <BaseIcon name="search" :size="200" :sw="1.3" />
        </div>
      </div>
    </section>

    <div class="wrap">
      <div class="browse">
        <!-- Filters sidebar -->
        <aside class="filters" aria-label="Filter standards">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <span style="font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 7px;">
              <BaseIcon name="filter" :size="15" aria-hidden="true" /> Filters
            </span>
            <button
              v-if="activeFilters > 0"
              @click="clearAll"
              style="background: none; border: none; color: var(--blue); font-size: 12.5px; font-weight: 600; padding: 0; cursor: pointer;"
              :aria-label="`Clear all filters (${activeFilters} active)`"
            >
              Clear ({{ activeFilters }})
            </button>
          </div>

          <!-- Enterprise enabler filter -->
          <div class="filter-group">
            <h3 class="filter-group h5" style="font-family: var(--mono); font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 11px;">
              Enterprise enabler
            </h3>
            <button
              class="facet"
              :class="{ on: enablerOnly }"
              :aria-pressed="enablerOnly"
              @click="enablerOnly = !enablerOnly"
            >
              <span class="cbx" aria-hidden="true">
                <BaseIcon v-if="enablerOnly" name="checkSmall" :size="12" :sw="2.6" />
              </span>
              <span style="display: flex; align-items: center; gap: 6px;">
                <BaseIcon name="bolt" :size="13" :sw="2" style="color: var(--enabler);" aria-hidden="true" />
                Compliant-by-default
              </span>
            </button>
          </div>

          <!-- Compliance level -->
          <div class="filter-group">
            <h3 style="font-family: var(--mono); font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 11px;">
              Compliance level
            </h3>
            <button
              v-for="c in ['must', 'should', 'may']"
              :key="c"
              class="facet"
              :class="{ on: comps.has(c) }"
              :aria-pressed="comps.has(c)"
              :aria-label="`Filter by ${c} compliance`"
              @click="comps = toggle(comps, c)"
            >
              <span class="cbx" aria-hidden="true">
                <BaseIcon v-if="comps.has(c)" name="checkSmall" :size="12" :sw="2.6" />
              </span>
              <span style="text-transform: capitalize;">{{ c }}</span>
              <span class="ct">{{ countFor('compliance', c) }}</span>
            </button>
          </div>

          <!-- Domain -->
          <div class="filter-group">
            <h3 style="font-family: var(--mono); font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 11px;">
              Domain
            </h3>
            <button
              v-for="c in store.categories"
              :key="c.id"
              class="facet"
              :class="{ on: cats.has(c.id) }"
              :aria-pressed="cats.has(c.id)"
              :aria-label="`Filter by ${c.name} domain`"
              @click="cats = toggle(cats, c.id)"
            >
              <span class="cbx" aria-hidden="true">
                <BaseIcon v-if="cats.has(c.id)" name="checkSmall" :size="12" :sw="2.6" />
              </span>
              {{ c.name }}
              <span class="ct">{{ countFor('category', c.id) }}</span>
            </button>
          </div>

          <!-- Status -->
          <div class="filter-group">
            <h3 style="font-family: var(--mono); font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 11px;">
              Status
            </h3>
            <button
              v-for="s in ['active', 'draft', 'deprecated']"
              :key="s"
              class="facet"
              :class="{ on: stats.has(s) }"
              :aria-pressed="stats.has(s)"
              :aria-label="`Filter by ${s} status`"
              @click="stats = toggle(stats, s)"
            >
              <span class="cbx" aria-hidden="true">
                <BaseIcon v-if="stats.has(s)" name="checkSmall" :size="12" :sw="2.6" />
              </span>
              <span style="text-transform: capitalize;">{{ s }}</span>
              <span class="ct">{{ countFor('status', s) }}</span>
            </button>
          </div>

          <!-- Owning team -->
          <div class="filter-group">
            <label for="team-filter" style="font-family: var(--mono); font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-3); display: block; margin-bottom: 11px;">
              Owning team
            </label>
            <select
              id="team-filter"
              class="sortsel"
              style="width: 100%;"
              v-model="team"
              aria-label="Filter by owning team"
            >
              <option value="">All teams</option>
              <option v-for="t in store.teams" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </aside>

        <!-- Results -->
        <div>
          <div class="results-top">
            <div class="browse-search" role="search">
              <BaseIcon name="search" :size="17" style="color: var(--ink-4);" aria-hidden="true" />
              <input
                v-model="q"
                type="search"
                placeholder="Search within results..."
                aria-label="Search within filtered results"
              />
              <button
                v-if="q"
                @click="q = ''"
                style="background: none; border: none; color: var(--ink-4); padding: 0; display: flex; cursor: pointer;"
                aria-label="Clear search"
              >
                <BaseIcon name="x" :size="15" />
              </button>
            </div>
            <label for="sort-select" class="sr-only">Sort results</label>
            <select id="sort-select" class="sortsel" v-model="sort" aria-label="Sort results">
              <option value="relevance">Sort: Relevance</option>
              <option value="updated">Recently updated</option>
              <option value="level">Compliance level</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          <div
            class="results-count"
            style="margin-bottom: 16px;"
            aria-live="polite"
            aria-atomic="true"
          >
            <b>{{ results.length }}</b> standard{{ results.length !== 1 ? 's' : '' }}{{ activeFilters > 0 ? ' match your filters' : '' }}
          </div>

          <div v-if="results.length === 0" class="empty" role="status">
            <BaseIcon name="search" :size="34" :sw="1.5" aria-hidden="true" />
            <div style="font-weight: 700; color: var(--ink-2); font-size: 16px; margin-bottom: 6px;">No standards found</div>
            <div>Try removing a filter or searching a different term.</div>
            <button class="btn btn-ghost btn-sm" style="margin-top: 16px;" @click="clearAll">
              Clear all filters
            </button>
          </div>

          <ul v-else class="std-list" aria-label="Standards list">
            <li
              v-for="s in results"
              :key="s.id"
            >
              <button
                class="std-row"
                style="width: 100%;"
                :aria-label="`${s.id}: ${s.title} — ${s.compliance} compliance, ${s.status}`"
                @click="router.push(`/standards/${s.id}`)"
              >
                <div>
                  <div class="sr-head">
                    <span class="idtag">{{ s.id }}</span>
                    <ComplianceBadge :level="s.compliance" />
                    <StatusBadge :status="s.status" />
                  </div>
                  <h3 :style="s.status === 'deprecated' ? { color: 'var(--ink-3)' } : undefined">{{ s.title }}</h3>
                  <p class="sr-sum">{{ s.summary }}</p>
                  <div class="sr-meta">
                    <span style="display: flex; align-items: center; gap: 6px;">
                      <BaseIcon :name="CAT_ICON[s.category] || 'package'" :size="14" aria-hidden="true" />
                      {{ store.catName(s.category) }}
                    </span>
                    <span style="display: flex; align-items: center; gap: 6px;">
                      <BaseIcon name="users" :size="14" aria-hidden="true" />
                      {{ s.owner.team }}
                    </span>
                    <span style="display: flex; align-items: center; gap: 6px;">
                      <BaseIcon name="clock" :size="14" aria-hidden="true" />
                      {{ fmtDate(s.updated) }}
                    </span>
                  </div>
                </div>
                <div class="sr-right">
                  <EnablerPill v-if="s.enabler && s.status !== 'deprecated'" :name="(s.enabler as any).name" />
                  <BaseIcon name="chevronRight" :size="20" style="color: var(--ink-4);" aria-hidden="true" />
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
