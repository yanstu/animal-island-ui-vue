import { createApp, type App } from 'vue';
import MessageContainer from './MessageContainer.vue';
import { messageState, nextMessageId, type MessageType } from './messageStore';

let host: HTMLElement | null = null;
let app: App | null = null;

const ensureHost = () => {
    if (typeof document === 'undefined') return;
    if (host && host.isConnected) return;

    host = document.createElement('div');
    host.setAttribute('data-animal-message-root', '');
    document.body.appendChild(host);

    app = createApp(MessageContainer);
    app.mount(host);
};

export interface MessageOptions {
    /** 提示文本。 */
    content: string;
    /** 提示类型。 */
    type?: MessageType;
    /** 自动关闭时长（毫秒），传 0 表示不自动关闭。 */
    duration?: number;
}

export type MessageCloseFn = () => void;

const remove = (id: number) => {
    const index = messageState.items.findIndex((item) => item.id === id);
    if (index >= 0) {
        messageState.items.splice(index, 1);
    }
};

const open = (options: MessageOptions): MessageCloseFn => {
    ensureHost();

    const { content, type = 'default', duration = 3000 } = options;
    const id = nextMessageId();
    messageState.items.push({ id, content, type });

    let timer: ReturnType<typeof setTimeout> | null = null;
    const close: MessageCloseFn = () => {
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
    (type: MessageType) =>
    (content: string, duration?: number): MessageCloseFn =>
        open({ content, type, duration });

export interface MessageApi {
    /** 以完整配置打开一条消息。 */
    open: (options: MessageOptions) => MessageCloseFn;
    /** 普通消息。 */
    info: (content: string, duration?: number) => MessageCloseFn;
    /** 成功消息。 */
    success: (content: string, duration?: number) => MessageCloseFn;
    /** 警告消息。 */
    warning: (content: string, duration?: number) => MessageCloseFn;
    /** 关闭全部消息。 */
    destroyAll: () => void;
}

export const message: MessageApi = {
    open,
    info: withType('default'),
    success: withType('success'),
    warning: withType('warning'),
    destroyAll: () => {
        messageState.items.splice(0);
    },
};
