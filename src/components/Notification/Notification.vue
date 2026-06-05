<script setup lang="ts">
import { useId } from 'vue';
import styles from './notification.module.less';

export interface NotificationProps {
    title: string;
    description?: string;
    type?: 'default' | 'success' | 'warning';
    /** 是否显示关闭按钮。 */
    closable?: boolean;
}

const emit = defineEmits<{
    (event: 'close'): void;
}>();

defineOptions({
    name: 'Notification',
    inheritAttrs: false,
});

withDefaults(defineProps<NotificationProps>(), {
    description: '',
    type: 'default',
    closable: false,
});

const titleId = useId();
const descriptionId = useId();
</script>

<template>
    <div
        :class="[styles.notification, styles[`notification-${type}`]]"
        role="status"
        data-layer="raised"
        aria-live="polite"
        aria-atomic="true"
        :data-type="type"
        :aria-labelledby="titleId"
        :aria-describedby="(description || $slots.default) ? descriptionId : undefined"
        v-bind="$attrs"
    >
        <button
            v-if="closable"
            type="button"
            :class="styles.close"
            aria-label="关闭"
            data-notification-close
            @click="emit('close')"
        >
            ×
        </button>
        <div :id="titleId" :class="styles.title" data-notification-title>
            {{ title }}
        </div>
        <div
            v-if="description || $slots.default"
            :id="descriptionId"
            :class="styles.description"
            data-notification-description
        >
            <slot>{{ description }}</slot>
        </div>
    </div>
</template>
