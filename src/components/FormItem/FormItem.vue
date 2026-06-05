<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import styles from './form-item.module.less';
import {
    FORM_CONTEXT_KEY,
    runRules,
    type FormFieldInstance,
    type FormRule,
    type FormRuleTrigger,
} from '@/internal/formContext';

export interface FormItemProps {
    /** 字段标签。 */
    label?: string;
    /** 辅助说明文本。 */
    extra?: string;
    /** 手动指定的状态样式。 */
    status?: 'error' | 'warning';
    /** 对应 Form model 的字段名，设置后启用校验。 */
    prop?: string;
    /** 字段级校验规则，会与 Form rules 合并。 */
    rules?: FormRule | FormRule[];
    /** 是否必填（等价于追加一条 required 规则）。 */
    required?: boolean;
}

defineOptions({
    name: 'FormItem',
    inheritAttrs: false,
});

const props = defineProps<FormItemProps>();

const form = inject(FORM_CONTEXT_KEY, null);
const validateError = ref<string | null>(null);

const fieldValue = computed(() => {
    if (!props.prop || !form?.model) return undefined;
    return form.model[props.prop];
});

const resolvedRules = computed<FormRule[]>(() => {
    const own = props.rules
        ? Array.isArray(props.rules)
            ? props.rules
            : [props.rules]
        : [];

    let fromForm: FormRule[] = [];
    if (props.prop && form?.rules?.[props.prop]) {
        const formRules = form.rules[props.prop];
        fromForm = Array.isArray(formRules) ? formRules : [formRules];
    }

    const merged = [...fromForm, ...own];
    if (props.required && !merged.some((rule) => rule.required)) {
        merged.unshift({ required: true });
    }

    return merged;
});

const validate = async (trigger?: FormRuleTrigger): Promise<boolean> => {
    const rules = resolvedRules.value;
    if (!rules.length) {
        validateError.value = null;
        return true;
    }

    const error = await runRules(fieldValue.value, rules, trigger);
    validateError.value = error;
    return !error;
};

const clearValidate = () => {
    validateError.value = null;
};

const field: FormFieldInstance = {
    get prop() {
        return props.prop ?? '';
    },
    validate,
    clearValidate,
    reset: clearValidate,
};

onMounted(() => {
    if (props.prop) form?.registerField(field);
});

onBeforeUnmount(() => {
    if (props.prop) form?.unregisterField(field);
});

watch(fieldValue, () => {
    if (props.prop && resolvedRules.value.length) {
        void validate('change');
    }
});

const handleFocusout = () => {
    if (props.prop && resolvedRules.value.length) {
        void validate('blur');
    }
};

const displayStatus = computed<'error' | 'warning' | undefined>(() =>
    validateError.value ? 'error' : props.status
);

const displayExtra = computed(() => validateError.value ?? props.extra);
const isRequired = computed(
    () => props.required || resolvedRules.value.some((rule) => rule.required)
);
</script>

<template>
    <label
        :class="styles.item"
        :data-status="displayStatus || 'default'"
        v-bind="$attrs"
        @focusout="handleFocusout"
    >
        <span v-if="label" :class="styles.label" data-form-label>
            {{ label }}
            <span v-if="isRequired" :class="styles.required" aria-hidden="true">
                *
            </span>
        </span>
        <span :class="styles.control">
            <slot />
        </span>
        <span
            v-if="displayExtra"
            :class="[styles.extra, displayStatus && styles[`extra-${displayStatus}`]]"
            data-form-extra
            :role="displayStatus === 'error' ? 'alert' : undefined"
        >
            {{ displayExtra }}
        </span>
    </label>
</template>
