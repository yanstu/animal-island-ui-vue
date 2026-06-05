# animal-island-ui-vue 代码审查与改进报告

> 日期：2026-06-05
> 范围：全量 30 个组件、核心基础设施、样式系统、测试与构建/发布脚本

---

## 一、审查结论概览

整体是一个结构清晰、完成度较高的 Vue 3 + TypeScript + Vite 组件库。亮点：

- 架构统一：每个组件独立目录（`.vue` + `.module.less` + `index.ts`），统一用 `useControllable` 抽象受控/非受控、`classNames` 拼接类名、Less 变量 + CSS 自定义属性的主题方案。
- 复杂交互组件质量高：`Select`/`Tabs`/`Rate`/`Slider`/`Pagination`/`Progress` 的键盘导航与 ARIA 较完善。
- 工程规范：TS `strict`、类型导出完整、组件全部有单元测试、无 `console` 残留、发布脚本用依赖注入便于测试、无密钥硬编码。

审查共发现 4 个必现 Bug 以及一批一致性、功能性与可访问性问题，详见下表。

| 级别 | 问题 | 状态 |
| --- | --- | --- |
| 必现 Bug | `Cursor` 默认光标图在打包后 404（内联相对路径不经打包器） | 已修复 |
| 必现 Bug | `Button` primary 与 default 视觉几乎相同，且硬编码颜色不响应主题 | 已修复 |
| 必现 Bug | `Button` danger 的 text/link 为白字，在浅色背景上不可见 | 已修复 |
| 必现 Bug | `Modal` 默认底部「取消」也是 primary，主次不分 | 已修复 |
| 一致性 | 仅 `Modal` 用 Teleport，`Drawer`/`Select`/`Tooltip`/`Popover` 未 teleport，易被父容器裁剪 | 已修复 |
| 一致性 | `Modal`/`Drawer` 均缺焦点陷阱；`Modal` 缺 `aria-labelledby` | 已修复 |
| 功能性 | `Message`/`Notification` 无命令式 API、无自动消失/堆叠 | 已修复 |
| 功能性 | `Form`/`FormItem` 无校验能力 | 已修复 |
| 功能性 | `Radio` 无 `RadioGroup`、无方向键导航、模式不统一 | 已修复 |
| 可访问性 | 次要文本对比度不足；`Select` 选项与 `aria-activedescendant` 冲突；全局样式污染；`Slider` 缺可访问名称 | 已修复 |
| 功能性 | `Collapse` 实为 FAQ 卡片、命名偏离通用预期 | 已重构（兼容单面板 + 新增多面板/手风琴/受控） |
| 工程 | 多个浮层组件在 `setup` 阶段访问 `document`，SSR 不友好 | 记录为后续项 |

---

## 二、本次改进实现

### 1. 必现 Bug 修复

- **Cursor 资源路径**：`Cursor.vue` 改为 `import cursorIcon from './cursor-icon.png'`，由打包器处理 URL，替换原先写死在内联 style 中的 `./cursor-icon.png`。
- **Button primary**：改用 `--animal-primary-color` 系列 CSS 变量作背景 + 白字 + 立体硬阴影，主操作清晰区分于 default，且支持运行时主题覆盖。
- **Button danger text/link**：白字改为 `--animal-error-color` 系列，浅色背景下可读。
- **Modal footer**：默认「取消」按钮由 `primary` 改为 `default`，与「确定」形成主次。

### 2. 浮层体系统一（Teleport + 焦点陷阱 + 定位）

新增两个内部 composable：

- `src/internal/useFocusTrap.ts`：在 `aria-modal` 对话框内陷阱 Tab/Shift+Tab 焦点循环，带 SSR 守卫。
- `src/internal/useFloating.ts`：为 teleport 到 `body` 的浮层做定位，支持主轴翻转、视口夹取、`matchWidth`，并在滚动/缩放时跟随更新。

应用：

