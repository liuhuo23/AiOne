import { getCurrentWindow } from '@tauri-apps/api/window';
import { UnlistenFn } from '@tauri-apps/api/event';

class WindowStateManager {
    private static instance: WindowStateManager;
    private unlistenFn: UnlistenFn | null = null;
    private isMaximized = false;
    private listeners: Set<(isMaximized: boolean) => void> = new Set();
    private isInitialized = false;
    private isChecking = false;

    private constructor() { }

    static getInstance(): WindowStateManager {
        if (!WindowStateManager.instance) {
            WindowStateManager.instance = new WindowStateManager();
        }
        return WindowStateManager.instance;
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            const appWindow = getCurrentWindow();

            // 获取初始状态
            this.isMaximized = await appWindow.isMaximized();
            this.isInitialized = true;

            // 监听窗口大小变化
            this.unlistenFn = await appWindow.onResized(async () => {
                if (this.isChecking) return;

                this.isChecking = true;
                try {
                    const maximized = await appWindow.isMaximized();
                    if (maximized !== this.isMaximized) {
                        this.isMaximized = maximized;
                        this.notifyListeners();
                    }
                } catch (error) {
                    console.error('检查窗口状态失败:', error);
                } finally {
                    // 防止频繁调用
                    setTimeout(() => {
                        this.isChecking = false;
                    }, 100);
                }
            });
        } catch (error) {
            console.error('初始化窗口状态管理器失败:', error);
        }
    }

    subscribe(listener: (isMaximized: boolean) => void): () => void {
        this.listeners.add(listener);

        // 立即调用一次以获取当前状态
        if (this.isInitialized) {
            listener(this.isMaximized);
        }

        // 返回取消订阅函数
        return () => {
            this.listeners.delete(listener);
        };
    }

    getIsMaximized(): boolean {
        return this.isMaximized;
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => {
            try {
                listener(this.isMaximized);
            } catch (error) {
                console.error('通知窗口状态监听器失败:', error);
            }
        });
    }

    async toggleMaximize(): Promise<void> {
        if (this.isChecking) return;

        try {
            this.isChecking = true;
            const appWindow = getCurrentWindow();
            await appWindow.toggleMaximize();

            // 延迟重置标志，让 onResized 事件处理状态更新
            setTimeout(() => {
                this.isChecking = false;
            }, 150);
        } catch (error) {
            console.error('切换窗口状态失败:', error);
            this.isChecking = false;
        }
    }

    destroy(): void {
        if (this.unlistenFn) {
            this.unlistenFn();
            this.unlistenFn = null;
        }
        this.listeners.clear();
        this.isInitialized = false;
    }
}

export default WindowStateManager;
