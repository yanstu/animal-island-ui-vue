<template>
  <div
    :class="[
      styles.divider,
      type ? styles[type] : '',
      className,
      $attrs.class
    ]"
    :style="style"
  />
</template>

<script setup lang="ts">
import styles from './divider.module.less';

// 类型定义
export type DividerType = 'line-brown' | 'line-teal' | 'line-yellow' | 'wave-yellow';

export interface DividerProps {
  type?: DividerType;
  className?: string;
  style?: Record<string, string | number>; 
}

// 定义 Props + 默认值
const props = withDefaults(defineProps<DividerProps>(), {
  type: 'line-brown',
  className: '',
  style: () => ({}),
});

defineOptions({
  name: 'Divider',
  inheritAttrs: false
});
</script>
