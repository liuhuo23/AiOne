import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { i18n } from '../i18n';

// 定义主题模式类型
export type ThemeMode = 'light' | 'dark' | 'system';

// 定义通知类型
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

// 定义通知项接口
export interface NotificationItem {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    duration?: number; // 自动关闭时间，单位秒，0 表示不自动关闭
    action?: {
        text: string;
        onClick: () => void;
    };
    timestamp: number;
    read: boolean;
}

// 定义通知状态接口
export interface NotificationState {
    items: NotificationItem[];
    unreadCount: number;
    show: boolean; // 是否显示通知面板
    position: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft' | 'top' | 'bottom';
}

// 定义应用状态的类型
export interface AppState {
    // 窗口状态
    window: {
        isMaximized: boolean;
        isDragging: boolean;
    };
    // 主题设置
    theme: {
        primaryColor: string;
        siderWidth: number;
        titleBarHeight: number;
        mode: ThemeMode;
        currentMode: 'light' | 'dark'; // 当前实际显示的模式（解析后的）
        globalBackground?: string; // 新增：全局背景
    };
    // 用户设置
    settings: {
        language: 'zh-CN' | 'en-US';
        autoSave: boolean;
        notifications: boolean;
        log_level: String,
        startup_page: String,
    };
    // 当前页面信息
    current: {
        path: string;
        title: string;
    };
    // 加载状态
    loading: {
        global: boolean;
        [key: string]: boolean;
    };
    // 通知状态
    notifications: NotificationState;
}

// 定义动作类型
export type AppAction =
    | { type: 'SET_WINDOW_MAXIMIZED'; payload: boolean }
    | { type: 'SET_WINDOW_DRAGGING'; payload: boolean }
    | { type: 'SET_THEME_COLOR'; payload: string }
    | { type: 'SET_THEME_MODE'; payload: ThemeMode }
    | { type: 'SET_CURRENT_MODE'; payload: 'light' | 'dark' }
    | { type: 'SET_SIDER_WIDTH'; payload: number }
    | { type: 'SET_GLOBAL_BACKGROUND'; payload: string } // 新增
    | { type: 'SET_LANGUAGE'; payload: 'zh-CN' | 'en-US' }
    | { type: 'SET_AUTO_SAVE'; payload: boolean }
    | { type: 'SET_NOTIFICATIONS'; payload: boolean }
    | { type: 'SET_LOG_LEVEL'; payload: string }
    | { type: 'SET_STARTUP_PAGE'; payload: string }
    | { type: 'SET_CURRENT_PAGE'; payload: { path: string; title: string } }
    | { type: 'SET_LOADING'; payload: { key: string; loading: boolean } }
    | { type: 'SET_GLOBAL_LOADING'; payload: boolean }
    | { type: 'ADD_NOTIFICATION'; payload: Omit<NotificationItem, 'id' | 'timestamp' | 'read'> }
    | { type: 'REMOVE_NOTIFICATION'; payload: string } // notification id
    | { type: 'MARK_NOTIFICATION_READ'; payload: string } // notification id
    | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
    | { type: 'CLEAR_ALL_NOTIFICATIONS' }
    | { type: 'TOGGLE_NOTIFICATION_PANEL' }
    | { type: 'SET_NOTIFICATION_POSITION'; payload: NotificationState['position'] }
    | { type: 'RESET_STATE' };


// 初始状态
const initialState: AppState = {
    window: {
        isMaximized: false,
        isDragging: false,
    },
    theme: {
        primaryColor: '#11998e',
        siderWidth: 60,
        titleBarHeight: 32,
        mode: 'system',
        currentMode: 'light',
    },
    settings: {
        language: 'zh-CN',
        autoSave: true,
        notifications: true,
        log_level: 'error',
        startup_page: '/',
    },
    current: {
        path: '/',
        title: '首页',
    },
    loading: {
        global: false,
    },
    notifications: {
        items: [],
        unreadCount: 0,
        show: false,
        position: 'top',
    },
};

