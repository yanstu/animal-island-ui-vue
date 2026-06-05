<script setup lang="ts">
import { computed, getCurrentInstance, ref, useId } from 'vue';
import styles from './collapse.module.less';
import { classNames } from '@/internal/classNames';
import { useControllable } from '@/internal/useControllable';

export interface CollapseItem {
    /** 面板唯一标识。 */
    key: string;
    /** 面板标题。 */
    title: string;
    /** 面板内容。 */
    content?: string;
    /** 是否禁用该面板。 */
    disabled?: boolean;
}

export interface CollapseProps {
    /** 单面板标题（兼容 FAQ 用法）。 */
    question?: string;
    /** 单面板内容（兼容 FAQ 用法）。 */
    answer?: string;
    /** 单面板默认展开。 */
    defaultExpanded?: boolean;
    /** 是否禁用（单面板）。 */
    disabled?: boolean;
    /** 多面板数据，设置后启用折叠面板组。 */
    items?: CollapseItem[];
    /** 手风琴模式，同时只展开一个面板。 */
    accordion?: boolean;
    /** 展开的面板 key 列表，推荐配合 v-model。 */
    modelValue?: string[];
    /** 非受控模式下默认展开的面板 key 列表。 */
    defaultActiveKeys?: string[];
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: string[]): void;
    (event: 'change', value: string[]): void;
}>();

defineOptions({
    name: 'Collapse',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<CollapseProps>(), {
    defaultExpanded: false,
    disabled: false,
    accordion: false,
});

const instance = getCurrentInstance();
const rawProps = computed(() => instance?.vnode.props ?? {});

const isMultiple = computed(
    () => Array.isArray(props.items) && props.items.length > 0
);

// ---------- 单面板（兼容 FAQ 用法） ----------
const expanded = ref(props.defaultExpanded);
const contentId = useId();

const toggle = () => {
    if (props.disabled) return;
    expanded.value = !expanded.value;
};

// ---------- 多面板 / 手风琴 ----------
const baseId = useId();

const controlledKeys = computed(() =>
    'modelValue' in rawProps.value ? props.modelValue : undefined
);

const { currentValue: activeKeys, setValue: setActiveKeys } = useControllable<
    string[]
>({
    value: controlledKeys,
    defaultValue: props.defaultActiveKeys ?? [],
    onChange: (next) => {
        emit('update:modelValue', next);
        emit('change', next);
    },
});

const panelId = (key: string) => `${baseId}-${key}`;
const isPanelOpen = (key: string) => activeKeys.value.includes(key);

const togglePanel = (item: CollapseItem) => {
    if (item.disabled) return;
    const keys = activeKeys.value;
    const next = keys.includes(item.key)
        ? keys.filter((key) => key !== item.key)
        : props.accordion
          ? [item.key]
          : [...keys, item.key];
    setActiveKeys(next);
};

const leafPath =
    'M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z';
</script>

<template>
    <div v-if="isMultiple" :class="styles.group" v-bind="$attrs">
        <div
            v-for="item in items"
            :key="item.key"
            :class="
                classNames(
                    styles.faqCard,
                    isPanelOpen(item.key) && styles.expanded,
                    item.disabled && styles.disabled
                )
            "
        >
            <button
                :class="styles.questionHeader"
                :disabled="item.disabled"
                :aria-expanded="isPanelOpen(item.key)"
                :aria-controls="panelId(item.key)"
                @click="togglePanel(item)"
            >
                <span :class="styles.questionIcon" data-icon-shape="round">
                    <span :class="styles.questionIconGlyph">
                        {{ isPanelOpen(item.key) ? '−' : '+' }}
                    </span>
                </span>
                <span :class="styles.questionText">{{ item.title }}</span>
                <span :class="styles.leafDecoration">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" :d="leafPath" />
                    </svg>
                </span>
            </button>
            <div
                :id="panelId(item.key)"
                :class="styles.answerWrapper"
                data-collapse-content
                role="region"
                :data-state="isPanelOpen(item.key) ? 'open' : 'closed'"
            >
                <div :class="styles.answerContent">
                    {{ item.content }}
                </div>
            </div>
        </div>
    </div>

    <div
        v-else
        :class="
            classNames(
                styles.faqCard,
                expanded && styles.expanded,
                disabled && styles.disabled
            )
        "
        v-bind="$attrs"
    >
        <button
            :class="styles.questionHeader"
            :disabled="disabled"
            :aria-expanded="expanded"
            :aria-controls="contentId"
            @click="toggle"
        >
            <span :class="styles.questionIcon" data-icon-shape="round">
                <span :class="styles.questionIconGlyph">
                    {{ expanded ? '−' : '+' }}
                </span>
            </span>
            <span :class="styles.questionText">
                <slot name="question">{{ question }}</slot>
            </span>
            <span :class="styles.leafDecoration">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" :d="leafPath" />
                </svg>
            </span>
        </button>
        <div
            :id="contentId"
            :class="styles.answerWrapper"
            data-collapse-content
            role="region"
            :data-state="expanded ? 'open' : 'closed'"
        >
            <div :class="styles.answerContent">
                <slot>{{ answer }}</slot>
            </div>
        </div>
    </div>
</template>
