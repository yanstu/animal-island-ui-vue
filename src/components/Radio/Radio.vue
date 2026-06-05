<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import styles from './radio.module.less';
import { classNames } from '@/internal/classNames';
import {
    RADIO_GROUP_KEY,
    type RadioRegistration,
    type RadioValue,
} from '@/internal/radioContext';

export interface RadioProps {
    modelValue?: RadioValue;
    value: RadioValue;
    disabled?: boolean;
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: RadioValue): void;
    (event: 'change', value: RadioValue): void;
}>();

defineOptions({
    name: 'Radio',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<RadioProps>(), {
    disabled: false,
});

const group = inject(RADIO_GROUP_KEY, null);
const rootRef = ref<HTMLButtonElement | null>(null);

const checked = computed(() =>
    group ? group.value.value === props.value : props.modelValue === props.value
);

const isDisabled = computed(
    () => props.disabled || (group?.disabled.value ?? false)
);

const tabIndex = computed(() => {
    if (!group) return undefined;
    if (checked.value) return 0;
    return group.focusValue.value === props.value ? 0 : -1;
});

const radioClassName = computed(() =>
    classNames(
        styles.radio,
        checked.value && styles['radio-checked'],
        isDisabled.value && styles['radio-disabled']
    )
);

const handleClick = () => {
    if (isDisabled.value) return;

    if (group) {
        if (group.value.value !== props.value) {
            group.setValue(props.value);
        }
        return;
    }

    if (checked.value) return;
    emit('update:modelValue', props.value);
    emit('change', props.value);
};

const registration: RadioRegistration = {
    get value() {
        return props.value;
    },
    isDisabled: () => isDisabled.value,
    focus: () => rootRef.value?.focus(),
};

onMounted(() => {
    group?.register(registration);
});

onBeforeUnmount(() => {
    group?.unregister(registration);
});
</script>

<template>
    <button
        ref="rootRef"
        type="button"
        role="radio"
        :aria-checked="checked"
        :aria-disabled="isDisabled || undefined"
        :data-state="checked ? 'checked' : 'unchecked'"
        :tabindex="tabIndex"
        :class="radioClassName"
        :disabled="isDisabled"
        v-bind="$attrs"
        @click="handleClick"
    >
        <span :class="styles.outer">
            <span v-if="checked" :class="styles.inner" />
        </span>
        <span v-if="$slots.default" :class="styles.label">
            <slot />
        </span>
    </button>
</template>
