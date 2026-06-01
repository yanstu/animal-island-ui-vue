export type ApiRow = {
    prop: string;
    desc: string;
    type: string;
    defaultVal?: string;
};

export type DemoSection = {
    title: string;
    desc?: string;
    code?: string;
    api?: ApiRow[];
};

export type ComponentDoc = {
    title: string;
    desc: string;
    sections: DemoSection[];
};

const row = (
    prop: string,
    desc: string,
    type: string,
    defaultVal = '-'
): ApiRow => ({
    prop,
    desc,
    type,
    defaultVal,
});

const section = (
    title: string,
    desc: string,
    code?: string,
    api?: ApiRow[]
): DemoSection => ({
    title,
    desc,
    code,
    api,
});

export const installCode = `npm install animal-island-ui-vue`;

export const quickStartCode = `import { createApp } from 'vue';
import App from './App.vue';
import AnimalIslandUIVue from 'animal-island-ui-vue';

createApp(App).use(AnimalIslandUIVue).mount('#app');`;

export const onDemandCode = `import { ref } from 'vue';
import {
  Button,
  Input,
  Pagination,
  Popover,
  Select,
  Switch,
  Tag,
  Tabs,
} from 'animal-island-ui-vue';

const keyword = ref('');
const checked = ref(false);
const activity = ref('');
const current = ref(1);`;

export const basicUsageCode = `const keyword = ref('');
const checked = ref(false);
const current = ref(1);

<Input v-model="keyword" allow-clear placeholder="搜索岛屿活动" />
<Switch v-model:checked="checked" checked-children="开" un-checked-children="关" />
<Pagination v-model:current="current" :total="60" :page-size="10" />`;

