import React from 'react';
import { Menu, Typography } from 'antd';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
    SettingOutlined,
    BgColorsOutlined,
    FolderOpenOutlined,
    InfoCircleOutlined,
    ApiOutlined
} from '@ant-design/icons';
import AppearancePage from './AppearancePage';
import GeneralPage from './GeneralPage';
import StoragePage from './StoragePage';
import SystemPage from './SystemPage';
import UpdatePage from './UpdatePage';
import ModelProviderPage from './ModelProviderPage';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 获取当前选中的菜单项
    const getCurrentKey = () => {
        const path = location.pathname;
        if (path.includes('/settings/appearance')) return 'appearance';
        if (path.includes('/settings/general')) return 'general';
        if (path.includes('/settings/model-provider')) return 'model-provider';
        if (path.includes('/settings/storage')) return 'storage';
        if (path.includes('/settings/system')) return 'system';
        if (path.includes('/settings/update')) return 'update';
        return 'appearance'; // 默认选中外观设置
    };

    const menuItems = [
        {
            key: 'model-provider',
            icon: <ApiOutlined />,
            label: '模型提供商',
            onClick: () => navigate('/settings/model-provider')
        },
        {
            key: 'appearance',
            icon: <BgColorsOutlined />,
            label: '外观显示',
            onClick: () => navigate('/settings/appearance')
        },
        {
            key: 'general',
            icon: <SettingOutlined />,
            label: '通用设置',
            onClick: () => navigate('/settings/general')
        },
        {
            key: 'storage',
            icon: <FolderOpenOutlined />,
            label: '存储位置',
            onClick: () => navigate('/settings/storage')
        },
        {
            key: 'system',
            icon: <InfoCircleOutlined />,
            label: '系统信息',
            onClick: () => navigate('/settings/system')
        },
        {
            key: 'update',
            icon: <InfoCircleOutlined />,
            label: '应用更新',
            onClick: () => navigate('/settings/update')
        }
    ];

    React.useEffect(() => {
        // 如果当前路径是 /settings，重定向到 /settings/appearance
        if (location.pathname === '/settings' || location.pathname === '/settings/') {
            navigate('/settings/appearance', { replace: true });
        }

        // 为设置页面调整父容器样式
        const appContent = document.querySelector('.app-content') as HTMLElement;
        if (appContent) {
            appContent.style.overflow = 'hidden';
        }

        // 清理函数，离开设置页面时恢复原样式
        return () => {
            if (appContent) {
                appContent.style.overflow = 'auto';
            }
        };
    }, [location.pathname, navigate]);

    return (
        <div className='page-container settings-container'>
            <div
                style={{
                    width: 200,
                    borderRadius: '8px',
                    marginRight: '16px',
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    flexShrink: 0
                }}
            >
                <div style={{ padding: '16px 0' }}>
                    <Typography.Title level={4} style={{
                        padding: '0 16px',
                        margin: '0 0 16px 0',
                        color: 'var(--ant-color-text)'
                    }}>
                        设置
                    </Typography.Title>
                    <Menu
                        mode="inline"
                        selectedKeys={[getCurrentKey()]}
                        style={{
                            border: 'none',
                            background: 'transparent'
                        }}
                        items={menuItems}
                    />
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    background: 'var(--ant-color-bg-container)',
                    borderRadius: '8px',
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
            >
                <Routes>
                    <Route path="/appearance" element={<AppearancePage />} />
                    <Route path="/general" element={<GeneralPage />} />
                    <Route path="/model-provider" element={<ModelProviderPage />} />
                    <Route path="/storage" element={<StoragePage />} />
                    <Route path="/system" element={<SystemPage />} />
                    <Route path="/update" element={<UpdatePage />} />
                </Routes>
            </div>
        </div>
    );
};

export default SettingsPage;
