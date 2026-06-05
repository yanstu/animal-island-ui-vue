# animal-island-ui-vue Design

## Summary

本设计的目标是构建 `animal-island-ui-vue`，一套以 Vue 3 + TypeScript 为基础、面向独立发布的新组件库，并以新的 Git 仓库与 npm 包名 `animal-island-ui-vue` 对外发布。

设计优先级如下：

1. 视觉风格零有意差异
2. 组件名、核心 prop 名、默认行为尽量保持现有库语义一致
3. 对外 API 采用 Vue 3 社区可接受的最佳实践，不为了表面一致牺牲 Vue 可用性
4. 目录结构、命名和导出方式达到成熟开源组件库的可维护级别

本次重构不是双框架共存，不保留 React 运行时代码，也不在同一仓库内同时维护 React/Vue 两套实现。当前仓库内的设计文档用于指导后续迁移；实际实现目标是迁移到新的 Git 仓库。

## Scope

本次迁移的组件范围与现有库保持一致：

- `Button`
- `Input`
- `Switch`
- `Modal`
- `Card`
- `Collapse`
- `Cursor`
- `Divider`

本次迁移同时包含以下内容：

- Vue 3 + TypeScript 组件实现
- 新库公共导出入口
- 全局样式和主题 token 迁移
- 文档站替代当前 demo
- 视觉回归基线与验证脚本
- README 与迁移说明

本次规划不包含以下内容：

- 新增超出当前首批组件范围的组件
- 额外的主题系统、暗黑模式、国际化系统
- Headless 层或多包 monorepo
- 对既有视觉语言的再设计

## Non-Negotiable Constraints

### 1. Visual Fidelity

“不能接受任何样式差异”在工程上必须被定义为可验证约束，而不是口头目标。本项目将其定义为：

- 使用同一套视觉资源：Less token、背景图、装饰图、cursor 图、divider 图
- 使用同一套 CSS Modules 类名生成规则
- 对关键组件保持相同 DOM 层级和状态类拼装逻辑
- 在同一浏览器、同一视口、同一字体资源前提下，通过基线截图进行视觉回归比对
- 验收目标为：`0 有意视觉差异`

说明：

- 跨操作系统字体渲染差异、浏览器抗锯齿策略差异不能定义为“实现错误”
- 因此视觉验收环境必须固定

### 2. API Compatibility

兼容的目标不是“React API 原样复刻”，而是：

- 保持相同组件名
- 保持核心 prop 语义
- 保持默认状态行为
- 在 Vue 中不自然的 API 位置，改成 Vue 习惯，并提供明确迁移映射

### 3. Structural Restraint

该库目前只有 8 个组件。架构必须克制：

- 不上 monorepo
- 不引入 headless + skin 双层体系
- 不拆分成多个发布包
- 不添加未被当前需求驱动的抽象层

## Recommended Architecture

推荐方案是“等形迁移 + 最少内部抽象”。

核心原则：

- 样式文件优先原样迁移
- 组件视觉结构优先原样迁移
- 行为状态按 Vue 3 写法重建
- 只抽取两个确定会复用的内部能力：
  - 受控/非受控状态处理
  - class 名拼接与 attrs 落点控制

### Directory Layout

新仓库推荐结构：

```text
animal-island-ui-vue/
  src/
    components/
      Button/
        Button.vue
        button.module.less
        index.ts
      Input/
        Input.vue
        input.module.less
        index.ts
      Switch/
        Switch.vue
        switch.module.less
        index.ts
      Modal/
        Modal.vue
        modal.module.less
        index.ts
      Card/
        Card.vue
        card.module.less
        index.ts
      Collapse/
        Collapse.vue
        collapse.module.less
        index.ts
      Cursor/
        Cursor.vue
        cursor.module.less
        index.ts
      Divider/
        Divider.vue
        divider.module.less
        index.ts
    internal/
      useControllable.ts
      classNames.ts
    styles/
      variables.less
      themes/default.less
      reset.less
      index.less
    index.ts
    plugin.ts

  docs/
    .vitepress/
    examples/
    public/
    index.md

  tests/
    unit/
    visual/

  scripts/
    capture-react-baseline/
    verify-visual/

  package.json
  tsconfig.json
  tsconfig.build.json
  vite.config.ts
  vite.config.docs.ts
  README.md
  CONTRIBUTING.md
```

### Why Single-Package

单包仓库优于 monorepo 的原因：

- 只有一个对外 npm 包
- 组件数量不多
- 当前迁移目标是“稳定替换”，不是平台化扩展
- 更容易维持简洁的开源认知模型

## Build and Tooling

### Core Stack

- Vue 3
- TypeScript
- Vite
- Less
- CSS Modules
- Vue TSC
- Vitest
- Playwright

### Build Requirements

构建产物应至少包含：

- `dist/es`
- `dist/cjs`
- `dist/types`
- 单份库样式产物

### CSS Modules Rule

继续沿用当前类名规则：

