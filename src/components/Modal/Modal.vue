<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, useId, watch } from 'vue';
import { Button } from '../Button';
import { Cursor } from '../Cursor';
import { useFocusTrap } from '@/internal/useFocusTrap';
import styles from './modal.module.less';

export interface ModalProps {
    /** 是否打开弹窗。 */
    open: boolean;
    /** 标题内容。 */
    title?: string;
    /** 弹窗宽度。 */
    width?: number | string;
    /** 点击遮罩时是否关闭。 */
    maskClosable?: boolean;
    /** 是否显示右上角关闭按钮。 */
    closable?: boolean;
    /** 传入 null 时隐藏底部操作区。 */
    footer?: null;
}

const props = withDefaults(
    defineProps<ModalProps>(),
    {
        width: 520,
        maskClosable: true,
        closable: false,
    }
);

const emit = defineEmits<{
    (event: 'update:open', value: boolean): void;
    (event: 'close'): void;
    (event: 'ok'): void;
}>();

defineOptions({
    name: 'Modal',
    inheritAttrs: false,
});

const dialogRef = ref<HTMLDivElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const titleId = useId();
let restoreFocusTarget: HTMLElement | null = null;

useFocusTrap(dialogRef, toRef(props, 'open'));

const handleClose = () => {
    emit('update:open', false);
    emit('close');
};

const handleOk = () => {
    emit('ok');
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
        if (open) {
            restoreFocusTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeydown);
            await nextTick();
            if (closeButtonRef.value) {
                closeButtonRef.value.focus();
            } else {
                dialogRef.value?.focus();
            }
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeydown);
            restoreFocusTarget?.focus();
            restoreFocusTarget = null;
        }
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
});

const showFooter = computed(() => props.footer !== null);
</script>

<template>
    <Teleport to="body">
        <Cursor v-if="open" data-cursor-scope>
            <div :class="styles.mask" @click="handleMaskClick">
                <div
                    ref="dialogRef"
                    :class="styles.modal"
                    :style="{ width }"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="title || $slots.title ? titleId : undefined"
                    tabindex="-1"
                    v-bind="$attrs"
                    @click.stop
                >
                    <svg
                        style="position: absolute; width: 0; height: 0"
                        aria-hidden="true"
                    >
                        <clipPath
                            id="animal-modal-clip"
                            clipPathUnits="objectBoundingBox"
                        >
                            <path
                                d="M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006 C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028 C0.872,0.045,0.939,0.044,0.978,0.17 C1,0.254,1,0.365,0.99,0.505 L0.988,0.513 C0.979,0.558,0.971,0.598,0.965,0.633 C0.956,0.689,0.979,0.77,0.964,0.865 C0.953,0.928,0.921,0.966,0.869,0.979 C0.821,0.986,0.773,0.992,0.726,0.995 L0.712,0.996 L0.694,0.997 C0.648,1,0.586,1,0.507,1 L0.501,1 L0.464,1 C0.385,1,0.325,0.998,0.283,0.995 C0.234,0.992,0.184,0.987,0.133,0.979 C0.081,0.966,0.05,0.928,0.039,0.865 C0.023,0.77,0.047,0.689,0.037,0.633 C0.031,0.595,0.023,0.552,0.013,0.505 C-0.006,0.365,-0.002,0.254,0.024,0.17 C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028 C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005"
                            />
                        </clipPath>
                    </svg>
                    <div :class="styles.modalClipped">
                        <div v-if="title || closable" :class="styles.header">
                            <div
                                v-if="title || $slots.title"
                                :id="titleId"
                                :class="styles.title"
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
                        <div v-if="showFooter" :class="styles.footer">
                            <slot name="footer">
                                <Button type="default" @click="handleClose">
                                    取消
                                </Button>
                                <Button type="primary" @click="handleOk">
                                    确定
                                </Button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </Cursor>
    </Teleport>
</template>
