<script setup lang="ts">
import { computed } from 'vue';
import styles from './cursor.module.less';
import cursorIcon from './cursor-icon.png';

defineOptions({
    name: 'Cursor',
    inheritAttrs: false,
});

export interface CursorProps {
    /** 自定义指针资源地址。 */
    src?: string;
    /** 指针热点横坐标。 */
    hotspotX?: number;
    /** 指针热点纵坐标。 */
    hotspotY?: number;
}

const props = withDefaults(defineProps<CursorProps>(), {
    hotspotX: 4,
    hotspotY: 0,
});

const cursorStyle = computed(() => ({
    '--animal-cursor-url': props.src ? `url("${props.src}")` : undefined,
    '--animal-cursor-hotspot-x': String(props.hotspotX),
    '--animal-cursor-hotspot-y': String(props.hotspotY),
    '--animal-cursor-value': `var(--animal-cursor-url, url("${cursorIcon}")) var(--animal-cursor-hotspot-x, 4) var(--animal-cursor-hotspot-y, 0), auto`,
}));
</script>

<template>
    <div :class="styles.cursor" :style="cursorStyle" v-bind="$attrs">
        <slot />
    </div>
</template>
