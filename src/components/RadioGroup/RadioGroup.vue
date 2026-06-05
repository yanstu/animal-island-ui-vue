<script setup lang="ts">
import { computed, getCurrentInstance, provide, ref } from 'vue';
import styles from './radio-group.module.less';
import { useControllable } from '@/internal/useControllable';
import {
    RADIO_GROUP_KEY,
    type RadioGroupContext,
    type RadioRegistration,
    type RadioValue,
} from '@/internal/radioContext';

export interface RadioGroupProps {
    /** 推荐使用的双向绑定值。 */
    modelValue?: RadioValue;
    /** 兼容受控写法的值。 */
    value?: RadioValue;
    /** 非受控模式下的默认值。 */
    defaultValue?: RadioValue;
    /** 是否禁用整组。 */
    disabled?: boolean;
    /** 原生 name，便于表单语义。 */
    name?: string;
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: RadioValue): void;
    (event: 'change', value: RadioValue): void;
}>();

defineOptions({
    name: 'RadioGroup',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<RadioGroupProps>(), {
    disabled: false,
});

const instance = getCurrentInstance();
const rawProps = computed(() => instance?.vnode.props ?? {});

const controlledValue = computed(() =>
    'modelValue' in rawProps.value
        ? props.modelValue
        : 'value' in rawProps.value
          ? props.value
          : undefined
);

const { currentValue, setValue: setControllableValue } = useControllable<
    RadioValue | undefined
>({
    value: controlledValue,
    defaultValue: props.defaultValue,
    onChange: (next) => {
        if (next === undefined) return;
        emit('update:modelValue', next);
        emit('change', next);
    },
});

const setValue = (value: RadioValue) => {
    setControllableValue(value);
};

const radios = ref<RadioRegistration[]>([]);

const register = (radio: RadioRegistration) => {
    radios.value.push(radio);
};

const unregister = (radio: RadioRegistration) => {
    radios.value = radios.value.filter((item) => item !== radio);
};

const focusValue = computed<RadioValue | undefined>(() => {
    const enabled = radios.value.filter((radio) => !radio.isDisabled());
    if (!enabled.length) return undefined;
    const selected = enabled.find((radio) => radio.value === currentValue.value);
    return selected ? selected.value : enabled[0].value;
});

const moveSelection = (direction: 1 | -1) => {
    if (props.disabled) return;
    const enabled = radios.value.filter((radio) => !radio.isDisabled());
    if (!enabled.length) return;

    const currentIndex = enabled.findIndex(
        (radio) => radio.value === currentValue.value
    );
    const baseIndex = currentIndex === -1 ? (direction === 1 ? -1 : 0) : currentIndex;
    const nextIndex = (baseIndex + direction + enabled.length) % enabled.length;
    const next = enabled[nextIndex];

    setValue(next.value);
    next.focus();
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveSelection(1);
        return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveSelection(-1);
    }
};

provide<RadioGroupContext>(RADIO_GROUP_KEY, {
    name: computed(() => props.name),
    value: computed(() => currentValue.value),
    disabled: computed(() => props.disabled),
    focusValue,
    setValue,
    register,
    unregister,
});
</script>

<template>
    <div
        :class="styles.group"
        role="radiogroup"
        :aria-disabled="disabled || undefined"
        v-bind="$attrs"
        @keydown="handleKeydown"
    >
        <slot />
    </div>
</template>
