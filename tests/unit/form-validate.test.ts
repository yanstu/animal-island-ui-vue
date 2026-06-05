import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, reactive, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { Form, FormItem, Input } from '../../src';

const createHost = () => {
    const model = reactive({ name: '' });
    const formRef = ref<{ validate: () => Promise<boolean> } | null>(null);

    const Host = defineComponent({
        components: { Form, FormItem, Input },
        setup() {
            return { model, formRef };
        },
        template: `
            <Form
                ref="formRef"
                :model="model"
                :rules="{ name: [{ required: true, message: '请输入昵称' }] }"
            >
                <FormItem label="昵称" prop="name">
                    <Input v-model="model.name" />
                </FormItem>
            </Form>
        `,
    });

    return { Host, model };
};

describe('Form validation', () => {
    it('fails validation and surfaces the error message when required field is empty', async () => {
        const { Host } = createHost();
        const wrapper = mount(Host, { attachTo: document.body });

        const valid = await (wrapper.vm.formRef as unknown as {
            validate: () => Promise<boolean>;
        }).validate();
        await nextTick();

        expect(valid).toBe(false);
        expect(wrapper.get('[data-form-extra]').attributes('role')).toBe('alert');
        expect(wrapper.text()).toContain('请输入昵称');

        wrapper.unmount();
    });

    it('passes validation after the field is filled', async () => {
        const { Host, model } = createHost();
        const wrapper = mount(Host, { attachTo: document.body });

        model.name = 'Nook';
        await nextTick();

        const valid = await (wrapper.vm.formRef as unknown as {
            validate: () => Promise<boolean>;
        }).validate();
        await nextTick();

        expect(valid).toBe(true);
        expect(wrapper.find('[data-form-extra]').exists()).toBe(false);

        wrapper.unmount();
    });
});
