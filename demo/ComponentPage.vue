<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    Avatar,
    Badge,
    Button,
    Card,
    Checkbox,
    Collapse,
    Cursor,
    Descriptions,
    Divider,
    Drawer,
    Empty,
    Form,
    FormItem,
    Input,
    List,
    Message,
    Modal,
    Notification,
    Pagination,
    Popover,
    Progress,
    Radio,
    Rate,
    Select,
    Slider,
    Switch,
    Tabs,
    Tag,
    Textarea,
    Tooltip,
    Loading,
    Typewriter,
} from '../src';
import ApiTable from './ApiTable.vue';
import CodeBlock from './CodeBlock.vue';
import { docsMap } from './componentDocs';

const props = defineProps<{
    activeKey: string;
}>();

const cursorIconUrl = new URL(
    '../src/components/Cursor/cursor-icon.png',
    import.meta.url
).href;
const avatarUrl = new URL('./img/user-avatar-acnh.svg', import.meta.url).href;
const nookPhoneUrl = new URL('./img/nook-phone/nook2.svg', import.meta.url)
    .href;

const keyword = ref('岛屿公告栏');
const checked = ref(true);
const checkboxChecked = ref(true);
const radioValue = ref<'fish' | 'bug'>('fish');
const activity = ref('fishing');
const currentPage = ref(3);
const currentTab = ref('goods');
const sliderValue = ref(42);
const score = ref(3.5);
const drawerOpen = ref(false);
const bottomDrawerOpen = ref(false);
const modalOpen = ref(false);
const titleModalOpen = ref(false);
const customFooterOpen = ref(false);
const footerlessModalOpen = ref(false);
const textareaValue = ref('今晚 20:00 在广场集合，准备烟火大会布置。');
const isLoadingActive = ref(true)
const replayKey = ref(0)

const currentDoc = computed(() => docsMap[props.activeKey] ?? docsMap.about);
</script>

