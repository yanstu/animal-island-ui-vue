<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import styles from './slider.module.less';
import { useControllable } from '@/internal/useControllable';

export interface SliderProps {
    modelValue?: number;
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: number): void;
    (event: 'change', value: number): void;
}>();

defineOptions({
    name: 'Slider',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<SliderProps>(), {
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
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

const { currentValue, setValue } = useControllable<number>({
    value: controlledValue,
    defaultValue: props.defaultValue,
    onChange: (nextValue) => {
        emit('update:modelValue', nextValue);
        emit('change', nextValue);
    },
});

const safeValue = computed(() =>
    Math.min(props.max, Math.max(props.min, currentValue.value))
);

const progress = computed(() => {
    const range = props.max - props.min;
    if (range <= 0) return 0;
    return ((safeValue.value - props.min) / range) * 100;
});

const tickPositions = [0, 25, 50, 75, 100];

const handleInput = (event: Event) => {
    const nextValue = Number((event.target as HTMLInputElement).value);
    setValue(Math.min(props.max, Math.max(props.min, nextValue)));
};
</script>

<template>
    <div :class="styles.slider" v-bind="$attrs">
        <div :class="styles.control">
            <div :class="styles.track">
                <span
                    v-for="tick in tickPositions"
                    :key="tick"
                    :class="styles.tick"
                    :style="{ left: `${tick}%` }"
                />
                <div :class="styles.fill" :style="{ width: `${progress}%` }" />
                <div
                    data-slider-thumb
                    :class="styles.thumb"
                    :style="{ left: `${progress}%` }"
                >
                    <span :class="styles.thumbCore" />
                </div>
            </div>
            <input
                type="range"
                :class="styles.input"
                :min="min"
                :max="max"
                :step="step"
                :disabled="disabled"
                :value="safeValue"
                aria-label="滑块数值"
                :aria-valuetext="String(safeValue)"
                @input="handleInput"
            />
        </div>
        <span :class="styles.value">{{ safeValue }}</span>
    </div>
</template>
