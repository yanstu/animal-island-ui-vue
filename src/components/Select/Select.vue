<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, ref, useId, watch } from 'vue';
import styles from './select.module.less';
import { classNames } from '@/internal/classNames';
import { useControllable } from '@/internal/useControllable';
import { useFloating } from '@/internal/useFloating';

export interface SelectOption {
    /** 面板中展示的文本。 */
    label: string;
    /** 选项值。 */
    value: string | number;
    /** 是否禁用当前选项。 */
    disabled?: boolean;
}

/**
 * 单选下拉选择器。
 * 适合活动、状态或分类的单值选择。
 */
export interface SelectProps {
    /** 当前值，推荐配合 v-model 使用。 */
    modelValue?: string | number;
    /** 兼容受控写法的值。 */
    value?: string | number;
    /** 非受控模式下的默认值。 */
    defaultValue?: string | number;
    /** 可选项数组。 */
    options: SelectOption[];
    /** 未选择时的占位文案。 */
    placeholder?: string;
    /** 是否禁用。 */
    disabled?: boolean;
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: string | number): void;
    (event: 'change', value: string | number): void;
}>();

defineOptions({
    name: 'Select',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<SelectProps>(), {
    placeholder: '请选择',
    disabled: false,
});

const instance = getCurrentInstance();
const rawProps = computed(() => instance?.vnode.props ?? {});
const isOpen = ref(false);
const activeIndex = ref(-1);
const rootRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const listboxId = useId();

const { floatingStyle } = useFloating(rootRef, dropdownRef, isOpen, {
    placement: 'bottom',
    offset: 10,
    matchWidth: true,
});

const controlledValue = computed(() =>
    'modelValue' in rawProps.value
        ? props.modelValue
        : 'value' in rawProps.value
          ? props.value
          : undefined
);

const { currentValue, setValue } = useControllable<string | number>({
    value: controlledValue,
    defaultValue: props.defaultValue ?? '',
    onChange: (nextValue) => {
        emit('update:modelValue', nextValue);
        emit('change', nextValue);
    },
});

const triggerClassName = computed(() =>
    classNames(
        styles.trigger,
        isOpen.value && styles['trigger-open'],
        props.disabled && styles['trigger-disabled']
    )
);

const selectedOption = computed(() =>
    props.options.find((option) => option.value === currentValue.value)
);

const displayLabel = computed(
    () => selectedOption.value?.label ?? props.placeholder
);

const enabledOptions = computed(() => props.options.filter((option) => !option.disabled));

const selectedIndex = computed(() =>
    props.options.findIndex((option) => option.value === currentValue.value)
);

const openDropdown = () => {
    if (props.disabled) return;
    isOpen.value = true;
    activeIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : props.options.findIndex((option) => !option.disabled);
};

const closeDropdown = () => {
    isOpen.value = false;
    activeIndex.value = -1;
};

const toggleOpen = () => {
    if (props.disabled) return;
    if (isOpen.value) {
        closeDropdown();
        return;
    }

    openDropdown();
};

const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    setValue(option.value);
    closeDropdown();
};

const moveActive = (direction: 1 | -1) => {
    const availableIndices = props.options
        .map((option, index) => ({ option, index }))
        .filter(({ option }) => !option.disabled)
        .map(({ index }) => index);

    if (!availableIndices.length) return;

    if (activeIndex.value === -1) {
        activeIndex.value = direction === 1 ? availableIndices[0] : availableIndices[availableIndices.length - 1];
        return;
    }

    const currentPosition = availableIndices.indexOf(activeIndex.value);
    const nextPosition =
        currentPosition === -1
            ? 0
            : (currentPosition + direction + availableIndices.length) % availableIndices.length;

    activeIndex.value = availableIndices[nextPosition];
};

const handleKeydown = (event: KeyboardEvent) => {
    if (props.disabled) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!isOpen.value) {
            openDropdown();
            return;
        }
        moveActive(1);
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!isOpen.value) {
            openDropdown();
            return;
        }
        moveActive(-1);
        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!isOpen.value) {
            openDropdown();
            return;
        }

        const option = props.options[activeIndex.value];
        if (option && !option.disabled) {
            handleSelect(option);
        }
        return;
    }

    if (event.key === 'Escape') {
        if (!isOpen.value) return;
        event.preventDefault();
        closeDropdown();
    }
};

const handleDocumentMouseDown = (event: MouseEvent) => {
    if (!isOpen.value) return;
    const target = event.target as Node;
    if (rootRef.value?.contains(target)) return;
    if (dropdownRef.value?.contains(target)) return;
    closeDropdown();
};

watch(isOpen, (open) => {
    if (open) {
        document.addEventListener('mousedown', handleDocumentMouseDown);
        return;
    }

    document.removeEventListener('mousedown', handleDocumentMouseDown);
});

watch(activeIndex, (index) => {
    if (index < 0 || !dropdownRef.value) return;
    const optionEl = dropdownRef.value.querySelector<HTMLElement>(
        `[data-option-index="${index}"]`
    );
    if (optionEl && typeof optionEl.scrollIntoView === 'function') {
        optionEl.scrollIntoView({ block: 'nearest' });
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleDocumentMouseDown);
});
</script>

<template>
    <div ref="rootRef" :class="styles.select" v-bind="$attrs">
        <button
            type="button"
            :class="triggerClassName"
            :disabled="disabled"
            role="combobox"
            aria-haspopup="listbox"
            :aria-expanded="isOpen"
            :aria-disabled="disabled || undefined"
            :aria-controls="listboxId"
            :aria-activedescendant="isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined"
            :data-state="isOpen ? 'open' : 'closed'"
            @click="toggleOpen"
            @keydown="handleKeydown"
        >
            <span :class="[styles.label, !selectedOption && styles.placeholder]">
                {{ displayLabel }}
            </span>
            <span :class="styles.arrow">▾</span>
        </button>
        <Teleport to="body">
            <div
                v-if="isOpen"
                :id="listboxId"
                ref="dropdownRef"
                :class="styles.dropdown"
                :style="floatingStyle"
                role="listbox"
                data-layer="floating"
                data-state="open"
            >
                <button
                    v-for="(option, index) in options"
                    :id="`${listboxId}-option-${index}`"
                    :key="String(option.value)"
                    type="button"
                    role="option"
                    tabindex="-1"
                    :data-option-index="index"
                    :aria-selected="option.value === currentValue"
                    :data-active="index === activeIndex"
                    :class="
                        classNames(
                            styles.option,
                            option.value === currentValue && styles['option-selected'],
                            index === activeIndex && styles['option-active'],
                            option.disabled && styles['option-disabled']
                        )
                    "
                    :disabled="option.disabled"
                    @mouseenter="activeIndex = option.disabled ? activeIndex : index"
                    @click="handleSelect(option)"
                >
                    {{ option.label }}
                </button>
            </div>
        </Teleport>
    </div>
</template>