<template>
    <div class="page-shell" data-page-shell="docs">
        <Card type="title" class="page-title-card" data-title-card="page">
            <span class="page-title">{{ currentDoc.title }}</span>
        </Card>
        <p class="page-desc">{{ currentDoc.desc }}</p>

        <section
            v-for="section in currentDoc.sections"
            :key="`${activeKey}-${section.title}`"
            class="doc-section"
            data-section-style="light"
        >
            <div class="section-heading">
                <div class="section-title-row">
                    <h2 class="section-title">{{ section.title }}</h2>
                    <span v-if="activeKey === 'button'" class="section-badge">
                        5 types
                    </span>
                </div>
                <p v-if="section.desc" class="section-desc">
                    {{ section.desc }}
                </p>
            </div>

            <div
                :class="{
                    'demo-panel':
                        activeKey === 'quick-start' &&
                        section.title === '基础组件',
                }"
            >
                <template v-if="activeKey === 'about'">
                    <div
                        v-if="section.title === '本项目仓库'"
                        class="section-links"
                    >
                        <a
                            href="https://github.com/yanstu/animal-island-ui-vue"
                            target="_blank"
                            rel="noreferrer"
                            class="section-link"
                        >
                            GitHub ·
                            https://github.com/yanstu/animal-island-ui-vue
                        </a>
                    </div>
                    <div
                        v-else-if="section.title === '致谢'"
                        class="section-links"
                    >
                        <a
                            href="https://github.com/guokaigdg/animal-island-ui"
                            target="_blank"
                            rel="noreferrer"
                            class="section-link"
                        >
                            GitHub ·
                            https://github.com/guokaigdg/animal-island-ui
                        </a>
                    </div>
                </template>

                <template v-else-if="activeKey === 'quick-start'">
                    <div v-if="section.title === '基础组件'" class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">搜索与输入</div>
                            <div class="demo-row">
                                <Input
                                    v-model="keyword"
                                    allow-clear
                                    placeholder="搜索岛屿活动"
                                >
                                    <template #prefix>🔍</template>
                                </Input>
                                <Input placeholder="输入开放说明" />
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">布尔状态</div>
                            <div class="demo-row">
                                <Switch
                                    v-model:checked="checked"
                                    checked-children="开启"
                                    un-checked-children="关闭"
                                />
                                <Tag color="mint">已接入页面状态切换</Tag>
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">内容分组与翻页</div>
                            <div class="demo-row">
                                <Tabs
                                    v-model:active-key="currentTab"
                                    :items="[
                                        { key: 'goods', label: '好物' },
                                        { key: 'events', label: '活动' },
                                        { key: 'notice', label: '公告' },
                                    ]"
                                />
                            </div>
                            <div class="demo-row">
                                <Pagination
                                    v-model:current="currentPage"
                                    :total="60"
                                    :page-size="10"
                                />
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'avatar'">
                    <div class="demo-row">
                        <Avatar :src="avatarUrl" alt="狸克" />
                        <Avatar size="small" alt="豆狸" />
                        <Avatar size="large" alt="西施惠" />
                        <Avatar alt="傅达" />
                    </div>
                </template>

                <template v-else-if="activeKey === 'badge'">
                    <div class="demo-row">
                        <Badge :count="5">
                            <Avatar :src="avatarUrl" alt="狸克" />
                        </Badge>
                        <Badge count="99+">
                            <Button type="primary">信箱</Button>
                        </Badge>
                    </div>
                </template>

                <template v-else-if="activeKey === 'button'">
                    <div class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">type 按钮类型</div>
                            <div class="demo-row">
                                <Button type="primary">保存布置</Button>
                                <Button>稍后再看</Button>
                                <Button type="dashed">新增岛民</Button>
                                <Button type="text">查看详情</Button>
                                <Button type="link">前往活动页</Button>
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">
                                danger / ghost / loading / disabled 状态
                            </div>
                            <div class="demo-row">
                                <Button danger  >删除</Button>
                                <Button type="primary" ghost>透明强调</Button>
                                <Button type="primary" loading>保存中</Button>
                                <Button disabled>暂不可用</Button>
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">size 尺寸</div>
                            <div class="demo-row">
                                <Button type="primary" size="small"
                                    >小按钮</Button
                                >
                                <Button type="primary">中按钮</Button>
                                <Button type="primary" size="large"
                                    >大按钮</Button
                                >
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">icon 图标按钮</div>
                            <div class="demo-row">
                                <Button type="primary" icon="🔍"
                                    >搜索活动</Button
                                >
                                <Button icon="⭐">收藏方案</Button>
                                <Button type="dashed" icon="＋"
                                    >新增分组</Button
                                >
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">block 块级按钮</div>
                            <Button type="primary" block
                                >发布今日开放公告</Button
                            >
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">danger 组合</div>
                            <div class="demo-row">
                                <Button type="primary" danger>
                                    Primary Danger
                                </Button>
                                <Button danger>Default Danger</Button>
                                <Button type="dashed" danger>
                                    Dashed Danger
                                </Button>
                                <Button type="text" danger>
                                    Text Danger
                                </Button>
                                <Button type="link" danger>
                                    Link Danger
                                </Button>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'checkbox'">
                    <div class="demo-row">
                        <Checkbox v-model="checkboxChecked"
                            >接收岛屿广播</Checkbox
                        >
                        <Checkbox>接收活动更新</Checkbox>
                        <Checkbox disabled>暂不可选</Checkbox>
                    </div>
                </template>

                <template v-else-if="activeKey === 'descriptions'">
                    <Descriptions
                        :items="[
                            { label: '岛屿名', value: '晴空岛' },
                            { label: '开放时间', value: '20:00 - 22:00' },
                            { label: '邀请码', value: 'D8G5K' },
                        ]"
                    />
                </template>

                <template v-else-if="activeKey === 'empty'">
                    <Empty
                        title="还没有新的订单"
                        description="可以先去看看今天的活动安排。"
                    >
                        <Button type="primary">去看看</Button>
                    </Empty>
                </template>

                <template v-else-if="activeKey === 'drawer'">
                    <div class="demo-row">
                        <Button type="primary" @click="drawerOpen = true"
                            >打开右侧抽屉</Button
                        >
                        <Button @click="bottomDrawerOpen = true"
                            >打开底部抽屉</Button
                        >
                    </div>
                    <Drawer
                        v-model:open="drawerOpen"
                        title="岛屿筛选"
                        :width="420"
                    >
                        <List
                            :items="[
                                {
                                    title: '按开放时间筛选',
                                    description: '优先展示今晚开放的岛屿',
                                },
                                {
                                    title: '按活动类型筛选',
                                    description: '钓鱼、捉虫、烟火大会',
                                },
                            ]"
                        />
                    </Drawer>
                    <Drawer
                        v-model:open="bottomDrawerOpen"
                        title="访客说明"
                        placement="bottom"
                        :height="300"
                    >
                        <p class="demo-copy">
                            到达岛屿后请先查看公告板，再前往活动区域。
                        </p>
                    </Drawer>
                </template>

                <template v-else-if="activeKey === 'form'">
                    <Form layout="vertical" class="form-demo">
                        <FormItem label="活动名称">
                            <Input placeholder="输入活动名称" />
                        </FormItem>
                        <FormItem
                            label="开放说明"
                            extra="控制在 60 字以内更易阅读"
                        >
                            <Textarea placeholder="输入开放说明" />
                        </FormItem>
                    </Form>
                </template>

                <template v-else-if="activeKey === 'form-item'">
                    <Form layout="vertical" class="form-demo">
                        <FormItem label="活动地点" extra="请填写完整位置">
                            <Input placeholder="例如：广场右侧花园" />
                        </FormItem>
                        <FormItem
                            label="人数限制"
                            extra="请先确认今晚名额"
                            status="warning"
                        >
                            <Input placeholder="例如：20 人" />
                        </FormItem>
                    </Form>
                </template>

                <template v-else-if="activeKey === 'input'">
                    <div class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">搜索与清空</div>
                            <div class="demo-row">
                                <Input
                                    v-model="keyword"
                                    allow-clear
                                    placeholder="搜索岛屿活动"
                                >
                                    <template #prefix>🔍</template>
                                </Input>
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">尺寸</div>
                            <div class="demo-row">
                                <Input size="small" placeholder="小尺寸输入" />
                                <Input placeholder="默认尺寸输入" />
                                <Input size="large" placeholder="大尺寸输入" />
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">状态提示</div>
                            <div class="demo-row">
                                <Input
                                    status="error"
                                    placeholder="请输入正确的邀请码"
                                />
                                <Input
                                    status="warning"
                                    placeholder="建议补充开放时间"
                                />
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'list'">
                    <List
                        :items="[
                            {
                                title: '整理果园',
                                description: '清点樱桃和苹果库存',
                            },
                            {
                                title: '准备露营区',
                                description: '今晚开放给访客',
                            },
                            {
                                title: '检查公告板',
                                description: '确认活动时间没有冲突',
                            },
                        ]"
                    />
                </template>

                <template v-else-if="activeKey === 'message'">
                    <div class="demo-stack">
                        <Message content="今天的岛屿开放时间已更新" />
                        <Message type="success" content="烟火大会布置已保存" />
                        <Message type="warning" content="还有 2 项设置未完成" />
                    </div>
                </template>

                <template v-else-if="activeKey === 'notification'">
                    <div class="demo-stack">
                        <Notification
                            title="岛屿来客申请通过"
                            description="今晚 20:00 后可以开始接待访客。"
                        />
                        <Notification
                            type="success"
                            title="上架完成"
                            description="新增家具已经同步到今日精选页。"
                        />
                    </div>
                </template>

                <template v-else-if="activeKey === 'pagination'">
                    <div class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">标准分页</div>
                            <div class="demo-row">
                                <Pagination
                                    v-model:current="currentPage"
                                    :total="180"
                                    :page-size="10"
                                    :show-prev-next="true"
                                    :max-visible="7"
                                />
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">精简分页</div>
                            <div class="demo-row">
                                <Pagination
                                    :default-current="1"
                                    :total="40"
                                    :page-size="10"
                                    :show-prev-next="false"
                                    :max-visible="5"
                                />
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">当前页状态</div>
                            <div class="demo-row">
                                <Pagination
                                    v-model:current="currentPage"
                                    :total="96"
                                    :page-size="12"
                                    :show-prev-next="true"
                                    :max-visible="5"
                                />
                                <span class="demo-copy">
                                    当前第 {{ currentPage }} 页，共 8 页
                                </span>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'popover'">
                    <div class="demo-row">
                        <Popover content="今晚适合安排烟火大会彩排">
                            <Button>查看提醒</Button>
                        </Popover>
                        <Popover content="访客已开启排队模式">
                            <Tag color="yellow">当前开放中</Tag>
                        </Popover>
                    </div>
                </template>

                <template v-else-if="activeKey === 'progress'">
                    <div class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">入场动画</div>
                            <Progress :percent="68" animated />
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">完成状态</div>
                            <Progress :percent="92" status="success" />
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">提醒状态</div>
                            <Progress :percent="35" status="warning" />
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'radio'">
                    <div
                        class="demo-row radio-row"
                        role="radiogroup"
                        aria-label="活动类型"
                    >
                        <Radio v-model="radioValue" value="fish">鱼类</Radio>
                        <Radio v-model="radioValue" value="bug">昆虫</Radio>
                        <Radio :model-value="radioValue" value="flower" disabled
                            >花艺</Radio
                        >
                    </div>
                </template>

                <template v-else-if="activeKey === 'rate'">
                    <div class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">半星评分</div>
                            <div class="demo-row">
                                <Rate v-model="score" allow-half />
                                <span class="demo-copy"
                                    >当前评分：{{ score }}</span
                                >
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">整星评分</div>
                            <Rate :default-value="4" />
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">只读展示</div>
                            <Rate :default-value="2.5" allow-half disabled />
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'select'">
                    <div class="demo-stack">
                        <Select
                            v-model="activity"
                            placeholder="请选择活动"
                            :options="[
                                { label: '钓鱼大赛', value: 'fishing' },
                                { label: '捉虫大会', value: 'bug' },
                                { label: '烟火大会', value: 'fireworks' },
                            ]"
                        />
                        <Select
                            :options="[
                                { label: '今晚开放', value: 'open' },
                                { label: '暂不开放', value: 'closed' },
                                {
                                    label: '已结束',
                                    value: 'ended',
                                    disabled: true,
                                },
                            ]"
                        />
                    </div>
                </template>

                <template v-else-if="activeKey === 'slider'">
                    <div class="demo-stack">
                        <Slider
                            v-model="sliderValue"
                            :min="0"
                            :max="100"
                            :step="5"
                        />
                        <div class="demo-copy">
                            当前预算占比：{{ sliderValue }}%
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'switch'">
                    <div class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">基础用法</div>
                            <div class="demo-row">
                                <Switch
                                    v-model:checked="checked"
                                    checked-children="开启"
                                    un-checked-children="关闭"
                                />
                                <span class="demo-copy">
                                    {{
                                        checked
                                            ? '当前已开启岛屿广播'
                                            : '当前已关闭岛屿广播'
                                    }}
                                </span>
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">业务状态切换</div>
                            <div class="demo-row">
                                <Switch
                                    default-checked
                                    checked-children="展示"
                                    un-checked-children="隐藏"
                                />
                                <Tag color="yellow">公告卡片展示中</Tag>
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">尺寸与加载态</div>
                            <div class="demo-row">
                                <Switch size="small" default-checked />
                                <Switch loading default-checked />
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'tabs'">
                    <div class="demo-stack">
                        <Tabs
                            v-model:active-key="currentTab"
                            :items="[
                                { key: 'goods', label: '好物' },
                                { key: 'events', label: '活动' },
                                { key: 'notices', label: '公告' },
                            ]"
                        />
                        <div class="demo-copy">
                            当前内容分组：{{ currentTab }}
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'tag'">
                    <div class="demo-row">
                        <Tag>默认</Tag>
                        <Tag color="mint">岛民活动</Tag>
                        <Tag color="yellow">提醒</Tag>
                        <Tag color="pink">限定</Tag>
                        <Tag color="blue">上新</Tag>
                    </div>
                </template>

                <template v-else-if="activeKey === 'textarea'">
                    <div class="demo-stack">
                        <Textarea
                            v-model="textareaValue"
                            allow-clear
                            :rows="5"
                            placeholder="输入活动说明"
                        />
                        <Textarea
                            status="warning"
                            :default-value="'活动场地较大，建议提前 10 分钟到达。'"
                        />
                    </div>
                </template>

                <template v-else-if="activeKey === 'tooltip'">
                    <div class="demo-row">
                        <Tooltip content="今晚 20:00 后开放">
                            <Button type="text">开放时间</Button>
                        </Tooltip>
                        <Tooltip content="会提前 10 分钟提醒访客">
                            <Tag color="mint">自动提醒</Tag>
                        </Tooltip>
                    </div>
                </template>

                <template v-else-if="activeKey === 'card'">
                    <div class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">type="default"</div>
                            <div class="demo-row">
                                <Card class="card-showcase card-showcase-wide">
                                    <div class="card-showcase-title">
                                        基础卡片
                                    </div>
                                    <div class="card-showcase-copy">
                                        适合承载摘要、提示和较长说明内容。
                                    </div>
                                </Card>
                                <Card class="card-showcase">
                                    <div class="card-showcase-copy">
                                        在页面中可用于轻量信息块与内容入口。
                                    </div>
                                </Card>
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">type="title"</div>
                            <div class="demo-row">
                                <Card type="title">标题卡片</Card>
                                <Card type="title" class="card-showcase">
                                    <div class="card-showcase-title">
                                        欢迎来到无人岛
                                    </div>
                                    <div class="card-showcase-copy">
                                        适合用于页面分组标题、频道入口和段落提示。
                                    </div>
                                </Card>
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">color</div>
                            <div class="card-grid">
                                <Card color="app-pink">App Pink</Card>
                                <Card color="purple">Purple</Card>
                                <Card color="app-green">App Green</Card>
                                <Card color="app-yellow">App Yellow</Card>
                                <Card color="app-orange">App Orange</Card>
                                <Card color="warm-peach-pink">暖桃粉卡片</Card>
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">color + type="title"</div>
                            <div class="demo-row">
                                <Card
                                    type="title"
                                    color="app-blue"
                                    class="card-showcase card-showcase-tinted"
                                >
                                    <div class="card-showcase-title">
                                        蓝色标题卡片
                                    </div>
                                    <div class="card-showcase-copy">
                                        适合频道入口与重点提示。
                                    </div>
                                </Card>
                                <Card
                                    type="title"
                                    color="app-green"
                                    class="card-showcase card-showcase-tinted"
                                >
                                    <div class="card-showcase-title">
                                        标题信息卡
                                    </div>
                                    <div class="card-showcase-copy">
                                        适合做页面分组或强调提示块。
                                    </div>
                                </Card>
                                <Card
                                    type="title"
                                    color="purple"
                                    class="card-showcase card-showcase-tinted"
                                >
                                    <div class="card-showcase-title">
                                        紫色标题卡片
                                    </div>
                                    <div class="card-showcase-copy">
                                        用于较醒目的功能入口展示。
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'collapse'">
                    <div class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">基础用法</div>
                            <Collapse
                                question="什么时候可以开放岛屿？"
                                answer="完成基础布置并确认时间后即可开放。"
                            />
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">
                                defaultExpanded 默认展开
                            </div>
                            <Collapse
                                question="来客多的时候怎么安排？"
                                answer="可以先通过公告板提醒，再按活动区域分流。"
                                default-expanded
                            />
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">disabled 禁用状态</div>
                            <Collapse
                                question="暂不可修改的规则"
                                answer="当前开放期间不可调整。"
                                disabled
                            />
                        </div>
                    </div>
                </template>

                <template v-else-if="activeKey === 'cursor'">
                    <Cursor
                        :src="cursorIconUrl"
                        :hotspot-x="4"
                        :hotspot-y="0"
                        class="cursor-demo"
                    >
                        <Card class="cursor-card">
                            <img
                                :src="nookPhoneUrl"
                                alt=""
                                class="cursor-illustration"
                            />
                            <div class="cursor-name">指针体验区</div>
                            <div class="cursor-desc">
                                文档页已经使用同款指针，这里适合预览局部区域自定义资源的效果。
                            </div>
                        </Card>
                    </Cursor>
                </template>
                
                <template v-else-if="activeKey === 'modal'">
                    <div class="demo-stack">
                        <div class="demo-group">
                            <div class="demo-label">基础弹窗</div>
                            <div class="demo-row">
                                <Button type="primary" @click="modalOpen = true"
                                    >打开主弹窗</Button
                                >
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">带标题弹窗</div>
                            <div class="demo-row">
                                <Button @click="titleModalOpen = true"
                                    >打开带标题弹窗</Button
                                >
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">自定义操作区</div>
                            <div class="demo-row">
                                <Button
                                    type="dashed"
                                    @click="customFooterOpen = true"
                                    >打开自定义操作区</Button
                                >
                            </div>
                        </div>
                        <div class="demo-group">
                            <div class="demo-label">无底部操作</div>
                            <div class="demo-row">
                                <Button
                                    type="text"
                                    @click="footerlessModalOpen = true"
                                    >打开无底部操作</Button
                                >
                            </div>
                        </div>
                    </div>
                    <Modal
                        v-model:open="modalOpen"
                        title="是否发布公告"
                        :closable="false"
                    >
                        <p class="modal-copy">
                            发布后所有岛民都会收到提醒，请确认内容已经检查完毕。
                        </p>
                    </Modal>
                    <Modal v-model:open="titleModalOpen" title="博物馆捐赠">
                        <p class="modal-copy">
                            是否将这条鱼捐赠给博物馆？傅达会很高兴看到新的收藏。
                        </p>
                    </Modal>
                    <Modal v-model:open="customFooterOpen" title="确认搬家安排">
                        <p class="modal-copy">
                            确定要把这位岛民安排到新的房屋区域吗？保存后将同步更新地图。
                        </p>
                        <template #footer>
                            <Button @click="customFooterOpen = false"
                                >再看看</Button
                            >
                            <Button
                                type="primary"
                                danger
                                @click="customFooterOpen = false"
                                >确认搬家</Button
                            >
                        </template>
                    </Modal>
                    <Modal
                        v-model:open="footerlessModalOpen"
                        title="公告已保存"
                        :width="460"
                        :footer="null"
                    >
                        <p class="modal-copy">
                            现在可以继续补充封面、开放时间和访客说明。
                        </p>
                    </Modal>
                </template>

                <template v-else-if="activeKey === 'divider-comp'">
                <div class="demo-stack">
                    <div class="demo-copy">默认棕色线</div>
                    <Divider />

                    <div class="demo-copy">青色线</div>
                    <Divider type="line-teal" />

                    <div class="demo-copy">黄色线</div>
                    <Divider type="line-yellow" />

                    <div class="demo-copy">黄色波浪线</div>
                    <Divider type="wave-yellow" />
                </div>
                </template>

                <template v-else-if="activeKey === 'loading'">
                <div class="demo-stack">
                    <div class="demo-group">
                    <div class="demo-label">加载动画</div>
                    <Card style="position: relative; height: 550px; overflow: hidden; background: #1a1a1a; border-radius: 8px;">
                        <!-- 被遮罩的内容层：降低层级或让 Loading 的层级更高 -->
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; color: #fff; text-align: center; z-index: 1;">
                        <h3 style="margin-bottom: 8px; color: #fff;">这是被遮罩的内容区域</h3>
                        <p style="font-size: 13px; color: #aaa; margin: 4px 0;">当 Loading 的 active 为 true 时，黑色背景会完全挡住这里。</p>
                        <p style="font-size: 13px; color: #aaa; margin: 4px 0;">当 active 变为 false 时，会触发酷炫的圆形扩散退出动画。</p>
                        </div>
                        <Loading 
                        :active="isLoadingActive" 
                        :style="{ zIndex: 10 }" 
                        />
                    </Card>
                    <div style="margin-top: 12px; display: flex; gap: 8px;">
                        <Button type="primary" @click="isLoadingActive = !isLoadingActive">
                        {{ isLoadingActive ? '退出' : '加载' }}
                        </Button>
                    </div>
                    </div>
                </div>
                </template>

                <template v-else-if="activeKey === 'typewriter'">
                    <div class="demo-stack">
                        <div class="demo-group">
                        <div class="demo-label">默认打字机</div>
                        <Card>
                            <Typewriter :trigger="replayKey">
                                你好，欢迎来到动物岛！今天的天气真不错呢～
                            </Typewriter>
                        </Card>
                        </div>
                        <div class="demo-group">
                        <div class="demo-label">快速打字 (speed=40)</div>
                        <Card>
                            <Typewriter :speed="40" :trigger="replayKey">
                            <div>第一行：钓到石头了！</div>
                            <div>第二行：竟然连这种都能钓起来...</div>
                            <div style="color: #FD9303; font-weight: 700">第三行：继续加油吧！</div>
                        </Typewriter>
                        </Card>
                        </div>
                        <div class="demo-row">
                        <Button type="primary" @click="replayKey++">
                            重新播放动画
                        </Button>
                        </div>
                    </div>
                </template>
            </div>

            <CodeBlock v-if="section.code" :code="section.code" />
            <ApiTable
                v-if="section.api && section.api.length"
                :rows="section.api"
            />
        </section>
    </div>
