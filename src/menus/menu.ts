// 菜单项配置
import React from "react";
import type { MenuProps } from "antd";
import {
    HomeOutlined,
    SettingOutlined,
    UserOutlined,
    FileTextOutlined,
    DatabaseOutlined,
    BellOutlined,
    DashboardOutlined,
    DesktopOutlined,
    MessageOutlined,
} from "@ant-design/icons";

type MenuItem = Required<MenuProps>['items'][number] & {
    position?: 'top' | 'bottom';
    translationKey?: string; // 添加翻译键
    idDefault?: boolean; // 是否为默认菜单项
};

const menuItems: MenuItem[] = [
    {
        key: '/home',
        icon: React.createElement(HomeOutlined),
        label: '首页',
        translationKey: 'menu.home',
        position: 'top',
        idDefault: false, // 设置为默认菜单项
    },
    {
        key: "/assent",
        icon: React.createElement(MessageOutlined),
        label: 'AI聊天',
        translationKey: 'menu.ai_chat',
        position: 'top',
        idDefault: true, // 设置为默认菜单项
    },
    {
        key: '/dashboard',
        icon: React.createElement(DashboardOutlined),
        label: '仪表板',
        translationKey: 'menu.dashboard',
        position: 'top',
    },
    {
        key: '/user',
        icon: React.createElement(UserOutlined),
        label: '用户管理',
        translationKey: 'menu.user_management',
        position: 'top',
    },
    {
        key: '/documents',
        icon: React.createElement(FileTextOutlined),
        label: '文档管理',
        translationKey: 'menu.documents',
        position: 'top',
    },
    {
        key: '/database',
        icon: React.createElement(DatabaseOutlined),
        label: '数据管理',
        translationKey: 'menu.database',
        position: 'top',
    },
    {
        key: '/notifications',
        icon: React.createElement(BellOutlined),
        label: '通知中心',
        translationKey: 'menu.notifications',
        position: 'bottom',
    },
    {
        key: 'theme-toggle',
        icon: React.createElement(DesktopOutlined),
        label: '主题模式',
        translationKey: 'theme.toggle',
        position: 'bottom',
    },
    {
        key: '/settings',
        icon: React.createElement(SettingOutlined),
        label: '系统设置',
        translationKey: 'menu.settings',
        position: 'bottom',
    },
];

export default menuItems;