import { afterEach } from 'vitest';
import { config } from '@vue/test-utils';

// 让 <Teleport> 内容在测试中就地渲染，便于既有的 wrapper 查询与
// 基于 document.body 的查询同时工作。
config.global.stubs = { teleport: true };

afterEach(() => {
    document.body.innerHTML = '';
});