</template>

<style scoped>
.page-shell {
    width: min(100%, 1200px);
    margin: 0 auto;
}

.page-title-card {
    width: fit-content;
    margin-bottom: 10px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
}

.page-desc {
    margin: 0 0 28px;
    color: #794f27;
    font-size: 13px;
    line-height: 1.75;
}

.doc-section {
    margin-bottom: 36px;
    padding: 24px;
    border: 1px solid #e8e2d6;
    border-radius: 12px;
    background: #fff;
    box-shadow: none;
}

.section-heading {
    margin-bottom: 16px;
}

.section-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.section-title {
    margin: 0 0 8px;
    color: #725d42;
    font-size: 15px;
    font-weight: 600;
}

.section-badge {
    padding: 2px 8px;
    border-radius: 10px;
    background: #f0e8d8;
    color: #a08060;
    font-size: 10px;
    font-weight: 500;
}

.section-desc {
    margin: 0;
    color: #8a7b66;
    font-size: 13px;
    line-height: 1.7;
}

.demo-panel {
    padding: 20px;
    border: 1px solid #ebe2d0;
    border-radius: 24px;
    background: linear-gradient(180deg, #fffdf8 0%, #fbf5e8 100%);
}

.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.demo-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.demo-group-compact {
    max-width: 420px;
}

.demo-label {
    color: #a0936e;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.2px;
}

.demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
}

