// 菜单项配置
import React from "react";
import type { MenuProps } from "antd";
import {
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
        key: "/assent",
        icon: React.createElement(MessageOutlined),
        label: '',
        translationKey: 'menu.ai_chat',
        position: 'top',
        idDefault: true, // 设置为默认菜单项
    },
    {
        key: '/dashboard',
        icon: React.createElement(DashboardOutlined),
        label: '',
        translationKey: 'menu.dashboard',
        position: 'top',
    },
    {
        key: '/user',
        icon: React.createElement(UserOutlined),
        label: '',
        translationKey: 'menu.user_management',
        position: 'top',
    },
    {
        key: '/documents',
        icon: React.createElement(FileTextOutlined),
        label: '',
        translationKey: 'menu.documents',
        position: 'top',
    },
    {
        key: '/database',
        icon: React.createElement(DatabaseOutlined),
        label: '',
        translationKey: 'menu.database',
        position: 'top',
    },
    {
        key: '/notifications',
        icon: React.createElement(BellOutlined),
        label: '',
        translationKey: 'menu.notifications',
        position: 'bottom',
    },
    {
        key: 'theme-toggle',
        icon: React.createElement(DesktopOutlined),
        label: '',
        translationKey: 'theme.toggle',
        position: 'bottom',
    },
    {
        key: '/settings',
        icon: React.createElement(SettingOutlined),
        label: '',
        translationKey: 'menu.settings',
        position: 'bottom',
    },
];

export default menuItems;