// Reducer 函数
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_WINDOW_MAXIMIZED':
            return {
                ...state,
                window: {
                    ...state.window,
                    isMaximized: action.payload,
                },
            };

        case 'SET_WINDOW_DRAGGING':
            return {
                ...state,
                window: {
                    ...state.window,
                    isDragging: action.payload,
                },
            };

        case 'SET_THEME_COLOR':
            return {
                ...state,
                theme: {
                    ...state.theme,
                    primaryColor: action.payload,
                },
            };

        case 'SET_THEME_MODE':
            return {
                ...state,
                theme: {
                    ...state.theme,
                    mode: action.payload,
                },
            };

        case 'SET_CURRENT_MODE':
            return {
                ...state,
                theme: {
                    ...state.theme,
                    currentMode: action.payload,
                },
            };

        case 'SET_SIDER_WIDTH':
            return {
                ...state,
                theme: {
                    ...state.theme,
                    siderWidth: action.payload,
                },
            };
        case 'SET_GLOBAL_BACKGROUND':
            return {
                ...state,
                theme: {
                    ...state.theme,
                    globalBackground: action.payload,
                },
            };

        case 'SET_LANGUAGE':
            return {
                ...state,
                settings: {
                    ...state.settings,
                    language: action.payload,
                },
            };

        case 'SET_AUTO_SAVE':
            return {
                ...state,
                settings: {
                    ...state.settings,
                    autoSave: action.payload,
                },
            };

        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                settings: {
                    ...state.settings,
                    notifications: action.payload,
                },
            };

        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                current: {
                    path: action.payload.path,
                    title: action.payload.title,
                },
            };

        case 'SET_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.key]: action.payload.loading,
                },
            };

        case 'SET_GLOBAL_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    global: action.payload,
                },
            };

        case 'ADD_NOTIFICATION': {
            const newNotification: NotificationItem = {
                ...action.payload,
                id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: Date.now(),
                read: false,
            };
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    items: [newNotification, ...state.notifications.items],
                    unreadCount: state.notifications.unreadCount + 1,
                },
            };
        }

        case 'REMOVE_NOTIFICATION': {
            const updatedItems = state.notifications.items.filter(item => item.id !== action.payload);
            const removedItem = state.notifications.items.find(item => item.id === action.payload);
            const unreadCountChange = removedItem && !removedItem.read ? -1 : 0;

            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    items: updatedItems,
                    unreadCount: Math.max(0, state.notifications.unreadCount + unreadCountChange),
                },
            };
        }

        case 'MARK_NOTIFICATION_READ': {
            const updatedItems = state.notifications.items.map(item =>
                item.id === action.payload && !item.read
                    ? { ...item, read: true }
                    : item
            );
            const wasUnread = state.notifications.items.find(item =>
                item.id === action.payload && !item.read
            );

            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    items: updatedItems,
                    unreadCount: wasUnread
                        ? Math.max(0, state.notifications.unreadCount - 1)
                        : state.notifications.unreadCount,
                },
            };
        }

        case 'MARK_ALL_NOTIFICATIONS_READ':
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    items: state.notifications.items.map(item => ({ ...item, read: true })),
                    unreadCount: 0,
                },
            };

        case 'CLEAR_ALL_NOTIFICATIONS':
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    items: [],
                    unreadCount: 0,
                },
            };

        case 'TOGGLE_NOTIFICATION_PANEL':
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    show: !state.notifications.show,
                },
            };

        case 'SET_NOTIFICATION_POSITION':
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    position: action.payload,
                },
            };

        case 'RESET_STATE':
            return initialState;

        case 'SET_LOG_LEVEL':
            return {
                ...state,
                settings: {
                    ...state.settings,
                    log_level: action.payload,
                },
            };

        case 'SET_STARTUP_PAGE':
            return {
                ...state,
                settings: {
                    ...state.settings,
                    startup_page: action.payload,
                },
            };
        default:
            return state;
    }
}

// 创建 Context
const AppStateContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Provider 组件
interface AppStateProviderProps {
    children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    );
};

// 自定义 Hook
export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};

