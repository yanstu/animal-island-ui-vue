import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('Tooltip', () => {
    it('exports component and shows content on hover', async () => {
        const library = await import('../../src');

        expect(library.Tooltip).toBeTruthy();

        const wrapper = mount(library.Tooltip as NonNullable<typeof library.Tooltip>, {
            props: {
                content: '今天适合钓鱼',
                openDelay: 0,
            },
            slots: {
                default: '<button>查看提示</button>',
            },
        });

        expect(wrapper.text()).not.toContain('今天适合钓鱼');

        await wrapper.get('[data-tooltip-trigger]').trigger('mouseenter');

        expect(wrapper.text()).toContain('今天适合钓鱼');
    });

    it('shows on focus and links trigger with popup through aria-describedby', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Tooltip as NonNullable<typeof library.Tooltip>, {
            props: {
                content: '记得给岛民送礼物',
                openDelay: 0,
            },
            slots: {
                default: '<button>查看提示</button>',
            },
        });

        const trigger = wrapper.get('[data-tooltip-trigger]');
        expect(trigger.attributes('data-state')).toBe('closed');

        await trigger.trigger('focusin');

        const popup = wrapper.get('[role="tooltip"]');
        expect(trigger.attributes('aria-describedby')).toBe(popup.attributes('id'));
        expect(trigger.attributes('data-state')).toBe('open');

        await trigger.trigger('focusout');
        expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
        expect(trigger.attributes('data-state')).toBe('closed');
    });

    it('marks tooltip popup as floating and animated when visible', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Tooltip as NonNullable<typeof library.Tooltip>, {
            props: {
                content: '今天适合钓鱼',
                openDelay: 0,
            },
            slots: {
                default: '<button>查看提示</button>',
            },
        });

        await wrapper.get('[data-tooltip-trigger]').trigger('mouseenter');

        const popup = wrapper.get('[role="tooltip"]');
        expect(popup.attributes('data-layer')).toBe('floating');
        expect(popup.attributes('data-state')).toBe('open');
        expect(wrapper.get('[data-tooltip-trigger]').attributes('data-state')).toBe('open');
    });

    it('delays showing on hover by the configured openDelay', async () => {
        const library = await import('../../src');
        vi.useFakeTimers();

        const wrapper = mount(library.Tooltip as NonNullable<typeof library.Tooltip>, {
            props: {
                content: '稍候出现',
                openDelay: 200,
            },
            slots: {
                default: '<button>悬停查看</button>',
            },
        });

        await wrapper.get('[data-tooltip-trigger]').trigger('mouseenter');
        expect(wrapper.text()).not.toContain('稍候出现');

        vi.advanceTimersByTime(200);
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('稍候出现');

        vi.useRealTimers();
    });
});
