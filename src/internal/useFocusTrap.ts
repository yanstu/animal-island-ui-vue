import { onBeforeUnmount, watch, type Ref } from 'vue';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

const isVisible = (element: HTMLElement) =>
    element.offsetWidth > 0 ||
    element.offsetHeight > 0 ||
    element === document.activeElement;

/**
 * 在容器内陷阱键盘焦点，配合 aria-modal 对话框使用。
 * active 为 true 时，Tab / Shift+Tab 会在容器内的可聚焦元素之间循环。
 */
export function useFocusTrap(
    containerRef: Ref<HTMLElement | null>,
    active: Ref<boolean>
) {
    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        const container = containerRef.value;
        if (!container) return;

        const focusable = Array.from(
            container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter(isVisible);

        if (focusable.length === 0) {
            event.preventDefault();
            container.focus();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;
        const movingBackward = event.shiftKey;

        if (movingBackward && (activeElement === first || !container.contains(activeElement))) {
            event.preventDefault();
            last.focus();
            return;
        }

        if (!movingBackward && (activeElement === last || !container.contains(activeElement))) {
            event.preventDefault();
            first.focus();
        }
    };

    const stop = () => {
        if (typeof document === 'undefined') return;
        document.removeEventListener('keydown', handleKeydown, true);
    };

    watch(
        active,
        (isActive) => {
            if (typeof document === 'undefined') return;
            if (isActive) {
                document.addEventListener('keydown', handleKeydown, true);
            } else {
                stop();
            }
        },
        { immediate: true }
    );

    onBeforeUnmount(stop);
}
