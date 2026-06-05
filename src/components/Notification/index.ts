import NotificationComponent from './Notification.vue';
import { notification } from './service';

/**
 * Notification 既可作为组件在模板中使用，也可通过命令式 API 调用，
 * 例如 `Notification.success('已上线', '岛屿已对访客开放')`
 * 或 `notification.success('已上线', '岛屿已对访客开放')`。
 */
export const Notification = Object.assign(NotificationComponent, notification);

export { notification };
export type { NotificationProps } from './Notification.vue';
export type {
    NotificationApi,
    NotificationOptions,
    NotificationCloseFn,
} from './service';
export type { NotificationType } from './notificationStore';
