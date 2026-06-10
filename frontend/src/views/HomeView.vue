<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore } from '@/stores/data';
import BaseIcon from '@/components/BaseIcon.vue';
import ComplianceBadge from '@/components/ComplianceBadge.vue';
import EnablerPill from '@/components/EnablerPill.vue';
import { CAT_ICON } from '@/types';

const store = useDataStore();
const router = useRouter();

const q = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const suggestionsRef = ref<HTMLElement | null>(null);
const showSuggestions = ref(false);

const FEATURED_IDS = ['SEC-001', 'REL-001', 'AI-001'];

const featured = computed(() =>
  FEATURED_IDS.map((id) => store.standards.find((s) => s.id === id)).filter(Boolean)
);

const counts = computed(() => ({
  must:   store.standards.filter((s) => s.compliance === 'must' && s.status !== 'deprecated').length,
  should: store.standards.filter((s) => s.compliance === 'should' && s.status !== 'deprecated').length,
  active: store.standards.filter((s) => s.status === 'active').length,
  compliantByDefault: store.standards.filter((s) => s.enabler && (s.enabler as any).covers === 'full' && s.status !== 'deprecated').length,
}));

const suggestions = computed(() => {
  const t = q.value.trim().toLowerCase();
  if (t.length < 2) return [];
  return store.standards
    .filter((s) =>
      s.title.toLowerCase().includes(t) ||
      s.id.toLowerCase().includes(t) ||
      s.summary.toLowerCase().includes(t) ||
      store.catName(s.category).toLowerCase().includes(t)
    )
    .slice(0, 6);
});

function onInput() {
  showSuggestions.value = suggestions.value.length > 0;
}

function submit(term?: string) {
  const query = term ?? q.value;
  showSuggestions.value = false;
  router.push({ path: '/browse', query: query ? { q: query } : undefined });
}

function selectSuggestion(id: string) {
  showSuggestions.value = false;
  router.push(`/standards/${id}`);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') submit();
  if (e.key === 'Escape') { showSuggestions.value = false; }
  if (e.key === 'ArrowDown' && suggestionsRef.value) {
    e.preventDefault();
    const first = suggestionsRef.value.querySelector<HTMLElement>('button');
    first?.focus();
  }
}

function browseCategory(id: string) {
  router.push({ path: '/browse', query: { cat: id } });
}

