import { createApp, type App } from 'vue';
import NotificationContainer from './NotificationContainer.vue';
import {
    notificationState,
    nextNotificationId,
    type NotificationType,
} from './notificationStore';

let host: HTMLElement | null = null;
let app: App | null = null;

const ensureHost = () => {
    if (typeof document === 'undefined') return;
    if (host && host.isConnected) return;

    host = document.createElement('div');
    host.setAttribute('data-animal-notification-root', '');
    document.body.appendChild(host);

    app = createApp(NotificationContainer);
    app.mount(host);
};

export interface NotificationOptions {
    /** 通知标题。 */
    title: string;
    /** 通知描述。 */
    description?: string;
    /** 通知类型。 */
    type?: NotificationType;
    /** 自动关闭时长（毫秒），传 0 表示不自动关闭。 */
    duration?: number;
}

export type NotificationCloseFn = () => void;

const remove = (id: number) => {
    const index = notificationState.items.findIndex((item) => item.id === id);
    if (index >= 0) {
        notificationState.items.splice(index, 1);
    }
};

const open = (options: NotificationOptions): NotificationCloseFn => {
    ensureHost();

    const { title, description = '', type = 'default', duration = 4500 } = options;
    const id = nextNotificationId();
    notificationState.items.push({ id, title, description, type });

    let timer: ReturnType<typeof setTimeout> | null = null;
    const close: NotificationCloseFn = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        remove(id);
    };

    if (duration > 0) {
        timer = setTimeout(close, duration);
    }

    return close;
};

const withType =
    (type: NotificationType) =>
    (
        title: string,
        description?: string,
        duration?: number
    ): NotificationCloseFn =>
        open({ title, description, type, duration });

export interface NotificationApi {
    /** 以完整配置打开一条通知。 */
    open: (options: NotificationOptions) => NotificationCloseFn;
    /** 普通通知。 */
    info: (title: string, description?: string, duration?: number) => NotificationCloseFn;
    /** 成功通知。 */
    success: (title: string, description?: string, duration?: number) => NotificationCloseFn;
    /** 警告通知。 */
    warning: (title: string, description?: string, duration?: number) => NotificationCloseFn;
    /** 关闭全部通知。 */
    destroyAll: () => void;
}

export const notification: NotificationApi = {
    open,
    info: withType('default'),
    success: withType('success'),
    warning: withType('warning'),
    destroyAll: () => {
        notificationState.items.splice(0);
    },
};
