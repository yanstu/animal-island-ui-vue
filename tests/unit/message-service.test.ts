import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { message } from '../../src/components/Message';
import { messageState } from '../../src/components/Message/messageStore';

describe('message service', () => {
    beforeEach(() => {
        message.destroyAll();
    });

    afterEach(() => {
        message.destroyAll();
    });

    it('stacks messages and renders them inside a body container', async () => {
        message.success('保存成功', 0);
        message.warning('注意检查', 0);
        await nextTick();

        expect(messageState.items).toHaveLength(2);
        expect(document.body.querySelector('[data-animal-message-root]')).not.toBeNull();
        expect(document.body.textContent).toContain('保存成功');
        expect(document.body.textContent).toContain('注意检查');
    });

    it('auto closes after the given duration', () => {
        vi.useFakeTimers();
        message.info('稍后消失', 1500);
        expect(messageState.items).toHaveLength(1);

        vi.advanceTimersByTime(1500);
        expect(messageState.items).toHaveLength(0);
        vi.useRealTimers();
    });

    it('returns a close handle for manual dismissal', () => {
        const close = message.open({ content: '手动关闭', duration: 0 });
        expect(messageState.items).toHaveLength(1);

        close();
        expect(messageState.items).toHaveLength(0);
    });
});