export const docsMap: Record<string, ComponentDoc> = {
    about: {
        title: '关于',
        desc: 'Animal Island UI Vue 是一套基于 Vue 3、TypeScript 与 Vite 构建的界面组件库，适合需要温和质感与轻松氛围的内容页面与互动页面。',
        sections: [
            section(
                '适合的页面场景',
                '适合活动页、社区页、轻内容产品、用户成长页以及需要温和亲和感的后台前台混合场景。'
            ),
            section('本项目仓库', '这里可以查看当前组件库的项目地址、版本更新与文档演示。'),
            section('致谢', '本项目参考 guokaigdg/animal-island-ui 的风格设计，在此致谢。'),
        ],
    },
    'quick-start': {
        title: '快速使用',
        desc: '在 Vue 3 项目中安装后即可直接使用。',
        sections: [
            section('安装', '先安装 npm 包。', installCode),
            section('全量注册', '如果你希望在整个项目中直接使用组件，可以在应用入口统一注册。', quickStartCode),
            section('按需引入', '如果你更习惯按页面组合组件，也可以直接按需引入。', onDemandCode),
            section('基础组件', '下面这组示例覆盖输入、开关和分页，是多数页面最常见的起点。', basicUsageCode),
        ],
    },
    avatar: {
        title: 'Avatar 头像',
        desc: '适合用户头像、岛民卡片、成员列表和评论区入口。',
        sections: [
            section('基础用法', '支持图片头像、不同尺寸，以及加载失败时自动回退到首字母。', `<Avatar src="avatarUrl" alt="狸克" />
<Avatar size="small" alt="豆狸" />
<Avatar size="large" alt="西施惠" />`, [
                row('src', '头像地址', 'string'),
                row('alt', '辅助文本，同时用于回退首字母', 'string', "''"),
                row('size', '头像尺寸', `'small' | 'default' | 'large'`, `'default'`),
            ]),
        ],
    },
    badge: {
        title: 'Badge 徽标',
        desc: '适合消息数量、未读提醒和轻量角标。',
        sections: [
            section('基础用法', '徽标会附着在内容角落，适合头像、按钮或入口卡片。', `<Badge :count="5">
  <Avatar alt="狸克" />
</Badge>`, [row('count', '徽标内容', 'string | number', "''")]),
        ],
    },
    button: {
        title: 'Button 按钮',
        desc: '适合主操作、次操作、轻文本入口和跳转链接。',
        sections: [
            section('按钮样式', '覆盖主按钮、默认按钮、虚线按钮、文本按钮和链接按钮。', `<Button type="primary">保存布置</Button>
<Button>稍后再看</Button>
<Button type="dashed">新增岛民</Button>
<Button type="text">查看详情</Button>
<Button type="link">前往活动页</Button>`, [
                row('type', '按钮类型', `'primary' | 'default' | 'dashed' | 'text' | 'link'`, `'default'`),
                row('size', '按钮尺寸', `'small' | 'middle' | 'large'`, `'middle'`),
                row('danger', '危险操作样式', 'boolean', 'false'),
                row('ghost', '幽灵态外观', 'boolean', 'false'),
                row('block', '块级宽度按钮', 'boolean', 'false'),
                row('loading', '加载状态', 'boolean', 'false'),
                row('disabled', '禁用状态', 'boolean', 'false'),
                row('htmlType', '原生按钮类型', `'submit' | 'reset' | 'button'`, `'button'`),
            ]),
        ],
    },
    checkbox: {
        title: 'Checkbox 复选框',
        desc: '适合勾选订阅、批量操作和配置项确认。',
        sections: [
            section('基础用法', '支持 v-model、受控写法和禁用状态。', `<Checkbox v-model="checked">接收岛屿广播</Checkbox>
<Checkbox disabled>暂不可选</Checkbox>`, [
                row('modelValue', '勾选状态（受控）', 'boolean'),
                row('checked', '受控兼容值', 'boolean'),
                row('defaultChecked', '默认勾选（非受控）', 'boolean', 'false'),
                row('disabled', '禁用状态', 'boolean', 'false'),
            ]),
        ],
    },
    descriptions: {
        title: 'Descriptions 描述列表',
        desc: '适合资料详情、活动信息和条目摘要。',
        sections: [
            section('基础用法', '按标签和值成组展示，适合摘要信息区。', `<Descriptions :items="[
  { label: '岛屿名称', value: '晴空岛' },
  { label: '开放时间', value: '20:00 - 22:00' }
]" />`, [row('items', '描述项数组', 'DescriptionsItem[]')]),
        ],
    },
    empty: {
        title: 'Empty 空状态',
        desc: '适合列表为空、搜索无结果或内容待生成时的占位。',
        sections: [
            section('基础用法', '支持标题、描述和额外操作区。', `<Empty title="还没有新的订单" description="可以先去看看今天的活动安排。">
  <Button type="primary">去看看</Button>
</Empty>`, [
                row('title', '空状态标题', 'string', `'空空如也'`),
                row('description', '补充说明', 'string', `'这里暂时还没有内容'`),
            ]),
        ],
    },
    drawer: {
        title: 'Drawer 抽屉',
        desc: '适合承载设置、补充详情、侧边表单和移动端底部面板。',
        sections: [
            section('侧边抽屉', '常用于承载筛选、配置和表单。', `<Drawer v-model:open="drawerOpen" title="岛屿筛选" :width="420">
  <p>支持自定义宽度。</p>
</Drawer>`, [
                row('open', '是否打开', 'boolean'),
                row('title', '标题内容', 'string'),
                row('placement', '打开方向', `'right' | 'bottom'`, `'right'`),
                row('maskClosable', '点击遮罩关闭', 'boolean', 'true'),
                row('closable', '是否显示关闭按钮', 'boolean', 'true'),
                row('width', '右侧抽屉宽度', 'number | string'),
                row('height', '底部抽屉高度', 'number | string'),
            ]),
        ],
    },
    form: {
        title: 'Form 表单',
        desc: '适合作为表单容器，统一垂直或行内布局。',
        sections: [
            section('基础用法', '与 FormItem 组合使用可以更稳定地组织输入项。', `<Form layout="vertical">
  <FormItem label="活动名称">
    <Input />
  </FormItem>
</Form>`, [row('layout', '布局方式', `'vertical' | 'inline'`, `'vertical'`)]),
        ],
    },
    'form-item': {
        title: 'FormItem 表单项',
        desc: '适合承载字段标题、帮助信息和状态提示。',
        sections: [
            section('基础用法', '支持标签、补充说明和警示状态。', `<FormItem label="活动地点" extra="请填写完整位置">
  <Input />
</FormItem>`, [
                row('label', '字段标题', 'string'),
                row('extra', '补充信息', 'string'),
                row('status', '状态样式', `'error' | 'warning'`),
            ]),
        ],
    },
    input: {
        title: 'Input 输入框',
        desc: '适合搜索、名称输入、短文本配置和轻量筛选。',
        sections: [
            section('基础用法', '支持前后缀、清空、不同尺寸和状态提示。', `<Input v-model="keyword" allow-clear placeholder="搜索岛屿活动">
  <template #prefix>🔍</template>
</Input>`, [
                row('modelValue', '当前值（受控）', 'string'),
                row('value', '受控兼容值', 'string'),
                row('defaultValue', '默认初始值', 'string'),
                row('size', '尺寸', `'small' | 'middle' | 'large'`, `'middle'`),
                row('prefix', '前缀内容', 'string'),
                row('suffix', '后缀内容', 'string'),
                row('allowClear', '显示清空按钮', 'boolean', 'false'),
                row('status', '状态样式', `'error' | 'warning'`),
                row('disabled', '禁用状态', 'boolean', 'false'),
            ]),
        ],
    },
    list: {
        title: 'List 列表',
        desc: '适合事项清单、任务列表和说明型信息块。',
        sections: [
            section('基础用法', '支持简单字符串列表和带描述的列表项。', `<List :items="[
  { title: '整理果园', description: '清点樱桃和苹果库存' },
  { title: '准备露营区', description: '今晚开放给访客' }
]" />`, [row('items', '列表项数据', 'Array<string | ListItem>')]),
        ],
    },
    message: {
        title: 'Message 全局提示',
        desc: '适合页面顶部的小型提醒或任务反馈。',
        sections: [
            section('基础用法', '支持默认、成功与警告三种状态。', `<Message content="今天的岛屿开放时间已更新" />
<Message type="success" content="烟火大会布置已保存" />
<Message type="warning" content="还有 2 项设置未完成" />`, [
                row('content', '提示内容', 'string'),
                row('type', '提示类型', `'default' | 'success' | 'warning'`, `'default'`),
            ]),
        ],
    },
    notification: {
        title: 'Notification 通知卡片',
        desc: '适合相对完整的消息卡片、结果提示和说明反馈。',
        sections: [
            section('基础用法', '相比 Message 更适合放标题和补充说明。', `<Notification
  title="岛屿来客申请通过"
  description="今晚 20:00 后可以开始接待访客。"
/>`, [
                row('title', '通知标题', 'string'),
                row('description', '补充说明', 'string', "''"),
                row('type', '通知类型', `'default' | 'success' | 'warning'`, `'default'`),
            ]),
        ],
    },
    pagination: {
        title: 'Pagination 分页',
        desc: '适合内容列表、订单列表和较长的记录分页。',
        sections: [
            section('基础用法', '支持上一页、下一页、可见页码数控制和受控写法。', `<Pagination
  v-model:current="currentPage"
  :total="180"
  :page-size="10"
  :show-prev-next="true"
  :max-visible="7"
/>`, [
                row('current', '当前页', 'number'),
                row('defaultCurrent', '默认页码', 'number', '1'),
                row('total', '数据总数', 'number'),
                row('pageSize', '每页条数', 'number', '10'),
                row('showPrevNext', '显示上一页和下一页', 'boolean', 'true'),
                row('maxVisible', '最多展示的页码按钮数', 'number', '7'),
            ]),
        ],
    },
    popover: {
        title: 'Popover 气泡卡片',
        desc: '适合为按钮、头像或说明词提供补充信息。',
        sections: [
            section('基础用法', '点击触发，适合短说明或小型补充内容。', `<Popover content="今晚适合安排烟火大会彩排">
  <Button>查看提醒</Button>
</Popover>`, [
                row('content', '气泡内容', 'string'),
                row('defaultOpen', '默认打开', 'boolean', 'false'),
            ]),
        ],
    },
    progress: {
        title: 'Progress 进度条',
        desc: '适合上传、目标完成度和流程推进状态。',
        sections: [
            section('基础用法', '支持状态变化和入场进度动画。', `<Progress :percent="68" animated />
<Progress :percent="92" status="success" />
<Progress :percent="35" status="warning" />`, [
                row('percent', '当前进度百分比', 'number'),
                row('status', '状态样式', `'default' | 'success' | 'warning'`, `'default'`),
                row('animated', '是否启用从 0 到目标值的过渡动画', 'boolean', 'false'),
            ]),
        ],
    },
    radio: {
        title: 'Radio 单选框',
        desc: '适合单项选择、模式切换和互斥配置。',
        sections: [
            section('基础用法', '通过共享 modelValue 实现单选切换。', `<Radio v-model="radioValue" value="fish">鱼类</Radio>
<Radio v-model="radioValue" value="bug">昆虫</Radio>`, [
                row('modelValue', '当前选中值', 'string | number | boolean'),
                row('value', '当前项的值', 'string | number | boolean'),
                row('disabled', '禁用状态', 'boolean', 'false'),
            ]),
        ],
    },
    rate: {
        title: 'Rate 评分',
        desc: '适合评价体验、打分记录和轻量满意度反馈。',
        sections: [
            section('基础用法', '支持半星评分、键盘选择和鼠标预览。', `<Rate v-model="score" allow-half />
<Rate :default-value="4" />
<Rate :default-value="2.5" allow-half disabled />`, [
                row('modelValue', '当前评分（受控）', 'number'),
                row('value', '受控兼容值', 'number'),
                row('defaultValue', '默认初始分值', 'number', '0'),
                row('count', '评分项数量', 'number', '5'),
                row('allowHalf', '允许半分选择', 'boolean', 'false'),
                row('disabled', '禁用状态', 'boolean', 'false'),
            ]),
        ],
    },
    select: {
        title: 'Select 选择器',
        desc: '适合单项活动选择、状态选择和筛选场景。',
        sections: [
            section('基础用法', '支持占位、禁用选项、键盘导航和受控写法。', `<Select
  v-model="activity"
  placeholder="请选择活动"
  :options="[
    { label: '钓鱼大赛', value: 'fishing' },
    { label: '捉虫大会', value: 'bug' }
  ]"
/>`, [
                row('modelValue', '当前值（受控）', 'string | number'),
                row('value', '受控兼容值', 'string | number'),
                row('defaultValue', '默认初始值', 'string | number'),
                row('options', '选项数组', 'SelectOption[]'),
                row('placeholder', '占位文案', 'string', `'请选择'`),
                row('disabled', '禁用状态', 'boolean', 'false'),
            ]),
        ],
    },
    slider: {
        title: 'Slider 滑块',
        desc: '适合数值调节、预算分配和阈值设置。',
        sections: [
            section('基础用法', '支持步长、最小值和最大值设置。', `<Slider v-model="sliderValue" :min="0" :max="100" :step="5" />`, [
                row('modelValue', '当前数值（受控）', 'number'),
                row('value', '受控兼容值', 'number'),
                row('defaultValue', '默认初始值', 'number', '0'),
                row('min', '最小值', 'number', '0'),
                row('max', '最大值', 'number', '100'),
                row('step', '步长', 'number', '1'),
                row('disabled', '禁用状态', 'boolean', 'false'),
            ]),
        ],
    },
    switch: {
        title: 'Switch 开关',
        desc: '适合是否提醒、是否展示、是否开启等布尔状态切换。',
        sections: [
            section('基础用法', '支持 v-model:checked、不同尺寸、加载态和自定义两端文案。', `<Switch
  v-model:checked="checked"
  checked-children="开启"
  un-checked-children="关闭"
/>`, [
                row('modelValue', '当前开关状态（受控）', 'boolean'),
                row('checked', '受控兼容值', 'boolean'),
                row('defaultChecked', '默认是否开启（非受控）', 'boolean', 'false'),
                row('size', '尺寸', `'small' | 'default'`, `'default'`),
                row('disabled', '禁用状态', 'boolean', 'false'),
                row('loading', '加载状态', 'boolean', 'false'),
                row('checkedChildren', '开启时的文案', 'string'),
                row('unCheckedChildren', '关闭时的文案', 'string'),
            ]),
        ],
    },
    tabs: {
        title: 'Tabs 标签页',
        desc: '适合内容分栏、频道切换和多组信息展示。',
        sections: [
            section('基础用法', '支持默认项、受控切换和禁用项。', `<Tabs
  v-model:active-key="currentTab"
  :items="[
    { key: 'goods', label: '好物' },
    { key: 'events', label: '活动' }
  ]"
/>`, [
                row('activeKey', '当前激活项', 'string'),
                row('defaultActiveKey', '默认激活项', 'string'),
                row('items', '标签项数组', 'TabsItem[]'),
            ]),
        ],
    },
    tag: {
        title: 'Tag 标签',
        desc: '适合状态标签、活动标识和轻量分类。',
        sections: [
            section('基础用法', '提供几组低饱和配色，方便在列表和卡片中快速标记。', `<Tag>默认</Tag>
<Tag color="mint">岛民活动</Tag>
<Tag color="yellow">提醒</Tag>
<Tag color="pink">限定</Tag>
<Tag color="blue">上新</Tag>`, [row('color', '标签颜色', `'default' | 'mint' | 'yellow' | 'pink' | 'blue'`, `'default'`)]),
        ],
    },
    textarea: {
        title: 'Textarea 文本域',
        desc: '适合公告、备注、详情说明和较长文本输入。',
        sections: [
            section('基础用法', '支持清空、状态提示和自定义拖拽高度。', `<Textarea
  v-model="textareaValue"
  allow-clear
  :rows="5"
  placeholder="输入活动说明"
/>`, [
                row('modelValue', '当前内容（受控）', 'string'),
                row('value', '受控兼容值', 'string'),
                row('defaultValue', '默认初始内容', 'string'),
                row('allowClear', '显示清空按钮', 'boolean', 'false'),
                row('disabled', '禁用状态', 'boolean', 'false'),
                row('rows', '初始行数', 'number', '4'),
                row('status', '状态样式', `'error' | 'warning'`),
            ]),
        ],
    },
    tooltip: {
        title: 'Tooltip 文字提示',
        desc: '适合解释字段、按钮补充说明和轻量提示。',
        sections: [
            section('基础用法', '悬停或聚焦时展示短提示。', `<Tooltip content="今晚 20:00 后开放">
  <Button type="text">开放时间</Button>
</Tooltip>`, [row('content', '提示内容', 'string')]),
        ],
    },
    card: {
        title: 'Card 卡片',
        desc: '适合信息块、入口卡片、摘要区和标题装饰块。',
        sections: [
            section('基础用法', '支持默认卡片、标题卡片以及多种颜色配置。', `<Card>基础卡片</Card>
<Card type="title">标题卡片</Card>
<Card color="app-blue">蓝色入口卡片</Card>`, [
                row('type', '卡片类型', `'default' | 'title'`, `'default'`),
                row('color', '色板类型', 'CardColor', `'default'`),
            ]),
        ],
    },
    collapse: {
        title: 'Collapse 折叠面板',
        desc: '适合常见问题、帮助说明和可展开的补充信息。',
        sections: [
            section('基础用法', '适合 FAQ 风格的内容折叠，支持默认展开与禁用状态。', `<Collapse
  question="什么时候可以开放岛屿？"
  answer="完成基础布置并确认时间后即可开放。"
/>`, [
                row('question', '问题标题', 'string'),
                row('answer', '答案内容', 'string'),
                row('defaultExpanded', '默认展开', 'boolean', 'false'),
                row('disabled', '禁用状态', 'boolean', 'false'),
            ]),
        ],
    },
    cursor: {
        title: 'Cursor 光标',
        desc: '适合为局部区域启用岛屿风格指针，不影响页面其他区域。',
        sections: [
            section('基础用法', '默认使用内置指针资源，也支持传入自定义地址与热点位置。', `<Cursor :src="cursorIconUrl" :hotspot-x="4" :hotspot-y="0">
  <Card>这个区域会使用自定义指针</Card>
</Cursor>`, [
                row('src', '自定义指针资源地址', 'string', '当前内置指针'),
                row('hotspotX', '指针热点横坐标', 'number', '4'),
                row('hotspotY', '指针热点纵坐标', 'number', '0'),
            ]),
        ],
    },
    modal: {
        title: 'Modal 弹窗',
        desc: '适合确认操作、补充说明和短流程提示。',
        sections: [
            section('基础用法', '保持有机轮廓与清晰的标题层级，支持底部操作区自定义。', `<Modal v-model:open="modalOpen" title="是否发布公告" :closable="false">
  <p>发布后所有岛民都会收到提醒。</p>
</Modal>`, [
                row('open', '是否打开', 'boolean'),
                row('title', '标题内容', 'string'),
                row('width', '弹窗宽度', 'number | string', '520'),
                row('maskClosable', '点击遮罩关闭', 'boolean', 'true'),
                row('closable', '是否显示关闭按钮', 'boolean', 'false'),
                row('footer', '传入 null 时隐藏底部操作区', 'null'),
            ]),
        ],
    },
    'divider-comp': {
        title: 'Divider 分割线',
        desc: '适合隔开页面段落、表单区块和卡片内容。',
        sections: [
        section('基础用法', '简洁的装饰分割线，适合长内容页面的区块间隔。', `<Divider type="line-yellow" />`, [
            row('type', '分割线类型', 'line-brown | line-teal | line-yellow | wave-yellow', 'line-brown'),
        ]),
        ],
    },
    loading: {
        title: 'Loading 加载动画',
        desc: '提供流畅的岛屿动效加载，用于页面/模块等待状态提示。',
        sections: [
            section('基础用法', '默认全屏展示加载动画，通过 active 控制显示与隐藏。', `<Loading :active="true" />`, [
            row('active', '控制加载显示/隐藏', 'boolean', 'true'),
            row('className', '自定义样式类名', 'string'),
            row('style', '自定义行内样式', 'CSSProperties'),
            ]),
        ],
    },
    typewriter: {
        title: 'Typewriter 打字机',
        desc: '打字机组件 — 按字符逐个显示文本，支持多行与 ReactNode 富内容，不改变原有样式',
        sections: [
            section('基础用法', '支持普通文本、HTML、颜色样式、多行结构，可控制打字速度、重新播放与完成回调。', `<Typewriter>你好，欢迎来到动物岛！</Typewriter>`, [
                row('speed', '打字速度（毫秒）', 'number', '90'),
                row('trigger', '重新播放触发器，值变化即重播', 'unknown', '-'),
                row('autoPlay', '是否自动开始播放', 'boolean', 'true'),
                row('onDone', '打字完成回调', '() => void', '-'),
            ]),
        ],
    },
};
