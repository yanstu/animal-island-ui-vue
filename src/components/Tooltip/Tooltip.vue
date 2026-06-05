<script setup lang="ts">
import { onBeforeUnmount, ref, useId } from 'vue';
import styles from './tooltip.module.less';
import { useFloating } from '@/internal/useFloating';

export interface TooltipProps {
    content: string;
    /** 悬停 / 聚焦多久后显示（毫秒），默认 200。 */
    openDelay?: number;
}

defineOptions({
    name: 'Tooltip',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<TooltipProps>(), {
    openDelay: 200,
});

const visible = ref(false);
const popupId = useId();
const triggerRef = ref<HTMLElement | null>(null);
const popupRef = ref<HTMLElement | null>(null);
let openTimer: ReturnType<typeof setTimeout> | null = null;

const { floatingStyle } = useFloating(triggerRef, popupRef, visible, {
    placement: 'top',
    offset: 12,
});

const clearOpenTimer = () => {
    if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
    }
};

const show = () => {
    clearOpenTimer();
    if (props.openDelay > 0) {
        openTimer = setTimeout(() => {
            visible.value = true;
            openTimer = null;
        }, props.openDelay);
    } else {
        visible.value = true;
    }
};

const hide = () => {
    clearOpenTimer();
    visible.value = false;
};

onBeforeUnmount(clearOpenTimer);
</script>

<template>
    <span
        ref="triggerRef"
        :class="styles.tooltip"
        data-tooltip-trigger
        v-bind="$attrs"
        :aria-describedby="visible ? popupId : undefined"
        :data-state="visible ? 'open' : 'closed'"
        @mouseenter="show"
        @mouseleave="hide"
        @focusin="show"
        @focusout="hide"
    >
        <slot />
        <Teleport to="body">
            <span
                v-if="visible"
                :id="popupId"
                ref="popupRef"
                :class="styles.popup"
                :style="floatingStyle"
                role="tooltip"
                data-layer="floating"
                data-state="open"
            >
                {{ content }}
            </span>
        </Teleport>
    </span>
</template>
