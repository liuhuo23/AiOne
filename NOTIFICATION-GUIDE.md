# 全局通知系统使用指南

## 概览

AiOne 应用现在集成了一个强大的全局通知系统，提供了统一的通知管理功能。该系统基于 Ant Design 的 notification 组件，并扩展了持久化存储、状态管理等功能。

## 功能特性

### 1. 多种通知类型
- **Success（成功）**：绿色，用于成功操作反馈
- **Info（信息）**：蓝色，用于一般信息提示
- **Warning（警告）**：橙色，用于警告提示
- **Error（错误）**：红色，用于错误信息

### 2. 通知管理
- **实时显示**：新通知自动弹出显示
- **历史记录**：所有通知保存在通知中心
- **读取状态**：支持已读/未读状态管理
- **批量操作**：支持全部标记已读、清空所有通知

### 3. 交互功能
- **自动关闭**：可设置自动关闭时间
- **手动关闭**：点击关闭按钮
- **操作按钮**：支持自定义操作按钮
- **侧边栏集成**：通过左侧菜单的通知图标访问，显示未读数量徽章

## 使用方法

### 1. 通过左侧菜单访问

通知功能已经集成到左侧导航菜单中：
- 点击左侧菜单栏底部的通知图标（铃铛）
- 图标上会显示未读通知的数量徽章
- 点击后会在右侧打开通知面板抽屉

### 2. 基础使用

```tsx
import { useNotifications } from '../store/AppStateContext';

const MyComponent = () => {
    const { success, info, warning, error } = useNotifications();

    const handleSuccess = () => {
        success("操作成功", "您的操作已完成");
    };

    const handleError = () => {
        error("操作失败", "请检查网络连接后重试");
    };

    return (
        <div>
            <Button onClick={handleSuccess}>成功通知</Button>
            <Button onClick={handleError}>错误通知</Button>
        </div>
    );
};
```

### 3. 高级配置

```tsx
const { addNotification } = useNotifications();

// 自定义通知配置
addNotification(
    'warning',
    '重要提醒',
    '系统将在5分钟后进行维护',
    {
        duration: 0, // 不自动关闭
        action: {
            text: '了解详情',
            onClick: () => {
                // 处理点击事件
                console.log('查看维护详情');
            }
        }
    }
);
```

### 4. 通知管理

```tsx
const { 
    notifications,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    togglePanel 
} = useNotifications();

// 访问通知状态
console.log('未读通知数量:', notifications.unreadCount);
console.log('所有通知:', notifications.items);

// 标记特定通知为已读
markAsRead('notification_id');

// 全部标记为已读
markAllAsRead();

// 清空所有通知
clearAll();

// 切换通知面板显示
togglePanel();
```

## API 参考

### useNotifications Hook

| 方法 | 参数 | 描述 |
|------|------|------|
| `success` | `(title, message?, options?)` | 发送成功通知 |
| `info` | `(title, message?, options?)` | 发送信息通知 |
| `warning` | `(title, message?, options?)` | 发送警告通知 |
| `error` | `(title, message?, options?)` | 发送错误通知 |
| `addNotification` | `(type, title, message?, options?)` | 添加自定义通知 |
| `removeNotification` | `(id)` | 移除指定通知 |
| `markAsRead` | `(id)` | 标记为已读 |
| `markAllAsRead` | `()` | 全部标记已读 |
| `clearAll` | `()` | 清空所有通知 |
| `togglePanel` | `()` | 切换通知面板 |

### 通知选项 (options)

```typescript
interface NotificationOptions {
    duration?: number;  // 自动关闭时间（秒），0 表示不自动关闭
    action?: {
        text: string;           // 按钮文本
        onClick: () => void;    // 点击回调
    };
}
```

### 通知状态

```typescript
interface NotificationState {
    items: NotificationItem[];      // 通知列表
    unreadCount: number;           // 未读数量
    show: boolean;                 // 面板显示状态
    position: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'; // 显示位置
}
```

## 样式定制

通知系统的样式定义在 `/src/components/NotificationCenter.css` 中，您可以根据需要进行定制：

```css
/* 自定义通知项样式 */
.notification-item.unread {
    border-left: 3px solid var(--ant-primary-color);
}

/* 菜单中的通知徽章样式 */
.app-menu .ant-menu-item .ant-badge .ant-badge-count {
    background: var(--error-color);
    font-size: 10px;
    min-width: 16px;
    height: 16px;
}
```

## 最佳实践

### 1. 通知时机
- **成功操作**：用户操作成功完成后
- **错误处理**：操作失败或出现错误时
- **重要提醒**：需要用户注意的重要信息
- **状态变更**：系统状态发生重要变化时

### 2. 内容准则
- **标题简洁**：使用简短、明确的标题
- **信息完整**：在描述中提供必要的详细信息
- **操作明确**：如果需要用户操作，提供清晰的指引

### 3. 用户体验
- **适度使用**：避免过度使用通知，造成用户困扰
- **及时清理**：定期清理过期通知
- **分类管理**：不同类型的通知使用合适的类型标识

## 示例场景

### 1. 文件操作
```tsx
const handleFileSave = async () => {
    try {
        await saveFile();
        success("保存成功", "文件已成功保存到本地");
    } catch (error) {
        error("保存失败", "文件保存时发生错误，请重试", {
            action: {
                text: "重试",
                onClick: handleFileSave
            }
        });
    }
};
```

### 2. 网络请求
```tsx
const handleApiCall = async () => {
    try {
        info("请求中", "正在处理您的请求...");
        const result = await apiCall();
        success("请求完成", "数据已成功获取");
    } catch (error) {
        error("请求失败", "网络连接异常，请检查网络后重试");
    }
};
```

### 3. 系统提醒
```tsx
const showMaintenanceNotice = () => {
    warning(
        "系统维护通知",
        "系统将在今晚22:00-24:00进行维护，期间可能影响使用",
        {
            duration: 0,
            action: {
                text: "查看详情",
                onClick: () => navigateToMaintenancePage()
            }
        }
    );
};
```

通过这个全局通知系统，您可以为用户提供一致、友好的消息反馈体验，提升应用的整体用户体验。