- `Modal`：补 `useFocusTrap` + `aria-labelledby`（关联标题）。
- `Drawer`：补 `Teleport to="body"` + `useFocusTrap`；进入动画改为 CSS `@keyframes`（聚焦后不再触发状态变更，焦点稳定）。
- `Select`：下拉 `Teleport` + `useFloating`（`matchWidth`），并修正点击外部关闭判断（同时检测下拉容器）。
- `Tooltip` / `Popover`：浮层 `Teleport` + `useFloating` 定位（`top`/`bottom`），`Popover` 点击外部判断同时检测浮层。

### 3. Message / Notification 命令式 API

新增单例服务，支持堆叠、自动消失与定位，组件用法保持不变：

- Message：`src/components/Message/{messageStore.ts, MessageContainer.vue, service.ts}`，顶部居中容器。
- Notification：`src/components/Notification/{notificationStore.ts, NotificationContainer.vue, service.ts}`，右上角容器；`Notification` 组件新增可选 `closable` + `close` 事件。

两者均通过 `Object.assign` 把 API 附加到同名组件上，并额外导出小写单例（`message` / `notification`）。

### 4. Form 校验体系 + RadioGroup

- `src/internal/formContext.ts`：定义 `FormRule`、注入键与规则执行器 `runRules`（支持 `required`/`min`/`max`/`pattern`/`validator`/`trigger`）。
- `Form`：新增 `model`/`rules`，`provide` 上下文，`defineExpose({ validate, clearValidate, resetFields })`。
- `FormItem`：新增 `prop`/`rules`/`required`，注入上下文，change/blur 触发字段校验并展示错误信息与必填星标。
- `RadioGroup`：`src/components/RadioGroup/`，`role="radiogroup"`、方向键导航、roving tabindex；`Radio` 改造为可在分组内工作（注入上下文）同时保留独立用法。

### 5. 可访问性与工程改进

- 次要文本色 `@text-color-secondary` 由 `#9f927d` 调深为 `#75643f`（在主背景上对比度约 5.4:1，达 WCAG AA）。
- `Select` 选项加 `tabindex="-1"`（修复与 `aria-activedescendant` 冲突）并加入 active 选项滚动跟随。
- `reset.less`：移除全局 `body { color }` 污染；属性选择器 `[class^='animal-']` 修正为 `[class*='animal-']`。
- `Slider` 原生 range 输入加 `aria-label` 与 `aria-valuetext`。

### 6. 入口与插件

- `src/index.ts`：导出 `RadioGroup`、`message`、`notification` 及相关类型（`FormRule`、`MessageApi`、`NotificationApi` 等）。
- `src/plugin.ts`：全局注册新增 `RadioGroup`。

### 7. Collapse 通用化（折叠面板 / 手风琴）

`Collapse` 在保留原 FAQ 单面板用法（`question`/`answer`/`defaultExpanded`）完全向后兼容的前提下，新增：

- `items`：多面板数据（`{ key, title, content, disabled }`）。
- `accordion`：手风琴模式，同时只展开一个面板。
- `modelValue` / `defaultActiveKeys`：受控 / 非受控的展开 key 列表，配合 `update:modelValue` 与 `change` 事件。
- 类型 `CollapseItem` 已导出。

### 8. 动效与细节打磨（动森弹性风格）

为统一动森（Animal Crossing）风格的弹性质感：

- 新增弹性回弹缓动 `--animal-motion-ease-bounce`（`cubic-bezier(0.34, 1.56, 0.64, 1)`）。
- `Checkbox` 勾选、`Radio` 圆点改为弹性 `scale` 入场；`Switch` 手柄、`Modal` 弹窗、`Select`/`Popover` 浮层入场统一为弹性缓动，点击类交互更有「果冻感」。
- `reset.less` 新增 `prefers-reduced-motion: reduce` 支持（仅作用于组件库自身元素），尊重系统「减少动态效果」偏好。
- `Button` 位移（hover 上浮 / 按下）改用弹性缓动，立体木牌按钮更具回弹手感。
- `Tooltip` 新增 `openDelay`（默认 200ms）悬停延迟，避免划过即弹出。
- `Collapse` 展开 / 收起采用 `grid-template-rows` 平滑高度动画，缓动统一为变量。

### 9. Demo 演示更新

`demo/ComponentPage.vue` 增补对新能力的可视化演示：

