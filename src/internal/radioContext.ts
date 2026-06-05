import type { ComputedRef, InjectionKey } from 'vue';

export type RadioValue = string | number | boolean;

export interface RadioRegistration {
    value: RadioValue;
    isDisabled: () => boolean;
    focus: () => void;
}

export interface RadioGroupContext {
    name: ComputedRef<string | undefined>;
    value: ComputedRef<RadioValue | undefined>;
    disabled: ComputedRef<boolean>;
    /** 当前应当可被 Tab 聚焦的选项值（roving tabindex）。 */
    focusValue: ComputedRef<RadioValue | undefined>;
    setValue: (value: RadioValue) => void;
    register: (radio: RadioRegistration) => void;
    unregister: (radio: RadioRegistration) => void;
}

export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol(
    'animal-radio-group'
);
