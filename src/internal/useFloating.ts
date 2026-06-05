import {
    nextTick,
    onBeforeUnmount,
    ref,
    watch,
    type CSSProperties,
    type Ref,
} from 'vue';

export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';

interface UseFloatingOptions {
    /** 浮层相对锚点的方位。 */
    placement?: FloatingPlacement;
    /** 浮层与锚点之间的间距（px）。 */
    offset?: number;
    /** 浮层最小宽度是否与锚点一致（下拉常用）。 */
    matchWidth?: boolean;
    /** 视口边缘安全留白（px）。 */
    viewportPadding?: number;
}

const VIEWPORT_FALLBACK = 8;

/**
 * 轻量浮层定位：把 teleport 到 body 的浮层固定到锚点旁，
 * 支持主轴翻转与视口内夹取，并在滚动 / 缩放时跟随更新。
 */
export function useFloating(
    anchorRef: Ref<HTMLElement | null>,
    floatingRef: Ref<HTMLElement | null>,
    open: Ref<boolean>,
    options: UseFloatingOptions = {}
) {
    const {
        placement = 'bottom',
        offset = 8,
        matchWidth = false,
        viewportPadding = VIEWPORT_FALLBACK,
    } = options;

    const floatingStyle = ref<CSSProperties>({});
    let frame = 0;

    const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max < min ? min : max);

    const update = () => {
        const anchor = anchorRef.value;
        const floating = floatingRef.value;
        if (!anchor || !floating) return;

        const anchorRect = anchor.getBoundingClientRect();
        const floatRect = floating.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let resolvedPlacement = placement;

        if (placement === 'bottom') {
            const overflowsBottom =
                anchorRect.bottom + offset + floatRect.height > viewportHeight;
            const fitsTop = anchorRect.top - offset - floatRect.height >= 0;
            if (overflowsBottom && fitsTop) resolvedPlacement = 'top';
        } else if (placement === 'top') {
            const overflowsTop = anchorRect.top - offset - floatRect.height < 0;
            const fitsBottom =
                anchorRect.bottom + offset + floatRect.height <= viewportHeight;
            if (overflowsTop && fitsBottom) resolvedPlacement = 'bottom';
        }

        let top = 0;
        let left = 0;

        switch (resolvedPlacement) {
            case 'top':
                top = anchorRect.top - floatRect.height - offset;
                left = anchorRect.left + anchorRect.width / 2 - floatRect.width / 2;
                break;
            case 'left':
                top = anchorRect.top + anchorRect.height / 2 - floatRect.height / 2;
                left = anchorRect.left - floatRect.width - offset;
                break;
            case 'right':
                top = anchorRect.top + anchorRect.height / 2 - floatRect.height / 2;
                left = anchorRect.right + offset;
                break;
            case 'bottom':
            default:
                top = anchorRect.bottom + offset;
                left = anchorRect.left + anchorRect.width / 2 - floatRect.width / 2;
                break;
        }

        if (matchWidth) {
            left = anchorRect.left;
        }

        left = clamp(left, viewportPadding, viewportWidth - floatRect.width - viewportPadding);
        top = clamp(top, viewportPadding, viewportHeight - floatRect.height - viewportPadding);

        const nextStyle: CSSProperties = {
            position: 'fixed',
            top: `${Math.round(top)}px`,
            left: `${Math.round(left)}px`,
        };

        if (matchWidth) {
            nextStyle.minWidth = `${Math.round(anchorRect.width)}px`;
        }

        floatingStyle.value = nextStyle;
    };

    const scheduleUpdate = () => {
        if (typeof window === 'undefined') return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
    };

    const addListeners = () => {
        window.addEventListener('scroll', scheduleUpdate, true);
        window.addEventListener('resize', scheduleUpdate);
    };

    const removeListeners = () => {
        if (typeof window === 'undefined') return;
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', scheduleUpdate, true);
        window.removeEventListener('resize', scheduleUpdate);
    };

    watch(
        open,
        async (isOpen) => {
            if (typeof window === 'undefined') return;
            if (isOpen) {
                await nextTick();
                update();
                addListeners();
            } else {
                removeListeners();
            }
        },
        { immediate: true }
    );

    onBeforeUnmount(removeListeners);

    return { floatingStyle, update };
}
