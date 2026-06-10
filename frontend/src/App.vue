<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import AppPicker from '@/components/AppPicker.vue';
import AvatarMenu from '@/components/AvatarMenu.vue';
import BaseIcon from '@/components/BaseIcon.vue';

const store = useDataStore();
const route = useRoute();

onMounted(() => store.loadAll());

</script>

<template>
  <div class="shell">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header class="topbar">
      <div class="wrap topbar-inner">
        <RouterLink to="/" class="brand" aria-label="Acme Standards home">
          <div class="brand-mark" aria-hidden="true">
            <BaseIcon name="layers" :size="17" :sw="2" />
          </div>
          <div class="brand-name">
            Acme Standards
            <small>Engineering · Build the right way</small>
          </div>
        </RouterLink>

        <nav class="topnav" aria-label="Main navigation">
          <RouterLink to="/about" :aria-current="route.name === 'about' ? 'page' : undefined">About</RouterLink>
          <RouterLink to="/browse" :aria-current="route.name === 'browse' ? 'page' : undefined">Browse</RouterLink>
          <RouterLink
            to="/enablers"
            :aria-current="(route.name === 'enablers' || route.name === 'enabler') ? 'page' : undefined"
          >Enablers</RouterLink>
        </nav>

        <div class="topbar-spacer"></div>

        <RouterLink
          v-if="route.name !== 'home'"
          to="/browse"
          class="top-search"
          aria-label="Search standards"
        >
          <BaseIcon name="search" :size="15" aria-hidden="true" />
          Search standards
          <kbd aria-label="Keyboard shortcut: forward slash">/</kbd>
        </RouterLink>

        <div class="topbar-actions">
          <AppPicker />
          <AvatarMenu />
        </div>
      </div>
    </header>

    <main id="main-content" style="flex: 1" tabindex="-1">
      <div v-if="store.error" role="alert" style="padding: 20px; text-align: center; color: var(--must);">
        {{ store.error }}
      </div>
      <RouterView v-else />
    </main>

    <footer class="footer">
      <div class="wrap footer-inner">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="brand-mark" style="width: 24px; height: 24px; border-radius: 6px;" aria-hidden="true">
            <BaseIcon name="layers" :size="13" :sw="2" />
          </div>
          <span>Acme Engineering Standards · Maintained by the Architecture Guild</span>
        </div>
        <nav class="fl" aria-label="Footer navigation">
          <RouterLink to="/browse">All standards</RouterLink>
          <RouterLink to="/enablers">Enablers</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <a href="#" @click.prevent>Propose a change</a>
        </nav>
      </div>
    </footer>
  </div>
</template>
