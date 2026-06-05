import type { InjectionKey } from 'vue';

export type FormRuleTrigger = 'change' | 'blur';

export interface FormRule {
    /** 是否必填。 */
    required?: boolean;
    /** 校验失败时的提示信息。 */
    message?: string;
    /** 字符串最小长度 / 数字最小值。 */
    min?: number;
    /** 字符串最大长度 / 数字最大值。 */
    max?: number;
    /** 正则校验（针对字符串）。 */
    pattern?: RegExp;
    /** 自定义校验，返回 true 表示通过，返回字符串表示错误信息。 */
    validator?: (
        value: unknown
    ) => boolean | string | Promise<boolean | string>;
    /** 触发时机，默认在任意时机都会校验。 */
    trigger?: FormRuleTrigger | FormRuleTrigger[];
}

export interface FormFieldInstance {
    prop: string;
    validate: (trigger?: FormRuleTrigger) => Promise<boolean>;
    clearValidate: () => void;
    reset: () => void;
}

export interface FormContext {
    model?: Record<string, unknown>;
    rules?: Record<string, FormRule | FormRule[]>;
    registerField: (field: FormFieldInstance) => void;
    unregisterField: (field: FormFieldInstance) => void;
}

export const FORM_CONTEXT_KEY: InjectionKey<FormContext> = Symbol(
    'animal-form-context'
);

const isEmpty = (value: unknown) =>
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

async function checkRule(value: unknown, rule: FormRule): Promise<string | null> {
    if (rule.required && isEmpty(value)) {
        return rule.message ?? '此项为必填项';
    }

    if (isEmpty(value)) {
        return null;
    }

    if (typeof value === 'string') {
        if (rule.min !== undefined && value.length < rule.min) {
            return rule.message ?? `至少需要 ${rule.min} 个字符`;
        }
        if (rule.max !== undefined && value.length > rule.max) {
            return rule.message ?? `最多 ${rule.max} 个字符`;
        }
    }

    if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
            return rule.message ?? `不能小于 ${rule.min}`;
        }
        if (rule.max !== undefined && value > rule.max) {
            return rule.message ?? `不能大于 ${rule.max}`;
        }
    }

    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        return rule.message ?? '格式不正确';
    }

    if (rule.validator) {
        const result = await rule.validator(value);
        if (result === false) return rule.message ?? '校验未通过';
        if (typeof result === 'string') return result;
    }

    return null;
}

/**
 * 依次执行规则，返回首个错误信息；全部通过返回 null。
 * 当传入 trigger 时，仅执行未声明 trigger 或匹配该 trigger 的规则。
 */
export async function runRules(
    value: unknown,
    rules: FormRule[],
    trigger?: FormRuleTrigger
): Promise<string | null> {
    const applicable = rules.filter((rule) => {
        if (!trigger || !rule.trigger) return true;
        const triggers = Array.isArray(rule.trigger)
            ? rule.trigger
            : [rule.trigger];
        return triggers.includes(trigger);
    });

    for (const rule of applicable) {
        const error = await checkRule(value, rule);
        if (error) return error;
    }

    return null;
}
