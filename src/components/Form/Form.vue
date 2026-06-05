<script setup lang="ts">
import { provide } from 'vue';
import styles from './form.module.less';
import {
    FORM_CONTEXT_KEY,
    type FormContext,
    type FormFieldInstance,
    type FormRule,
} from '@/internal/formContext';

export interface FormProps {
    /** 布局方式。 */
    layout?: 'vertical' | 'inline';
    /** 表单数据对象，配合 FormItem 的 prop 使用。 */
    model?: Record<string, unknown>;
    /** 以字段名为键的校验规则集合。 */
    rules?: Record<string, FormRule | FormRule[]>;
}

defineOptions({
    name: 'Form',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<FormProps>(), {
    layout: 'vertical',
});

const fields = new Set<FormFieldInstance>();

const registerField = (field: FormFieldInstance) => {
    fields.add(field);
};

const unregisterField = (field: FormFieldInstance) => {
    fields.delete(field);
};

const context: FormContext = {
    get model() {
        return props.model;
    },
    get rules() {
        return props.rules;
    },
    registerField,
    unregisterField,
};

provide(FORM_CONTEXT_KEY, context);

/** 校验全部字段，全部通过返回 true。 */
const validate = async (): Promise<boolean> => {
    const results = await Promise.all(
        Array.from(fields, (field) => field.validate())
    );
    return results.every(Boolean);
};

/** 清空全部字段的校验状态。 */
const clearValidate = () => {
    fields.forEach((field) => field.clearValidate());
};

/** 重置全部字段的校验状态。 */
const resetFields = () => {
    fields.forEach((field) => field.reset());
};

defineExpose({
    validate,
    clearValidate,
    resetFields,
});
</script>

<template>
    <form
        :class="[styles.form, styles[`form-${layout}`]]"
        :data-layout="layout"
        novalidate
        v-bind="$attrs"
    >
        <slot />
    </form>
</template>
