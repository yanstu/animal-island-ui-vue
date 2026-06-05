import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it } from 'vitest';
import { Radio, RadioGroup } from '../../src';

const Host = defineComponent({
    components: { Radio, RadioGroup },
    data() {
        return { value: 'a' };
    },
    template: `
        <RadioGroup v-model="value">
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
            <Radio value="c" disabled>C</Radio>
        </RadioGroup>
    `,
});

describe('RadioGroup', () => {
    it('applies roving tabindex and reflects the checked option', () => {
        const wrapper = mount(Host, { attachTo: document.body });
        const radios = wrapper.findAll('[role="radio"]');

        expect(radios[0].attributes('aria-checked')).toBe('true');
        expect(radios[0].attributes('tabindex')).toBe('0');
        expect(radios[1].attributes('tabindex')).toBe('-1');
        expect(radios[2].attributes('tabindex')).toBe('-1');

        wrapper.unmount();
    });

    it('selects an option on click and skips disabled options', async () => {
        const wrapper = mount(Host, { attachTo: document.body });
        const radios = wrapper.findAll('[role="radio"]');

        await radios[1].trigger('click');
        expect(wrapper.vm.value).toBe('b');

        await radios[2].trigger('click');
        expect(wrapper.vm.value).toBe('b');

        wrapper.unmount();
    });

    it('moves the selection with arrow keys and wraps around disabled items', async () => {
        const wrapper = mount(Host, { attachTo: document.body });
        const group = wrapper.get('[role="radiogroup"]');

        await group.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.vm.value).toBe('b');

        // enabled set is [a, b]; ArrowRight from b wraps back to a
        await group.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.vm.value).toBe('a');

        await group.trigger('keydown', { key: 'ArrowLeft' });
        expect(wrapper.vm.value).toBe('b');

        wrapper.unmount();
    });
});
