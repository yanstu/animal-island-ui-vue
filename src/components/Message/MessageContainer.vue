<script setup lang="ts">
import Message from './Message.vue';
import { messageState } from './messageStore';
import styles from './message-container.module.less';

defineOptions({
    name: 'MessageContainer',
});
</script>

<template>
    <TransitionGroup
        tag="div"
        :class="styles.container"
        data-animal-message-container
        :move-class="styles.move"
        :enter-from-class="styles.enterFrom"
        :enter-active-class="styles.enterActive"
        :leave-active-class="styles.leaveActive"
        :leave-to-class="styles.leaveTo"
    >
        <div
            v-for="item in messageState.items"
            :key="item.id"
            :class="styles.item"
        >
            <Message :content="item.content" :type="item.type" />
        </div>
    </TransitionGroup>
</template>
