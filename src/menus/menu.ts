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
        key: "/assent",
        icon: React.createElement(MessageOutlined),
        label: '',
        translationKey: '',
        position: 'top',
        idDefault: true, // 设置为默认菜单项
    },
    {
        key: '/dashboard',
        icon: React.createElement(DashboardOutlined),
        label: '',
        translationKey: '',
        position: 'top',
    },
    {
        key: '/user',
        icon: React.createElement(UserOutlined),
        label: '',
        translationKey: '',
        position: 'top',
    },
    {
        key: '/documents',
        icon: React.createElement(FileTextOutlined),
        label: '',
        translationKey: '',
        position: 'top',
    },
    {
        key: '/database',
        icon: React.createElement(DatabaseOutlined),
        label: '',
        translationKey: '',
        position: 'top',
    },
    {
        key: '/notifications',
        icon: React.createElement(BellOutlined),
        label: '',
        translationKey: '',
        position: 'bottom',
    },
    {
        key: 'theme-toggle',
        icon: React.createElement(DesktopOutlined),
        label: '',
        translationKey: '',
        position: 'bottom',
    },
    {
        key: '/settings',
        icon: React.createElement(SettingOutlined),
        label: '',
        translationKey: '',
        position: 'bottom',
    },
];

export default menuItems;