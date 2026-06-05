import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { notification } from '../../src/components/Notification';
import { notificationState } from '../../src/components/Notification/notificationStore';

describe('notification service', () => {
    beforeEach(() => {
        notification.destroyAll();
    });

    afterEach(() => {
        notification.destroyAll();
    });

    it('stacks notifications with title and description', async () => {
        notification.success('已发布', '岛屿已对访客开放', 0);
        await nextTick();

        expect(notificationState.items).toHaveLength(1);
        expect(document.body.querySelector('[data-animal-notification-root]')).not.toBeNull();
        expect(document.body.textContent).toContain('已发布');
        expect(document.body.textContent).toContain('岛屿已对访客开放');
    });

    it('auto closes after the given duration', () => {
        vi.useFakeTimers();
        notification.info('提醒', '记得浇花', 2000);
        expect(notificationState.items).toHaveLength(1);

        vi.advanceTimersByTime(2000);
        expect(notificationState.items).toHaveLength(0);
        vi.useRealTimers();
    });

    it('returns a close handle for manual dismissal', () => {
        const close = notification.open({
            title: '常驻通知',
            duration: 0,
        });
        expect(notificationState.items).toHaveLength(1);

        close();
        expect(notificationState.items).toHaveLength(0);
    });
});
