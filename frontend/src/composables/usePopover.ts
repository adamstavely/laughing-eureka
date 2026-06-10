import { ref, onMounted, onUnmounted } from 'vue';

export function usePopover() {
  const isOpen = ref(false);
  const triggerRef = ref<HTMLElement | null>(null);

  function open() { isOpen.value = true; }
  function close() { isOpen.value = false; }
  function toggle() { isOpen.value = !isOpen.value; }

  function onClickOutside(e: MouseEvent) {
    if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
      close();
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  onMounted(() => {
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('mousedown', onClickOutside);
    document.removeEventListener('keydown', onKeydown);
  });

  return { isOpen, triggerRef, open, close, toggle };
}
