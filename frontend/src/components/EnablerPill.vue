<script setup lang="ts">
import BaseIcon from './BaseIcon.vue';

defineProps<{ name: string }>();
</script>

<template>
  <span class="enabler-pill">
    <BaseIcon name="bolt" :size="12" :sw="2" aria-hidden="true" />
    {{ name }}
  </span>
</template>
