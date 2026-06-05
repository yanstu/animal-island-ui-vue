import MessageComponent from './Message.vue';
import { message } from './service';

/**
 * Message 既可作为组件在模板中使用，也可通过命令式 API 调用，
 * 例如 `Message.success('保存成功')` 或 `message.success('保存成功')`。
 */
export const Message = Object.assign(MessageComponent, message);

export { message };
export type { MessageProps } from './Message.vue';
export type {
    MessageApi,
    MessageOptions,
    MessageCloseFn,
} from './service';
export type { MessageType } from './messageStore';
