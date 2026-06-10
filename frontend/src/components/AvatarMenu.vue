<script setup lang="ts">
import { usePopover } from '@/composables/usePopover';
import BaseIcon from './BaseIcon.vue';

const { isOpen, triggerRef, toggle, close } = usePopover();

const user = {
  name: 'Dana Okafor',
  email: 'dana.okafor@acme.dev',
  role: 'Staff Engineer · Platform',
};

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}
</script>

<template>
  <div class="popwrap" ref="triggerRef">
    <button
      class="avatar-btn"
      :class="{ 'is-open': isOpen }"
      :aria-label="`Account menu for ${user.name}`"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      @click="toggle"
    >
      <span class="avatar" aria-hidden="true">{{ initials(user.name) }}</span>
    </button>

    <div v-if="isOpen" class="popover account-pop" role="dialog" :aria-label="`Account menu for ${user.name}`">
      <div class="account-id">
        <span class="avatar lg" aria-hidden="true">{{ initials(user.name) }}</span>
        <div class="account-meta">
          <div class="account-name">{{ user.name }}</div>
          <div class="account-email">{{ user.email }}</div>
          <div class="account-role">{{ user.role }}</div>
        </div>
      </div>
      <div class="pop-sep" role="separator"></div>
      <button class="pop-item" @click="close">
        <BaseIcon name="users" :size="16" aria-hidden="true" /> Your profile
      </button>
      <button class="pop-item" @click="close">
        <BaseIcon name="star" :size="16" aria-hidden="true" /> Saved standards
      </button>
      <button class="pop-item" @click="close">
        <BaseIcon name="flag" :size="16" aria-hidden="true" /> Your proposals
      </button>
      <div class="pop-sep" role="separator"></div>
      <button class="pop-item" @click="close">
        <BaseIcon name="x" :size="16" aria-hidden="true" /> Sign out
      </button>
    </div>
  </div>
</template>
