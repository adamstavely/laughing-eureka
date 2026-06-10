<script setup lang="ts">
import { usePopover } from '@/composables/usePopover';
import BaseIcon from './BaseIcon.vue';
import { APPS } from '@/types';

const { isOpen, triggerRef, toggle, close } = usePopover();
</script>

<template>
  <div class="popwrap" ref="triggerRef">
    <button
      class="icon-btn"
      :class="{ 'is-open': isOpen }"
      aria-label="Open app picker"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      @click="toggle"
    >
      <BaseIcon name="grid" :size="18" :sw="1.9" />
    </button>

    <div v-if="isOpen" class="popover apps-pop" role="dialog" aria-label="Acme Engineering apps">
      <div class="pop-head" aria-hidden="true">Acme Engineering</div>
      <div class="apps-grid" role="list">
        <button
          v-for="app in APPS"
          :key="app.key"
          class="app-tile"
          :class="{ 'is-current': app.current }"
          role="listitem"
          :aria-current="app.current ? 'true' : undefined"
          :aria-label="`${app.name} — ${app.desc}${app.current ? ' (current app)' : ''}`"
          @click="close"
        >
          <span class="app-ico" aria-hidden="true">
            <BaseIcon :name="app.icon" :size="19" :sw="1.9" />
          </span>
          <span class="app-name">{{ app.name }}</span>
          <span class="app-desc">{{ app.desc }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