// 便捷的 Hooks
export const useWindowState = () => {
    const { state, dispatch } = useAppState();

    const setMaximized = (isMaximized: boolean) => {
        dispatch({ type: 'SET_WINDOW_MAXIMIZED', payload: isMaximized });
    };

    const setDragging = (isDragging: boolean) => {
        dispatch({ type: 'SET_WINDOW_DRAGGING', payload: isDragging });
    };

    return {
        window: state.window,
        setMaximized,
        setDragging,
    };
};

export const useTheme = () => {
    const { state, dispatch } = useAppState();

    const setPrimaryColor = (color: string) => {
        dispatch({ type: 'SET_THEME_COLOR', payload: color });
    };

    const setSiderWidth = (width: number) => {
        dispatch({ type: 'SET_SIDER_WIDTH', payload: width });
    };

    const setThemeMode = (mode: ThemeMode) => {
        dispatch({ type: 'SET_THEME_MODE', payload: mode });
    };

    const setCurrentMode = (mode: 'light' | 'dark') => {
        dispatch({ type: 'SET_CURRENT_MODE', payload: mode });
    };
    return {
        theme: state.theme,
        setPrimaryColor,
        setSiderWidth,
        setThemeMode,
        setCurrentMode,
    };
};

export const useSettings = () => {
    const { state, dispatch } = useAppState();

    const setLanguage = (language: 'zh-CN' | 'en-US') => {
        dispatch({ type: 'SET_LANGUAGE', payload: language });
        // 同步更新 i18n 系统
        i18n.changeLanguage(language);
    };

    const setAutoSave = (autoSave: boolean) => {
        dispatch({ type: 'SET_AUTO_SAVE', payload: autoSave });
    };

    const setNotifications = (notifications: boolean) => {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    };

    return {
        settings: state.settings,
        setLanguage,
        setAutoSave,
        setNotifications,
    };
};

export const useCurrentPage = () => {
    const { state, dispatch } = useAppState();

    const setCurrentPage = (path: string, title: string) => {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: { path, title } });
    };

    return {
        current: state.current,
        setCurrentPage,
    };
};

export const useLoading = () => {
    const { state, dispatch } = useAppState();

    const setLoading = (key: string, loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: { key, loading } });
    };

    const setGlobalLoading = (loading: boolean) => {
        dispatch({ type: 'SET_GLOBAL_LOADING', payload: loading });
    };

    return {
        loading: state.loading,
        setLoading,
        setGlobalLoading,
    };
};

// 通知管理 Hook
export const useNotifications = () => {
    const { state, dispatch } = useAppState();

    const addNotification = (
        type: NotificationType,
        title: string,
        message?: string,
        options?: {
            duration?: number;
            action?: {
                text: string;
                onClick: () => void;
            };
        }
    ) => {
        dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
                type,
                title,
                message,
                duration: options?.duration ?? 4.5,
                action: options?.action,
            },
        });
    };

    const removeNotification = (id: string) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    };

    const markAsRead = (id: string) => {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
    };

    const markAllAsRead = () => {
        dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
    };

    const clearAll = () => {
        dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    };

    const togglePanel = () => {
        dispatch({ type: 'TOGGLE_NOTIFICATION_PANEL' });
    };

    const setPosition = (position: NotificationState['position']) => {
        dispatch({ type: 'SET_NOTIFICATION_POSITION', payload: position });
    };

    // 便捷方法
    const success = (title: string, message?: string, options?: Parameters<typeof addNotification>[3]) => {
        addNotification('success', title, message, options);
    };

    const info = (title: string, message?: string, options?: Parameters<typeof addNotification>[3]) => {
        addNotification('info', title, message, options);
    };

    const warning = (title: string, message?: string, options?: Parameters<typeof addNotification>[3]) => {
        addNotification('warning', title, message, options);
    };

    const error = (title: string, message?: string, options?: Parameters<typeof addNotification>[3]) => {
        addNotification('error', title, message, options);
    };

    return {
        notifications: state.notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        togglePanel,
        setPosition,
        // 便捷方法
        success,
        info,
        warning,
        error,
    };
};