function onBlurSearch() {
  setTimeout(() => { showSuggestions.value = false; }, 150);
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero" aria-labelledby="hero-heading">
      <div class="wrap hero-row">
        <div class="hero-main">
          <div class="hero-eyebrow" aria-hidden="true">
            <BaseIcon name="compass" :size="14" :sw="2" /> Engineering standards
          </div>
          <h1 id="hero-heading" class="serif">
            Standards that explain <em>why</em>, not just what.
          </h1>
          <p class="lede">
            The single source of truth for how we build at Acme. Every standard leads with its business impact, tells you who owns it, and points to the enterprise enabler that makes you compliant by default.
          </p>

          <div style="position: relative; max-width: 660px;">
            <div class="searchbar" role="search">
              <BaseIcon name="search" :size="21" style="color: var(--ink-4);" aria-hidden="true" />
              <input
                ref="inputRef"
                v-model="q"
                type="search"
                placeholder='Search standards, e.g. "encryption", "SLO", "SEC-001"...'
                aria-label="Search engineering standards"
                :aria-expanded="showSuggestions"
                :aria-controls="showSuggestions ? 'search-suggestions' : undefined"
                aria-autocomplete="list"
                @input="onInput"
                @keydown="onKeydown"
                @focus="onInput"
                @blur="onBlurSearch"
              />
              <button class="btn btn-primary" @click="submit()" aria-label="Search">
                Search
              </button>
            </div>

            <div
              v-if="showSuggestions && suggestions.length > 0"
              id="search-suggestions"
              class="suggestions"
              role="listbox"
              aria-label="Search suggestions"
              ref="suggestionsRef"
            >
              <button
                v-for="s in suggestions"
                :key="s!.id"
                class="suggestion-item"
                role="option"
                :aria-label="`${s!.id}: ${s!.title} (${s!.compliance})`"
                @click="selectSuggestion(s!.id)"
                @keydown.arrow-up.prevent="(($event.target as HTMLElement).previousElementSibling as HTMLElement | null)?.focus() ?? inputRef?.focus()"
                @keydown.arrow-down.prevent="(($event.target as HTMLElement).nextElementSibling as HTMLElement | null)?.focus()"
                @keydown.escape="showSuggestions = false; inputRef?.focus()"
              >
                <span class="idtag" style="width: 64px; flex-shrink: 0;">{{ s!.id }}</span>
                <span style="flex: 1; font-weight: 600; font-size: 14.5px;">{{ s!.title }}</span>
                <ComplianceBadge :level="s!.compliance" />
              </button>
            </div>
          </div>

          <div class="search-hints" role="group" aria-label="Quick search shortcuts">
            <span class="lbl" id="hints-label">Jump to:</span>
            <button
              v-for="hint in ['Security', 'encryption', 'SLOs', 'accessibility', 'API versioning']"
              :key="hint"
              class="chip"
              :aria-label="`Search for ${hint}`"
              @click="q = hint; submit(hint)"
            >{{ hint }}</button>
          </div>
        </div>

        <div class="hero-art" aria-hidden="true">
          <BaseIcon name="layers" :size="230" :sw="1.3" />
        </div>
      </div>
    </section>

    <!-- Start here / Featured -->
    <section class="section" aria-labelledby="featured-heading">
      <div class="wrap">
        <div class="section-head">
          <div>
            <h2 id="featured-heading">Start here</h2>
            <div class="sub" style="margin-top: 4px;">The standards every team should know first.</div>
          </div>
          <RouterLink to="/browse" class="btn btn-ghost btn-sm">
            Browse all <BaseIcon name="arrowRight" :size="15" aria-hidden="true" />
          </RouterLink>
        </div>

        <div class="featured-grid" role="list">
          <button
            v-for="s in featured"
            :key="s!.id"
            class="feat-card"
            role="listitem"
            :aria-label="`${s!.id}: ${s!.title} — ${s!.impactHeadline}`"
            @click="router.push(`/standards/${s!.id}`)"
          >
            <div class="fc-top">
              <span class="idtag">{{ s!.id }}</span>
              <ComplianceBadge :level="s!.compliance" />
            </div>
            <h3>{{ s!.title }}</h3>
            <p>{{ s!.impactHeadline }}</p>
            <div class="fc-foot">
              <EnablerPill v-if="s!.enabler" :name="(s!.enabler as any).name" />
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Browse by domain -->
    <section class="section" aria-labelledby="domains-heading">
      <div class="wrap">
        <div class="section-head">
          <div><h2 id="domains-heading">Browse by domain</h2></div>
          <div class="sub">
            {{ store.standards.filter(s => s.status !== 'deprecated').length }} active standards across {{ store.categories.length }} domains
          </div>
        </div>
        <div class="cat-grid" role="list">
          <button
            v-for="c in store.categories"
            :key="c.id"
            class="cat-card"
            role="listitem"
            :aria-label="`${c.name}: ${c.blurb} — ${c.count} standard${c.count !== 1 ? 's' : ''}`"
            @click="browseCategory(c.id)"
          >
            <div class="ci" aria-hidden="true">
              <BaseIcon :name="CAT_ICON[c.id] || 'package'" :size="19" />
            </div>
            <h4>{{ c.name }}</h4>
            <div class="cc-blurb">{{ c.blurb }}</div>
            <div class="cc-count">{{ c.count }} standard{{ c.count !== 1 ? 's' : '' }}</div>
          </button>
        </div>
      </div>
    </section>

    <!-- By compliance level -->
    <section class="section" aria-labelledby="compliance-heading">
      <div class="wrap">
        <div class="section-head">
          <div><h2 id="compliance-heading">By compliance level</h2></div>
        </div>
        <div class="lens-row" role="list">
          <button
            class="lens-card"
            style="border-top: 3px solid var(--must);"
            role="listitem"
            aria-label="Must standards: mandatory. Non-compliance requires a formal exception."
            @click="router.push({ path: '/browse', query: { compliance: 'must' } })"
          >
            <div class="lc-n" style="color: var(--must);">{{ counts.must }}</div>
            <div class="lc-l">Must: mandatory</div>
            <div class="lc-d">Mandatory. Non-compliance requires a formal exception.</div>
          </button>
          <button
            class="lens-card"
            style="border-top: 3px solid var(--should);"
            role="listitem"
            aria-label="Should standards: strongly recommended."
            @click="router.push({ path: '/browse', query: { compliance: 'should' } })"
          >
            <div class="lc-n" style="color: var(--should);">{{ counts.should }}</div>
            <div class="lc-l">Should: recommended</div>
            <div class="lc-d">Strongly recommended. Deviate only with good reason.</div>
          </button>
          <button
            class="lens-card"
            style="border-top: 3px solid var(--enabler);"
            role="listitem"
            aria-label="Compliant-by-default standards: adopt the enterprise enabler and the standard is met for you."
            @click="router.push('/browse')"
          >
            <div class="lc-n" style="color: var(--enabler);">{{ counts.compliantByDefault }}</div>
            <div class="lc-l">Compliant-by-default</div>
            <div class="lc-d">Adopt the enterprise enabler and the standard is met for you.</div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
