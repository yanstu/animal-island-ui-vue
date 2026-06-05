import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Demo ComponentPage', () => {
    it('renders about and quick-start documentation without development-copy tone', async () => {
        const { default: ComponentPage } = await import('../../demo/ComponentPage.vue');

        const aboutWrapper = mount(ComponentPage, {
            props: { activeKey: 'about' },
            global: {
                stubs: {
                    Teleport: true,
                },
            },
        });

        const quickStartWrapper = mount(ComponentPage, {
            props: { activeKey: 'quick-start' },
            global: {
                stubs: {
                    Teleport: true,
                },
            },
        });

        expect(aboutWrapper.text()).toContain('关于');
        expect(quickStartWrapper.text()).toContain('快速使用');
        expect(aboutWrapper.text()).not.toContain('致敬原版');
        expect(aboutWrapper.text()).not.toContain('需求说明');
        expect(aboutWrapper.text()).not.toContain('实现说明');
        expect(aboutWrapper.text()).not.toContain('适配说明');
        expect(aboutWrapper.text()).not.toContain('源码');
        expect(aboutWrapper.text()).not.toContain('版本记录');
        expect(aboutWrapper.text()).not.toContain('视觉参考');
    });

    it('separates the current project repository from the reference repository on the about page', async () => {
        const { default: ComponentPage } = await import('../../demo/ComponentPage.vue');

        const aboutWrapper = mount(ComponentPage, {
            props: { activeKey: 'about' },
            global: {
                stubs: {
                    Teleport: true,
                },
            },
        });

        expect(aboutWrapper.text()).toContain('本项目仓库');
        expect(aboutWrapper.text()).toContain('致谢');
        expect(aboutWrapper.text()).not.toContain('GitHub · animal-island-uiGitHub · animal-island-ui-vue');
    });

    it('keeps repository docs focused on the current vue package and moves reference thanks to the end', () => {
        const readme = readFileSync(resolve(process.cwd(), 'README.md'), 'utf8');
        const contributing = readFileSync(resolve(process.cwd(), 'CONTRIBUTING.md'), 'utf8');

        expect(readme).toContain('# animal-island-ui-vue');
        expect(readme).toContain('Vue 3');
        expect(readme).toContain('## 致谢');
        expect(readme.indexOf('## 致谢')).toBeGreaterThan(readme.indexOf('## License'));
        expect(readme).not.toContain('## 仓库');
        expect(readme).not.toContain('原 React 版本');

        expect(contributing).toContain('animal-island-ui-vue');
        expect(contributing).not.toContain('https://github.com/guokaigdg/animal-island-ui/issues');
        expect(contributing).not.toContain('git clone https://github.com/guokaigdg/animal-island-ui.git');
        expect(contributing).not.toContain('Button.tsx');
    });

    it('keeps component copy focused on the current vue library rather than migration wording', async () => {
        const { default: ComponentPage } = await import('../../demo/ComponentPage.vue');

        const aboutWrapper = mount(ComponentPage, { props: { activeKey: 'about' } });
        const cardWrapper = mount(ComponentPage, { props: { activeKey: 'card' } });
        const modalWrapper = mount(ComponentPage, {
            props: { activeKey: 'modal' },
            global: {
                stubs: {
                    Teleport: true,
                },
            },
        });

        expect(aboutWrapper.text()).not.toContain('原仓库');
        expect(cardWrapper.text()).not.toContain('原版');
        expect(modalWrapper.text()).not.toContain('原版');
    });

    it('documents newly added key props for rate, progress, pagination, drawer and cursor', async () => {
        const { default: ComponentPage } = await import('../../demo/ComponentPage.vue');

        const rateWrapper = mount(ComponentPage, { props: { activeKey: 'rate' } });
        expect(rateWrapper.text()).toContain('allowHalf');

        const progressWrapper = mount(ComponentPage, { props: { activeKey: 'progress' } });
        expect(progressWrapper.text()).toContain('animated');

        const paginationWrapper = mount(ComponentPage, { props: { activeKey: 'pagination' } });
        expect(paginationWrapper.text()).toContain('showPrevNext');
        expect(paginationWrapper.text()).toContain('maxVisible');

        const drawerWrapper = mount(ComponentPage, { props: { activeKey: 'drawer' } });
        expect(drawerWrapper.text()).toContain('width');
        expect(drawerWrapper.text()).toContain('height');

        const cursorWrapper = mount(ComponentPage, { props: { activeKey: 'cursor' } });
        expect(cursorWrapper.text()).toContain('hotspotX');
        expect(cursorWrapper.text()).toContain('hotspotY');
    });

    it('uses end-user copy for switch and keeps installation guidance in quick-start', async () => {
        const { default: ComponentPage } = await import('../../demo/ComponentPage.vue');

        const switchWrapper = mount(ComponentPage, { props: { activeKey: 'switch' } });
        expect(switchWrapper.text()).not.toContain('只剩孤立控件');
        expect(switchWrapper.text()).not.toContain('适合承接');

        const quickStartWrapper = mount(ComponentPage, { props: { activeKey: 'quick-start' } });
        expect(quickStartWrapper.text()).toContain('npm install animal-island-ui-vue');
        expect(quickStartWrapper.text()).toContain('基础组件');
    });

    it('keeps demo panels only where the documentation really needs them', async () => {
        const { default: ComponentPage } = await import('../../demo/ComponentPage.vue');

        const aboutWrapper = mount(ComponentPage, {
            props: { activeKey: 'about' },
            global: {
                stubs: {
                    Teleport: true,
                },
            },
        });
        const quickStartWrapper = mount(ComponentPage, {
            props: { activeKey: 'quick-start' },
            global: {
                stubs: {
                    Teleport: true,
                },
            },
        });
        const buttonWrapper = mount(ComponentPage, { props: { activeKey: 'button' } });

        expect(aboutWrapper.findAll('.demo-panel')).toHaveLength(0);

        expect(quickStartWrapper.findAll('.demo-panel')).toHaveLength(1);
        expect(quickStartWrapper.get('.demo-panel').text()).toContain('搜索与输入');
        expect(quickStartWrapper.get('.demo-panel').text()).toContain('布尔状态');

        expect(buttonWrapper.findAll('.demo-panel')).toHaveLength(0);
    });

    it('provides richer grouped demos for key component pages', async () => {
        const { default: ComponentPage } = await import('../../demo/ComponentPage.vue');

        const buttonWrapper = mount(ComponentPage, { props: { activeKey: 'button' } });
        expect(buttonWrapper.text()).toContain('5 types');
        expect(buttonWrapper.text()).toContain('type 按钮类型');
        expect(buttonWrapper.text()).toContain('danger / ghost / loading / disabled 状态');
        expect(buttonWrapper.text()).toContain('size 尺寸');
        expect(buttonWrapper.text()).toContain('图标按钮');
        expect(buttonWrapper.text()).toContain('块级按钮');
        expect(buttonWrapper.text()).toContain('danger 组合');

        const cardWrapper = mount(ComponentPage, { props: { activeKey: 'card' } });
        expect(cardWrapper.text()).toContain('暖桃粉卡片');
        expect(cardWrapper.text()).toContain('标题信息卡');
        expect(cardWrapper.text()).toContain('基础卡片');
        expect(cardWrapper.text()).toContain('色板');
        expect(cardWrapper.text()).toContain('type="default"');
        expect(cardWrapper.text()).toContain('type="title"');
        expect(cardWrapper.text()).toContain('color + type="title"');

        const modalWrapper = mount(ComponentPage, {
            props: { activeKey: 'modal' },
            global: {
                stubs: {
                    Teleport: true,
                },
            },
        });
        const collapseWrapper = mount(ComponentPage, { props: { activeKey: 'collapse' } });
        const paginationWrapper = mount(ComponentPage, { props: { activeKey: 'pagination' } });

        expect(collapseWrapper.text()).toContain('基础用法');
        expect(collapseWrapper.text()).toContain('defaultExpanded 默认展开');
        expect(collapseWrapper.text()).toContain('disabled 禁用状态');
        expect(collapseWrapper.text()).toContain('多面板 / 手风琴');
        expect(collapseWrapper.findAll('.demo-group')).toHaveLength(4);

        expect(paginationWrapper.text()).toContain('标准分页');
        expect(paginationWrapper.text()).toContain('精简分页');
        expect(paginationWrapper.text()).toContain('当前页状态');
        expect(paginationWrapper.text()).toContain('当前第');
        expect(paginationWrapper.findAll('.demo-group')).toHaveLength(3);

        expect(modalWrapper.text()).toContain('基础弹窗');
        expect(modalWrapper.text()).toContain('带标题弹窗');
        expect(modalWrapper.text()).toContain('自定义操作区');
        expect(modalWrapper.text()).toContain('无底部操作');
        expect(modalWrapper.findAll('.demo-group')).toHaveLength(4);
    });

    it('keeps documentation sections closer to the original lighter layout shell', async () => {
        const { default: ComponentPage } = await import('../../demo/ComponentPage.vue');

        const wrapper = mount(ComponentPage, { props: { activeKey: 'button' } });

        expect(wrapper.find('.page-shell').attributes('data-page-shell')).toBe('docs');
        expect(wrapper.find('.page-title-card').attributes('data-title-card')).toBe('page');
        expect(wrapper.find('.doc-section').attributes('data-section-style')).toBe('light');
    });
});