```ts
generateScopedName: 'animal-[local]-[hash:base64:5]'
```

这样可以保证：

- 迁移后的 class 命名风格保持稳定
- 样式调试体验延续现有库
- 视觉回归时更容易定位差异

### Public Entry

公共入口必须支持两种使用方式：

1. 按需导入组件
2. 作为 Vue 插件整体注册

例如：

```ts
import { Button, Modal } from 'animal-island-ui-vue';
```

```ts
import { createApp } from 'vue';
import AnimalIslandUIVue from 'animal-island-ui-vue';

const app = createApp(App);
app.use(AnimalIslandUIVue);
```

## Styling Strategy

### Global Style Baseline

以下文件应作为视觉基线原样迁移，除非验证需要最小改动：

- `src/styles/variables.less`
- `src/styles/themes/default.less`
- `src/styles/reset.less`
- `src/styles/index.less`

其中：

- `variables.less` 是设计 token 源
- `themes/default.less` 是 CSS Custom Properties 映射层
- `reset.less` 是基础样式校准层
- `index.less` 是库全局样式入口

### Component Styles

每个组件继续保留自己的 `*.module.less` 文件。

规则：

- 类名语义保持稳定
- 不为“Vue 化”修改样式命名
- 不合并无关组件样式
- 不提前抽出没有重复收益的 mixin 或 token 层

### DOM Fidelity

为保证视觉零有意差异，以下元素必须优先保持：

- 主容器层级
- 状态 class 的启用条件
- 装饰元素的位置和存在性
- 参与排版和动画的包裹层

可以变化的只有：

- Vue 所需的 template 结构性包裹，但前提是不改变视觉结果
- attrs 透传的落点控制
- slot 与 prop 兼容时的渲染逻辑

## API Design

## Public Rules

- 组件名保持不变
- 所有组件提供精确 TS 类型
- `class` 和 `style` 透传必须可控
- 默认内容使用 slot
- Vue 事件使用 `emit`
- 文档同时提供“推荐写法”和“React 版映射说明”

## Component-Level API Mapping

### Button

保留：

- `type`
- `size`
- `danger`
- `ghost`
- `block`
- `loading`
- `disabled`
- `htmlType`

设计：

- 默认内容改为默认插槽
- `icon` 同时支持 prop 和 `#icon` 插槽
- 点击事件采用 Vue 原生按钮事件透传

### Input

保留：

- `size`
- `allowClear`
- `status`
- `disabled`
- `defaultValue`

兼容与推荐：

- 推荐值绑定：`v-model`
- 兼容值绑定：`value`
- 推荐事件：`update:modelValue`
- 额外事件：`change`、`clear`
- `prefix`、`suffix` 同时支持 prop 与同名插槽

关键要求：

- 原生 input attrs 必须挂到 `<input>` 而不是 wrapper
- 继续支持受控/非受控两种模式

### Switch

保留：

- `checked`
- `defaultChecked`
- `size`
- `disabled`
- `loading`
- `checkedChildren`
- `unCheckedChildren`

兼容与推荐：

- 推荐：`v-model:checked`
- 同时支持：`v-model`
- 事件：`update:checked`、`update:modelValue`、`change`
- 文案同时支持 prop 和 `#checked` / `#unchecked` 插槽

### Modal

保留：

- `open`
- `title`
- `width`
- `maskClosable`
- `closable`

兼容与推荐：

- 推荐：`v-model:open`
- 事件：`update:open`、`close`、`ok`
- `title` 支持 prop 和 `#title`
- `footer` 区域主推 `#footer` 插槽
- 当 `footer` 显式为 `null` 时，继续表示“不渲染底部区域”

行为要求：

- 保留 ESC 关闭
- 保留遮罩关闭
- 保留 body scroll lock
- 保留 portal/teleport 语义

### Card

保留：

- `type`
- `color`

设计：

- 内容改默认插槽
- 点击事件透传到根节点
- 风格和 color 枚举保持不变

### Collapse

保留：

- `defaultExpanded`
- `disabled`
- `question`
- `answer`

兼容与推荐：

- 为兼容现有示例，继续支持 `question` 和 `answer` prop
- Vue 推荐写法增加 `#question` 与默认插槽

行为要求：

- 默认展开逻辑保持不变
- 动画展开方式保持视觉结果一致

### Cursor

Cursor 为最简单的等形迁移组件。

要求：

- 继续通过样式覆盖子树 cursor
- 内容改为默认插槽

### Divider

Divider 保持装饰性分割线实现。

要求：

- 根节点结构尽量不变
- 背景图和尺寸不变

## Internal Utilities

### `useControllable.ts`

职责：

- 统一处理受控 / 非受控状态
- 支持 `modelValue`
- 支持具名 model，如 `checked`、`open`
- 提供最小必要 API，不做通用状态机框架

### `classNames.ts`

职责：

- 统一 class 拼接
- 保持组件内部实现简洁
- 避免每个组件重复写数组过滤拼接逻辑

## Documentation Strategy

