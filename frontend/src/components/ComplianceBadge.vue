<script setup lang="ts">
import type { ComplianceLevel } from '@/types';

const LABELS: Record<ComplianceLevel, { short: string; label: string }> = {
  must:   { short: 'MUST',   label: 'Must (mandatory)' },
  should: { short: 'SHOULD', label: 'Should (recommended)' },
  may:    { short: 'MAY',    label: 'May (optional)' },
};

const props = withDefaults(defineProps<{
  level: ComplianceLevel;
  size?: 'sm' | 'lg';
}>(), { size: 'sm' });

const info = LABELS[props.level];
</script>

<template>
  <span
    :class="['badge', `b-${level}`]"
    :style="size === 'lg' ? { fontSize: '12px', padding: '4px 11px' } : undefined"
    :aria-label="info.label"
    role="img"
  >
    <span class="dot" style="background: currentColor" aria-hidden="true"></span>
    {{ info.short }}
  </span>
</template>
