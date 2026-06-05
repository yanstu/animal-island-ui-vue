<script setup lang="ts">
import Notification from './Notification.vue';
import { notificationState } from './notificationStore';
import styles from './notification-container.module.less';

defineOptions({
    name: 'NotificationContainer',
});

const remove = (id: number) => {
    const index = notificationState.items.findIndex((item) => item.id === id);
    if (index >= 0) {
        notificationState.items.splice(index, 1);
    }
};
</script>

<template>
    <TransitionGroup
        tag="div"
        :class="styles.container"
        data-animal-notification-container
        :move-class="styles.move"
        :enter-from-class="styles.enterFrom"
        :enter-active-class="styles.enterActive"
        :leave-active-class="styles.leaveActive"
        :leave-to-class="styles.leaveTo"
    >
        <div
            v-for="item in notificationState.items"
            :key="item.id"
            :class="styles.item"
        >
            <Notification
                :title="item.title"
                :description="item.description"
                :type="item.type"
                closable
                @close="remove(item.id)"
            />
        </div>
    </TransitionGroup>
</template>
