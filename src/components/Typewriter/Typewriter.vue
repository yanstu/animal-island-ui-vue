<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue';

export interface TypewriterProps {
  children?: any;
  speed?: number;
  trigger?: unknown;
  autoPlay?: boolean;
  onDone?: () => void;
}

const props = withDefaults(defineProps<TypewriterProps>(), {
  speed: 90,
  autoPlay: true,
});

const emit = defineEmits<{
  done: []
}>();

// 获取默认插槽内容（关键修复）
const slots = defineSlots<{
  default: any
}>()

// ============== 工具函数 ==============
function countText(node: any): number {
  if (node == null || typeof node === 'boolean') return 0;
  if (typeof node === 'string' || typeof node === 'number') return String(node).length;
  if (Array.isArray(node)) return node.reduce((s, n) => s + countText(n), 0);

  if (node && typeof node === 'object' && 'children' in node) {
    return countText(node.children);
  }
  return 0;
}

interface RenderState {
  remaining: number;
  stopped: boolean;
}

function renderTruncated(node: any, state: RenderState, keyPrefix = 'tw'): any {
  if (state.stopped) return null;
  if (node == null || typeof node === 'boolean') return null;

  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node);
    if (state.remaining >= text.length) {
      state.remaining -= text.length;
      return text;
    }
    const shown = text.slice(0, state.remaining);
    state.remaining = 0;
    state.stopped = true;
    return shown;
  }

  if (Array.isArray(node)) {
    return node.map((child, i) =>
      renderTruncated(child, state, `${keyPrefix}-${i}`)
    );
  }

  if (node && typeof node === 'object' && 'type' in node && 'props' in node) {
    const cloned = { ...node };
    cloned.children = renderTruncated(node.children, state, keyPrefix);
    return cloned;
  }

  return null;
}

// ============== 响应式 ==============
const total = computed(() => countText(slots.default()));
const count = ref(props.autoPlay ? 0 : total.value);
const timerRef = ref<number | null>(null);

function startTypewriter() {
  if (timerRef.value) clearInterval(timerRef.value);

  if (!props.autoPlay) {
    count.value = total.value;
    return;
  }

  count.value = 0;
  if (total.value === 0) return;

  timerRef.value = window.setInterval(() => {
    count.value += 1;
    if (count.value >= total.value) {
      clearInterval(timerRef.value!);
      timerRef.value = null;
    }
  }, props.speed);
}

watch(
  [() => total.value, () => props.speed, () => props.trigger, () => props.autoPlay],
  () => {
    nextTick(startTypewriter);
  },
  { immediate: true }
);

watch(
  () => count.value,
  (val) => {
    if (total.value > 0 && val >= total.value) {
      emit('done');
      props.onDone?.();
    }
  }
);

onUnmounted(() => {
  if (timerRef.value) clearInterval(timerRef.value);
});

const renderContent = () => {
  const state: RenderState = { remaining: count.value, stopped: false };
  return renderTruncated(slots.default(), state);
};
</script>

<template>
  <component :is="renderContent" />
</template>

<script lang="ts">
export default {
  name: 'Typewriter'
};
</script>