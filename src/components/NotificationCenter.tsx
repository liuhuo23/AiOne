import React, { useEffect } from 'react';
import {
    notification,
    Button,
    Drawer,
    List,
    Typography,
    Space,
    Tag,
    Empty,
    Tooltip
} from 'antd';
import {
    CloseOutlined,
    CheckOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { useNotifications, NotificationItem, NotificationType } from '../store/AppStateContext';
import { useThemeManager } from '../hooks/useThemeManager';
import './NotificationCenter.css';

const { Text, Title } = Typography;

// 通知类型图标映射 - 使用 CSS 变量支持主题切换
const iconMap: Record<NotificationType, React.ReactNode> = {
    success: <CheckCircleOutlined style={{ color: 'var(--success-color)' }} />,
    info: <InfoCircleOutlined style={{ color: 'var(--info-color)' }} />,
    warning: <ExclamationCircleOutlined style={{ color: 'var(--warning-color)' }} />,
    error: <CloseCircleOutlined style={{ color: 'var(--error-color)' }} />,
};

// 通知类型颜色映射 - 使用 CSS 变量
const colorMap: Record<NotificationType, string> = {
    success: 'var(--success-color)',
    info: 'var(--info-color)',
    warning: 'var(--warning-color)',
    error: 'var(--error-color)',
};

const NotificationCenter: React.FC = () => {
    const {
        notifications,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        togglePanel,
    } = useNotifications();
    const { currentTheme } = useThemeManager();

    // 配置 notification 全局设置 - 根据主题动态调整
    useEffect(() => {
        notification.config({
            placement: notifications.position,
            duration: 4.5,
            maxCount: 3,
            top: 24,
            rtl: false,
            prefixCls: 'ant-notification', // 使用标准前缀
        });

        // 简化的强制样式注入 - 直接覆盖Ant Design的样式
        const injectForceStyles = () => {
            const existingStyle = document.getElementById('notification-force-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            const style = document.createElement('style');
            style.id = 'notification-force-styles';

            if (currentTheme === 'dark') {
                style.textContent = `
                    .ant-notification .ant-notification-notice,
                    .ant-notification-topRight .ant-notification-notice,
                    .ant-notification-topLeft .ant-notification-notice,
                    .ant-notification-bottomRight .ant-notification-notice,
                    .ant-notification-bottomLeft .ant-notification-notice {
                        background: #141414 !important;
                        border: 1px solid #424242 !important;
                        color: rgba(255, 255, 255, 0.85) !important;
                    }
                    .ant-notification .ant-notification-notice-message,
                    .ant-notification .ant-notification-notice-message h4 {
                        color: rgba(255, 255, 255, 0.85) !important;
                        font-weight: 600 !important;
                    }
                    .ant-notification .ant-notification-notice-description,
                    .ant-notification .ant-notification-notice-description div {
                        color: rgba(255, 255, 255, 0.65) !important;
                    }
                    .ant-notification .ant-notification-notice-close {
                        color: rgba(255, 255, 255, 0.65) !important;
                    }
                    .ant-notification .ant-notification-notice-close:hover {
                        color: rgba(255, 255, 255, 0.85) !important;
                    }
                `;
            } else {
                style.textContent = `
                    .ant-notification .ant-notification-notice,
                    .ant-notification-topRight .ant-notification-notice,
                    .ant-notification-topLeft .ant-notification-notice,
                    .ant-notification-bottomRight .ant-notification-notice,
                    .ant-notification-bottomLeft .ant-notification-notice {
                        background: #ffffff !important;
                        border: 1px solid #d9d9d9 !important;
                        color: rgba(0, 0, 0, 0.88) !important;
                    }
                    .ant-notification .ant-notification-notice-message,
                    .ant-notification .ant-notification-notice-message h4 {
                        color: rgba(0, 0, 0, 0.88) !important;
                        font-weight: 600 !important;
                    }
                    .ant-notification .ant-notification-notice-description,
                    .ant-notification .ant-notification-notice-description div {
                        color: rgba(0, 0, 0, 0.65) !important;
                    }
                    .ant-notification .ant-notification-notice-close {
                        color: rgba(0, 0, 0, 0.65) !important;
                    }
                    .ant-notification .ant-notification-notice-close:hover {
                        color: rgba(0, 0, 0, 0.88) !important;
                    }
                `;
            }

            document.head.appendChild(style);
        };

        injectForceStyles();

        // 清理函数
        return () => {
            const existingStyle = document.getElementById('notification-force-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, [notifications.position, currentTheme]);

    // 使用 Ant Design 的 notification API 显示通知
    useEffect(() => {
        // 监听新通知并使用 Ant Design 的 notification 显示
        const latestNotification = notifications.items[0];
        if (latestNotification && !latestNotification.read) {
            const { type, title, message, duration, action, id } = latestNotification;

            notification[type]({
                message: title,
                description: message,
                duration: duration === 0 ? null : (duration || 4.5),
                placement: notifications.position,
                btn: action ? (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            action.onClick();
                            notification.destroy(id);
                        }}
                    >
                        {action.text}
                    </Button>
                ) : undefined,
                key: id,
                onClose: () => {
                    markAsRead(id);
                },
                style: {
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-2)',
                },
                className: `custom-notification notification-${currentTheme}`,
            });
        }
    }, [notifications.items]);

    // 格式化时间
    const formatTime = (timestamp: number) => {
        try {
            const now = new Date();
            const time = new Date(timestamp);
            const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

            if (diffInSeconds < 60) {
                return '刚才';
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                return `${minutes}分钟前`;
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                return `${hours}小时前`;
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                return `${days}天前`;
            }
        } catch {
            return '刚才';
        }
    };

    // 渲染单个通知项
    const renderNotificationItem = (item: NotificationItem) => (
        <List.Item
            key={item.id}
            className={`notification-item ${!item.read ? 'unread' : ''}`}
            actions={[
                <Tooltip title="标记为已读">
                    <Button
                        type="text"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => markAsRead(item.id)}
                        disabled={item.read}
                    />
                </Tooltip>,
                <Tooltip title="删除">
                    <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => removeNotification(item.id)}
                        danger
                    />
                </Tooltip>,
            ]}
        >
            <List.Item.Meta
                avatar={iconMap[item.type]}
                title={
                    <Space align="start">
                        <Text strong={!item.read}>{item.title}</Text>
                        <Tag color={colorMap[item.type]} style={{ fontSize: '12px' }}>
                            {item.type}
                        </Tag>
                        {!item.read && <Tag color="red" style={{ fontSize: '12px' }}>未读</Tag>}
                    </Space>
                }
                description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        {item.message && (
                            <Text type="secondary">{item.message}</Text>
                        )}
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatTime(item.timestamp)}
                        </Text>
                        {item.action && (
                            <Button size="small" type="link" onClick={item.action.onClick}>
                                {item.action.text}
                            </Button>
                        )}
                    </Space>
                }
            />
        </List.Item>
    );

    return (
        <Drawer
            title={
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Title level={4} style={{ margin: 0, color: 'var(--ant-color-text)' }}>
                        通知中心
                    </Title>
                    <Space>
                        {notifications.unreadCount > 0 && (
                            <Button
                                size="small"
                                onClick={markAllAsRead}
                                icon={<CheckOutlined />}
                                style={{
                                    backgroundColor: 'var(--ant-primary-color)',
                                    borderColor: 'var(--ant-primary-color)',
                                    color: '#fff'
                                }}
                            >
                                全部已读
                            </Button>
                        )}
                        {notifications.items.length > 0 && (
                            <Button
                                size="small"
                                onClick={clearAll}
                                icon={<DeleteOutlined />}
                                danger
                                style={{
                                    borderColor: 'var(--error-color)',
                                    color: 'var(--error-color)'
                                }}
                            >
                                清空
                            </Button>
                        )}
                    </Space>
                </Space>
            }
            placement="right"
            open={notifications.show}
            onClose={togglePanel}
            width={400}
            bodyStyle={{
                padding: 0,
                backgroundColor: 'var(--ant-color-bg-layout)',
            }}
            headerStyle={{
                backgroundColor: 'var(--ant-color-bg-container)',
                borderBottom: `1px solid var(--ant-color-border)`,
            }}
            className={`notification-drawer notification-drawer-${currentTheme}`}
        >
            {notifications.items.length === 0 ? (
                <Empty
                    description={
                        <span style={{ color: 'var(--ant-color-text-secondary)' }}>
                            暂无通知
                        </span>
                    }
                    style={{
                        marginTop: '20%',
                        backgroundColor: 'transparent'
                    }}
                />
            ) : (
                <>
                    {notifications.unreadCount > 0 && (
                        <>
                            <div style={{
                                padding: '16px',
                                backgroundColor: 'var(--ant-color-bg-container)',
                                borderBottom: `1px solid var(--ant-color-border)`
                            }}>
                                <Text
                                    type="secondary"
                                    style={{ color: 'var(--ant-color-text-secondary)' }}
                                >
                                    未读通知 ({notifications.unreadCount})
                                </Text>
                            </div>
                        </>
                    )}
                    <List
                        dataSource={notifications.items}
                        renderItem={renderNotificationItem}
                        style={{
                            maxHeight: 'calc(100vh - 200px)',
                            overflow: 'auto',
                            backgroundColor: 'var(--ant-color-bg-layout)'
                        }}
                    />
                </>
            )}
        </Drawer>
    );
};

export default NotificationCenter;