- Message / Notification 页新增「命令式调用」按钮区。
- Form 页改为带 `model` / `rules` 的真实校验示例（提交校验 + 重置）。
- Radio 页新增 `RadioGroup` 分组演示（方向键切换）。
- Collapse 页新增「多面板 / 手风琴」演示。

---

## 三、新增 API 用法

### 命令式 Message / Notification

```ts
import { message, notification } from 'animal-island-ui-vue';

message.success('保存成功');
message.warning('注意检查输入', 5000);
const close = message.open({ content: '处理中…', duration: 0 });
close();

notification.success('已发布', '岛屿已对访客开放');
notification.info('提醒', '记得给岛民送礼物', 6000);
```

### 表单校验

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Form, FormItem, Input } from 'animal-island-ui-vue';

const model = reactive({ name: '' });
const formRef = ref();

const onSubmit = async () => {
    const ok = await formRef.value.validate();
    if (ok) {
        // 提交
    }
};
</script>

<template>
    <Form
        ref="formRef"
        :model="model"
        :rules="{ name: [{ required: true, message: '请输入昵称' }] }"
    >
        <FormItem label="昵称" prop="name">
            <Input v-model="model.name" />
        </FormItem>
    </Form>
</template>
```

### 单选组

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup, Radio } from 'animal-island-ui-vue';

const activity = ref('fishing');
</script>

<template>
    <RadioGroup v-model="activity">
        <Radio value="fishing">钓鱼大赛</Radio>
        <Radio value="bug">捉虫大会</Radio>
        <Radio value="meteor" disabled>流星观测</Radio>
    </RadioGroup>
</template>
```

### 折叠面板 / 手风琴

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Collapse } from 'animal-island-ui-vue';

const open = ref<string[]>(['guide']);
const faqs = [
    { key: 'guide', title: '怎样开放岛屿？', content: '完成基础布置并确认时间后即可开放。' },
    { key: 'visitor', title: '来客如何安排？', content: '通过公告板提醒并按区域分流。' },
];
</script>

<template>
    <Collapse v-model="open" accordion :items="faqs" />
</template>
```

---

## 四、验证结果

| 项目 | 命令 | 结果 |
| --- | --- | --- |
| 单元测试 | `npm test` | 100 通过 / 1 失败（仅 `home-page.test`，见下） |
| 类型与打包 | `npm run build` | 成功，`dist/{es,cjs,types}` 完整 |
| 本地预览 | `npm run dev` | 正常启动（`http://localhost:5173/`） |
| 浏览器视觉 | demo 页面逐项检查 | Button 配色、Modal 主次与造型、Select/Message 浮层定位（CDP 实测）、RadioGroup、Collapse 多面板均正常无破坏 |

新增测试文件：

- `tests/unit/message-service.test.ts`
- `tests/unit/notification-service.test.ts`
- `tests/unit/radio-group.test.ts`
- `tests/unit/form-validate.test.ts`
- `tests/unit/collapse-accordion.test.ts`

测试环境调整：`tests/setup.ts` 增加 `config.global.stubs = { teleport: true }`，使 Teleport 内容在测试中就地渲染，兼容既有 `wrapper` 查询与基于 `document.body` 的查询。

---

## 五、已知限制与后续建议

1. **`home-page.test.ts` 失败为预先存在**：该用例断言 demo 首页的旧文案（如「Animal风格的 Vue 3 组件库」），但当前 `demo/HomePage.vue` 文案为「Animal Island 风格的 Vue 3 组件库」。两个文件相对 HEAD 均未改动，属仓库既有失败，与本次改动无关，未擅自修改 demo 文案。
2. **Button primary 对比度权衡**：主色 `#19c8b9` 上白字对比度约 2.1:1，低于 WCAG AA 正文标准。这是品牌色与「主按钮醒目」之间的权衡；若需严格达标，建议将主色整体调深或主按钮文字改用深色。
3. **SSR**：多个组件仍在 `setup`/`watch` 阶段访问 `document`/`window`，浮层 composable 已加守卫，但完整 SSR 支持需进一步处理。
4. **其余基础组件增强**：`Checkbox` 半选、`Badge` 圆点/`99+`、`Tag` 可关闭、`Textarea` 字数统计、`Pagination` 跳页等可按需补充。
