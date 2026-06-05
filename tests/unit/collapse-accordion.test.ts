import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Collapse } from '../../src';

const items = [
    { key: 'a', title: '面板 A', content: '内容 A' },
    { key: 'b', title: '面板 B', content: '内容 B' },
    { key: 'c', title: '面板 C', content: '内容 C', disabled: true },
];

describe('Collapse multi-panel', () => {
    it('renders one region per item and toggles panels independently', async () => {
        const wrapper = mount(Collapse, {
            props: { items, defaultActiveKeys: ['a'] },
        });

        let regions = wrapper.findAll('[data-collapse-content]');
        expect(regions).toHaveLength(3);
        expect(regions[0].attributes('data-state')).toBe('open');
        expect(regions[1].attributes('data-state')).toBe('closed');

        await wrapper.findAll('button')[1].trigger('click');

        regions = wrapper.findAll('[data-collapse-content]');
        expect(regions[0].attributes('data-state')).toBe('open');
        expect(regions[1].attributes('data-state')).toBe('open');
    });

    it('keeps only one panel open in accordion mode and emits active keys', async () => {
        const wrapper = mount(Collapse, {
            props: { items, accordion: true, defaultActiveKeys: ['a'] },
        });

        await wrapper.findAll('button')[1].trigger('click');

        const regions = wrapper.findAll('[data-collapse-content]');
        expect(regions[0].attributes('data-state')).toBe('closed');
        expect(regions[1].attributes('data-state')).toBe('open');
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b']]);
    });

    it('does not toggle disabled panels', async () => {
        const wrapper = mount(Collapse, { props: { items } });

        const disabledButton = wrapper.findAll('button')[2];
        expect(disabledButton.attributes('disabled')).toBeDefined();

        expect(
            wrapper.findAll('[data-collapse-content]')[2].attributes('data-state')
        ).toBe('closed');
    });

    it('still supports the single-panel FAQ usage', async () => {
        const wrapper = mount(Collapse, {
            props: { question: '怎样钓鱼？', answer: '装备鱼竿靠近水边' },
        });

        const region = wrapper.get('[data-collapse-content]');
        expect(region.attributes('data-state')).toBe('closed');

        await wrapper.get('button').trigger('click');
        expect(region.attributes('data-state')).toBe('open');
    });
});
