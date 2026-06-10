import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Standard, Enabler, Category } from '@/types';

const API_BASE = '/api';

export const useDataStore = defineStore('data', () => {
  const standards = ref<Standard[]>([]);
  const enablers = ref<Enabler[]>([]);
  const categories = ref<Category[]>([]);
  const teams = ref<string[]>([]);
  const loaded = ref(false);
  const error = ref<string | null>(null);

  async function loadAll() {
    if (loaded.value) return;
    try {
      const [s, e, c, t] = await Promise.all([
        fetch(`${API_BASE}/standards`).then((r) => r.json()),
        fetch(`${API_BASE}/enablers`).then((r) => r.json()),
        fetch(`${API_BASE}/categories`).then((r) => r.json()),
        fetch(`${API_BASE}/teams`).then((r) => r.json()),
      ]);
      standards.value = s;
      enablers.value = e;
      categories.value = c;
      teams.value = t;
      loaded.value = true;
    } catch (err) {
      error.value = 'Failed to load data. Please try again.';
      console.error('Data load error:', err);
    }
  }

  function getStandard(id: string): Standard | undefined {
    return standards.value.find((s) => s.id === id);
  }

  function getEnabler(id: string): Enabler | undefined {
    return enablers.value.find((e) => e.id === id);
  }

  function catName(id: string): string {
    return categories.value.find((c) => c.id === id)?.name ?? id;
  }

  return { standards, enablers, categories, teams, loaded, error, loadAll, getStandard, getEnabler, catName };
});
