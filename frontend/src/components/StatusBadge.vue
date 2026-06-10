<script setup lang="ts">
import type { StatusKey } from '@/types';

const LABELS: Record<StatusKey, string> = {
  active:     'Active',
  draft:      'Draft',
  deprecated: 'Deprecated',
};

defineProps<{ status: StatusKey }>();
</script>

<template>
  <span :class="['status', `st-${status}`]">
    <span class="dot" aria-hidden="true"></span>
    {{ LABELS[status] }}
  </span>
</template>
