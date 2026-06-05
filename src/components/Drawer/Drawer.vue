<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, useId, watch } from 'vue';
import { classNames } from '@/internal/classNames';
import { useFocusTrap } from '@/internal/useFocusTrap';
import styles from './drawer.module.less';

export interface DrawerProps {
    /** 是否打开抽屉。 */
    open: boolean;
    /** 标题内容。 */
    title?: string;
    /** 抽屉方向。 */
    placement?: 'right' | 'bottom';
    /** 点击遮罩是否关闭。 */
    maskClosable?: boolean;
    /** 是否显示关闭按钮。 */
    closable?: boolean;
    /** 右侧抽屉宽度。 */
    width?: number | string;
    /** 底部抽屉高度。 */
    height?: number | string;
}

const emit = defineEmits<{
    (event: 'update:open', value: boolean): void;
    (event: 'close'): void;
}>();

defineOptions({
    name: 'Drawer',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<DrawerProps>(), {
    placement: 'right',
    maskClosable: true,
    closable: true,
});

const panelRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const visible = ref(props.open);
const state = ref<'open' | 'closed'>(props.open ? 'open' : 'closed');
const titleId = useId();
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let restoreFocusTarget: HTMLElement | null = null;

useFocusTrap(panelRef, toRef(props, 'open'));

const panelClassName = computed(() =>
    classNames(
        styles.panel,
        props.placement === 'bottom' && styles['panel-bottom']
    )
);

const normalizeDimension = (value: number | string | undefined) =>
    typeof value === 'number' ? `${value}px` : value;

const panelStyle = computed(() => {
    const style: Record<string, string> = {};

    if (props.width) {
        style.width = normalizeDimension(props.width) ?? '';
    }

    if (props.placement === 'bottom' && props.height) {
        style.height = normalizeDimension(props.height) ?? '';
    }

    return style;
});

const handleClose = () => {
    emit('update:open', false);
    emit('close');
};

const handleMaskClick = () => {
    if (props.maskClosable) {
        handleClose();
    }
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.open) {
        handleClose();
    }
};

watch(
    () => props.open,
    async (open) => {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }

        visible.value = open;

        if (open) {
            restoreFocusTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            state.value = 'open';
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeydown);
            await nextTick();
            if (closeButtonRef.value) {
                closeButtonRef.value.focus();
            } else {
                panelRef.value?.focus();
            }
            return;
        }

        state.value = 'closed';
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
        restoreFocusTarget?.focus();
        restoreFocusTarget = null;
        hideTimer = setTimeout(() => {
            visible.value = false;
            hideTimer = null;
        }, 220);
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    if (hideTimer) {
        clearTimeout(hideTimer);
    }
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <Teleport to="body">
        <div v-if="visible" :class="styles.drawer" :data-state="state" v-bind="$attrs">
            <div :class="styles.mask" @click="handleMaskClick" />
            <aside
                ref="panelRef"
                data-drawer-panel
                :data-state="state"
                :class="panelClassName"
                :style="panelStyle"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="title || $slots.title ? titleId : undefined"
                tabindex="-1"
            >
                <div v-if="title || closable" :class="styles.header">
                    <div
                        v-if="title || $slots.title"
                        :id="titleId"
                        :class="styles.title"
                        data-drawer-title
                    >
                        <slot name="title">{{ title }}</slot>
                    </div>
                    <button
                        v-if="closable"
                        ref="closeButtonRef"
                        type="button"
                        :class="styles.close"
                        aria-label="Close"
                        @click="handleClose"
                    >
                        ×
                    </button>
                </div>
                <div :class="styles.body">
                    <slot />
                </div>
            </aside>
        </div>
    </Teleport>
</template>
