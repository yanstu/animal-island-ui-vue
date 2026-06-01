<script setup lang="ts">
import { computed, useSlots } from 'vue';
import styles from './button.module.less';
import { classNames } from '@/internal/classNames';

export type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';
export type ButtonSize = 'small' | 'middle' | 'large';
export type ButtonHTMLType = 'submit' | 'reset' | 'button';

/**
 * Animal Island 风格按钮。
 * 适合页面主操作、次操作和轻量文本入口。
 */
export interface ButtonProps {
    /** 按钮视觉类型。 */
    type?: ButtonType;
    /** 按钮尺寸。 */
    size?: ButtonSize;
    /** 是否使用危险操作样式。 */
    danger?: boolean;
    /** 是否使用透明幽灵样式。 */
    ghost?: boolean;
    /** 是否占满父容器宽度。 */
    block?: boolean;
    /** 是否显示加载状态。 */
    loading?: boolean;
    /** 是否禁用。 */
    disabled?: boolean;
    /** 图标文本或字符。 */
    icon?: string;
    /** 原生按钮类型。 */
    htmlType?: ButtonHTMLType;
}

defineOptions({
    name: 'Button',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonProps>(), {
    type: 'default',
    size: 'middle',
    danger: false,
    ghost: false,
    block: false,
    loading: false,
    disabled: false,
    htmlType: 'button',
});

const slots = useSlots();

const buttonClassName = computed(() =>
    classNames(
        styles.btn,
        styles[`btn-${props.type}`],
        styles[`btn-${props.size}`],
        props.danger && styles['btn-danger'],
        props.ghost && styles['btn-ghost'],
        props.block && styles['btn-block'],
        props.loading && styles['btn-loading']
    )
);

const isDisabled = computed(() => props.disabled );
const hasIcon = computed(() => Boolean(slots.icon || props.icon));
</script>

<template>
    <button
        :type="htmlType"
        :class="buttonClassName"
        :disabled="isDisabled"
        :data-loading="loading || undefined"
        v-bind="$attrs"
    >
        <span
            v-if="loading"
            data-button-loading
            :class="styles['btn-spinner']"
            aria-hidden="true"
        />
        <span v-if="hasIcon && !loading" :class="styles['btn-icon']">
            <slot name="icon">{{ icon }}</slot>
        </span>
        <span v-if="$slots.default">
            <slot />
        </span>
    </button>
</template>