当前 `demo/` 目录应升级为更专业的文档站结构。

文档站必须承担三类职责：

1. 展示组件视觉和交互
2. 提供 Vue 推荐用法
3. 给出现有 React 版到 Vue 版的映射说明

推荐文档章节：

- Introduction
- Installation
- Quick Start
- Theming
- Components
- Migration from React Edition
- Development

每个组件页至少包含：

- 视觉示例
- 基础用法
- 状态用法
- 插槽用法
- API 表
- 迁移提示

## Visual Regression Plan

视觉一致性必须通过工具链保证。

### Baseline Capture

在迁移初期，从当前 React 版本产出基线截图：

- Button
- Input
- Switch
- Modal
- Card
- Collapse
- Cursor
- Divider
- 文档页关键布局

每个组件至少覆盖：

- 默认状态
- 关键状态
- 尺寸变体
- 色彩变体
- 打开/关闭或展开/收起状态

### Visual Test Environment

固定以下条件：

- 浏览器：Playwright Chromium
- 视口：预设桌面与移动端尺寸
- 字体：本地锁定或随项目声明
- 缩放：100%

### Comparison Rule

视觉回归的判定原则：

- 任何预期内的差异都必须先更新基线并在变更说明中解释
- 非预期差异一律视为回归
- 首个目标版本不接受“之后再调”的视觉债务

## Testing Strategy

### Unit Tests

单元测试覆盖：

- 组件基本渲染
- 受控 / 非受控行为
- 事件派发
- slot 与 prop 兼容逻辑
- attrs 落点控制

### Interaction Tests

使用 Playwright 覆盖：

- Button 状态表现
- Input 清空
- Switch 切换
- Modal 打开关闭、ESC、遮罩点击
- Collapse 展开收起

### Visual Tests

使用截图测试覆盖：

- 各组件静态视觉
- 关键交互后的视觉状态

## Migration Order

为了把视觉风险降到最低，迁移顺序必须遵守“先静态、后状态、再复杂浮层”的原则。

推荐顺序：

1. 样式基线与构建底座
2. `Card`
3. `Divider`
4. `Cursor`
5. `Button`
6. `Input`
7. `Switch`
8. `Collapse`
9. `Modal`
10. 文档站
11. README 与迁移文档
12. 视觉回归补齐与收尾

理由：

- `Card`、`Divider`、`Cursor` 最适合验证样式和打包底座
- `Button`、`Input`、`Switch` 是状态交互基础件
- `Collapse` 引入过渡布局动画
- `Modal` 最后处理，因为涉及 teleport、遮罩、键盘和滚动锁定

## Acceptance Criteria

项目完成时，必须满足以下条件：

### Package

- npm 包名为 `animal-island-ui-vue`
- 可以被 Vue 3 项目直接安装与使用
- 产物包含 ES、CJS、类型声明

### Visual

- 核心组件视觉与 React 版对照无有意差异
- 视觉回归测试全部通过

### API

- 组件名与核心 prop 语义保持稳定
- Vue 推荐写法完整可用
- React 版映射文档完整

### Quality

- 单元测试通过
- 交互测试通过
- 构建通过
- 文档站可运行

## Risks and Mitigations

### Risk 1: Slot/Prop 双支持导致渲染分支增多

缓解：

- 仅在确实需要兼容的组件上启用
- 采用明确优先级：slot 优先于 prop

### Risk 2: Vue attrs 默认继承导致属性落点错误

缓解：

- 对包装型组件显式关闭默认继承
- 手动控制 attrs 挂载位置

### Risk 3: Modal teleport 后样式或 clip-path 表现偏差

缓解：

- 保持结构等形
- 单独建立 Modal 视觉基线
- 在固定浏览器中优先验证

### Risk 4: 过度抽象破坏迁移稳定性

缓解：

- 只保留 `useControllable` 和 `classNames`
- 任何新增抽象都必须证明至少被两个组件稳定复用

## Decision Record

### Confirmed Decisions

- 新 Git 仓库，不在原仓库长期保留 React 实现
- 新 npm 包名：`animal-island-ui-vue`
- Vue 3 + TypeScript
- 视觉与交互风格以当前仓库为唯一基线
- 单包仓库，不使用 monorepo
- API 策略采用“兼容核心语义 + Vue 最佳实践 + 明确映射文档”

### Rejected Alternatives

- React/Vue 双实现共存：增加维护成本，不符合最终替换目标
- 单包多框架入口：公共认知复杂，维护收益低
- Headless + Skin 架构：对当前规模过度设计
- 先重做设计系统再做组件：视觉漂移风险高

## Implementation Readiness

该设计已经具备进入实施计划阶段的条件：

- 目标边界清晰
- 技术栈清晰
- 目录结构清晰
- API 兼容策略清晰
- 视觉验收标准清晰
- 迁移顺序清晰

下一步应进入实施计划编写，输出一个可直接执行的分任务计划，并按任务顺序完成新仓库搭建、组件迁移、视觉验证和文档交付。