.radio-row {
    gap: 20px;
}

.demo-copy {
    color: #8a7b66;
    font-size: 14px;
    line-height: 1.7;
}

.form-demo {
    max-width: 560px;
}

.section-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.section-link {
    color: #3485c7;
    font-size: 14px;
    line-height: 1.7;
    text-decoration: none;
    word-break: break-all;
}

.section-link:hover {
    text-decoration: underline;
}

.card-showcase-title {
    margin-bottom: 8px;
    color: #725d42;
    font-size: 17px;
    font-weight: 700;
}

.card-showcase-copy {
    color: #8a7b66;
    font-size: 14px;
    line-height: 1.75;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
    gap: 14px;
}

.card-showcase {
    width: min(100%, 340px);
}

.card-showcase-wide {
    width: min(100%, 560px);
}

.card-showcase-tinted :is(.card-showcase-title, .card-showcase-copy) {
    color: inherit;
}

.card-showcase-tinted .card-showcase-copy {
    opacity: 0.85;
}

.cursor-demo {
    display: block;
}

.cursor-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    max-width: 360px;
    cursor: inherit;
}

.cursor-illustration {
    width: 56px;
    height: 56px;
}

.cursor-name {
    color: #725d42;
    font-size: 18px;
    font-weight: 700;
}

.cursor-desc,
.modal-copy {
    margin: 0;
    color: #8a7b66;
    font-size: 14px;
    line-height: 1.8;
}

@media (max-width: 900px) {
    .page-shell {
        width: 100%;
    }

    .doc-section {
        padding: 20px 18px;
        border-radius: 12px;
    }

    .demo-panel {
        padding: 18px 16px;
    }
}
</style>
