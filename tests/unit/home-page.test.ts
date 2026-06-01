import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HomePage from '../../demo/HomePage.vue';

describe('Demo HomePage', () => {
    it('navigates to quick-start from the hero call to action', async () => {
        const wrapper = mount(HomePage, {
            global: {
                stubs: {
                    Button: {
                        template: '<button @click="$emit(\'click\')"><slot /></button>',
                    },
                    Card: {
                        template: '<div><slot /></div>',
                    },
                    Divider: {
                        template: '<hr />',
                    },
                    CodeBlock: {
                        template: '<pre />',
                    },
                },
            },
        });

        await wrapper.get('button').trigger('click');

        expect(wrapper.emitted('navigate')?.[0]).toEqual(['/quick-start']);
    });

    it('renders a footer and direct technical copy closer to the original homepage', () => {
        const wrapper = mount(HomePage, {
            global: {
                stubs: {
                    Button: {
                        template: '<button><slot /></button>',
                    },
                    Card: {
                        template: '<div><slot /></div>',
                    },
                    Divider: {
                        template: '<hr />',
                    },
                    CodeBlock: {
                        template: '<pre />',
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('Animal Island 风格的 Vue 3 组件库');
        expect(wrapper.text()).toContain('基于 TypeScript + Vite 构建');
        expect(wrapper.text()).toContain('主题定制');
        expect(wrapper.text()).toContain('组件文档');
        expect(wrapper.text()).toContain('GitHub');
        expect(wrapper.text()).toContain('首页');
        expect(wrapper.text()).toContain('MIT License');
        expect(wrapper.text()).toContain('Vue 3 + TypeScript + Vite');
        expect(wrapper.find('.page').classes()).toContain('home-page');
        expect(wrapper.find('.hero').classes()).toContain('home-hero');
        expect(wrapper.findAll('.feature-card')).toHaveLength(4);
        expect(wrapper.findAll('.component-card').length).toBeGreaterThan(20);
    });
});
