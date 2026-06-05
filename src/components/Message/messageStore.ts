import { reactive } from 'vue';

export type MessageType = 'default' | 'success' | 'warning';

export interface MessageItem {
    id: number;
    content: string;
    type: MessageType;
}

export const messageState = reactive<{ items: MessageItem[] }>({
    items: [],
});

let seed = 0;

export const nextMessageId = () => {
    seed += 1;
    return seed;
};
