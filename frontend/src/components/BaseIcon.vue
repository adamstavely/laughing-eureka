<script setup lang="ts">
const ICONS: Record<string, string> = {
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35',
  shield: 'M12 3 4 6v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V6l-8-3Z',
  database: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6m16 6c0 1.7-3.6 3-8 3s-8-1.3-8-3',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  layout: 'M3 5h18v14H3zM3 10h18M9 10v9',
  server: 'M3 5h18v6H3zM3 13h18v6H3zM7 8h.01M7 16h.01',
  cloud: 'M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.4A4 4 0 0 0 6 19h11.5Z',
  cpu: 'M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M6 6h12v12H6zM9 9h6v6H9z',
  check: 'M20 6 9 17l-5-5',
  checkSmall: 'M5 12l4 4L19 7',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11',
  mail: 'M4 4h16v16H4zM4 6l8 6 8-6',
  link: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
  history: 'M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8M12 7v5l4 2',
  alert: 'M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z',
  bolt: 'M13 2 3 14h8l-1 8 10-12h-8l1-8Z',
  sparkles: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z',
  package: 'M21 8v8l-9 5-9-5V8l9-5 9 5ZM3 8l9 5 9-5M12 13v8',
  layers: 'M12 2 2 7l10 5 10-5-10-5ZM2 12l10 5 10-5M2 17l10 5 10-5',
  book: 'M4 4h13a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM4 4v14a2 2 0 0 0 2 2h13',
  star: 'M12 3l2.9 6.3 6.6.7-4.9 4.5 1.4 6.5L12 17.8 6 21.5l1.4-6.5L2.5 10l6.6-.7L12 3Z',
  filter: 'M3 4h18l-7 8v6l-4 2v-8L3 4Z',
  x: 'M18 6 6 18M6 6l12 12',
  compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM16 8l-2 6-6 2 2-6 6-2Z',
  flag: 'M4 22V4M4 4s1.5-1 4-1 4 2 7 2 4-1 4-1v9s-1.5 1-4 1-4-2-7-2-4 1-4 1',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  building: 'M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M19 21V11a2 2 0 0 0-2-2h-2M9 7h.01M9 11h.01M9 15h.01',
  scale: 'M12 3v18M7 7h10M5 21h14M6 7l-3 7h6l-3-7Zm12 0-3 7h6l-3-7Z',
};

const props = withDefaults(defineProps<{
  name: string;
  size?: number;
  sw?: number;
}>(), {
  size: 18,
  sw: 1.8,
});

const paths = ICONS[props.name]?.split('M').filter(Boolean).map((seg) => 'M' + seg) ?? [];
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="sw"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, i) in paths" :key="i" :d="d" />
  </svg>
</template>
