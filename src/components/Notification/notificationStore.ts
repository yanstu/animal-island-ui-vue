import { reactive } from 'vue';

export type NotificationType = 'default' | 'success' | 'warning';

export interface NotificationItem {
    id: number;
    title: string;
    description: string;
    type: NotificationType;
}

export const notificationState = reactive<{ items: NotificationItem[] }>({
    items: [],
});

let seed = 0;

export const nextNotificationId = () => {
    seed += 1;
    return seed;
};
