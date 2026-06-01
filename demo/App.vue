<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Cursor } from '../src';
import HomePage from './HomePage.vue';
import ComponentPage from './ComponentPage.vue';

const homeBgUrl = new URL('./img/home_bg.svg', import.meta.url).href;
const contentBgUrl = new URL('./img/content_bg_pc.jpg', import.meta.url).href;
const menuBgUrl = new URL('./img/menu_bg.svg', import.meta.url).href;
const nookIconUrl = new URL('./img/nook-phone/nook1.svg', import.meta.url).href;
const guideLineUrl = new URL('./img/guide-bg-line.webp', import.meta.url).href;
const cursorIconUrl = new URL('../src/components/Cursor/cursor-icon.png', import.meta.url).href;

const docItems = [
    { key: 'quick-start', label: '快速使用' },
    { key: 'about', label: '关于' },
];

const componentItems = [
    { key: 'avatar', label: 'Avatar 头像' },
    { key: 'badge', label: 'Badge 徽标' },
    { key: 'button', label: 'Button 按钮' },
    { key: 'checkbox', label: 'Checkbox 复选框' },
    { key: 'descriptions', label: 'Descriptions 描述列表' },
    { key: 'empty', label: 'Empty 空状态' },
    { key: 'drawer', label: 'Drawer 抽屉' },
    { key: 'form', label: 'Form 表单' },
    { key: 'form-item', label: 'FormItem 表单项' },
    { key: 'input', label: 'Input 输入框' },
    { key: 'list', label: 'List 列表' },
    { key: 'message', label: 'Message 全局提示' },
    { key: 'notification', label: 'Notification 通知卡片' },
    { key: 'pagination', label: 'Pagination 分页' },
    { key: 'popover', label: 'Popover 气泡卡片' },
    { key: 'progress', label: 'Progress 进度条' },
    { key: 'radio', label: 'Radio 单选框' },
    { key: 'rate', label: 'Rate 评分' },
    { key: 'select', label: 'Select 选择器' },
    { key: 'slider', label: 'Slider 滑块' },
    { key: 'switch', label: 'Switch 开关' },
    { key: 'tabs', label: 'Tabs 标签页' },
    { key: 'tag', label: 'Tag 标签' },
    { key: 'textarea', label: 'Textarea 文本域' },
    { key: 'tooltip', label: 'Tooltip 文字提示' },
    { key: 'card', label: 'Card 卡片' },
    { key: 'collapse', label: 'Collapse 折叠面板' },
    { key: 'cursor', label: 'Cursor 光标' },
    { key: 'modal', label: 'Modal 弹窗' },
    { key: 'divider-comp', label: 'Divider 分割线' },
    { key: 'loading', label: 'Loading 加载' },
    { key: 'typewriter', label: 'Typewriter 打字机' },
];

const hash = ref(window.location.hash.slice(1) || '/');

const syncHash = () => {
    hash.value = window.location.hash.slice(1) || '/';
};

onMounted(() => window.addEventListener('hashchange', syncHash));
onBeforeUnmount(() => window.removeEventListener('hashchange', syncHash));

const navigate = (path: string) => {
    window.location.hash = path;
};

const activeKey = computed(() =>
    hash.value.startsWith('/') && hash.value.length > 1
        ? hash.value.slice(1)
        : 'home'
);

const isHomePage = computed(() => activeKey.value === 'home');
</script>

<template>
    <div
        v-if="isHomePage"
        class="layout layout-home"
        data-page="home"
        :style="{ background: `url(${homeBgUrl}) center/cover no-repeat, #7DC395` }"
    >
        <HomePage @navigate="navigate" />
    </div>

    <Cursor
        v-else
        class="doc-cursor-shell"
        :src="cursorIconUrl"
        :hotspot-x="4"
        :hotspot-y="0"
    >
        <div
            class="layout"
            :style="{ background: `url(${contentBgUrl}) center fixed` }"
        >
            <aside class="sidebar" :style="{ background: `url(${menuBgUrl}) center/cover no-repeat` }">
                <div class="sidebar-header" @click="navigate('/')">
                    <img :src="nookIconUrl" alt="nook" class="nook-icon" />
                    集合啦！Animal
                </div>

                <nav class="menu-list">
                    <div class="menu-group">
                        <div class="menu-category">文档</div>
                        <div
                            v-for="item in docItems"
                            :key="item.key"
                            class="menu-item"
                            :class="{ active: activeKey === item.key }"
                            @click="navigate(`/${item.key}`)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                    <div class="menu-group">
                        <div class="menu-category">组件</div>
                        <div
                            v-for="item in componentItems"
                            :key="item.key"
                            class="menu-item"
                            :class="{ active: activeKey === item.key }"
                            @click="navigate(`/${item.key}`)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                </nav>
            </aside>

            <main class="main">
                <ComponentPage :active-key="activeKey" />
            </main>

            <img :src="guideLineUrl" alt="" class="guide-line" />
        </div>
    </Cursor>
</template>

<style scoped>
.doc-cursor-shell {
    display: block;
    min-height: 100vh;
}

.layout {
    display: flex;
    height: 100vh;
    min-height: 100vh;
    position: relative;
    align-items: stretch;
    overflow: hidden;
}

.layout-home {
    justify-content: center;
    overflow-y: auto;
}

.sidebar {
    width: 220px;
    min-width: 220px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: sticky;
    top: 0;
    align-self: flex-start;
    height: 100vh;
    z-index: 2;
}

.sidebar-header {
    display: flex;
    align-items: center;
    padding: 20px 16px 12px;
    border-bottom: 1px solid #e8e2d6;
    color: #725d42;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
}

.nook-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}

.menu-list {
    flex: 1;
    padding: 12px 0 18px;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.menu-group + .menu-group {
    margin-top: 6px;
}

.menu-category {
    padding: 12px 16px 6px;
    color: #a0936e;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.menu-item {
    height: 40px;
    margin: 1px 4px;
    padding: 0 16px 0 26px;
    border-radius: 12px;
    color: #8a7b66;
    font-size: 14px;
    font-weight: 600;
    line-height: 40px;
    cursor: pointer;
    transition: all 0.15s;
}

.menu-item:hover {
    background: #d6dff0;
}

.menu-item.active {
    background: #b7c6e5;
    color: #fff;
}

.main {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    padding: 32px 40px 64px;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
}

.guide-line {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 220px;
    width: calc(100% - 220px);
    pointer-events: none;
    z-index: 0;
}

@media (max-width: 960px) {
    .layout {
        display: block;
        height: auto;
        overflow: visible;
    }

    .sidebar {
        width: 100%;
        min-width: 0;
        height: auto;
        position: sticky;
        top: 0;
    }

    .menu-list {
        display: flex;
        align-items: center;
        gap: 8px;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 12px;
    }

    .menu-category {
        display: none;
    }

    .menu-group {
        display: contents;
    }

    .menu-item {
        flex: none;
        margin: 0;
        padding: 0 18px;
        white-space: nowrap;
    }

    .main {
        height: auto;
        padding: 24px 16px 40px;
        overflow: visible;
    }

    .guide-line {
        left: 0;
        width: 100%;
    }
}
</style>
