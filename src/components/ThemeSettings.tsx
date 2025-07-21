import React from 'react';
import { Card, Radio, Space, Typography, Divider } from 'antd';
import { SunOutlined, MoonOutlined, DesktopOutlined } from '@ant-design/icons';
import { useThemeManager } from '../hooks/useThemeManager';
import type { ThemeMode } from '../store/AppStateContext';

const { Title, Text } = Typography;

const ThemeSettings: React.FC = () => {
    const { themeMode, setMode, getThemeModeText, currentTheme } = useThemeManager();

    const handleModeChange = (e: any) => {
        setMode(e.target.value as ThemeMode);
    };

    const themeOptions = [
        {
            label: (
                <Space>
                    <SunOutlined />
                    <span>亮色模式</span>
                </Space>
            ),
            value: 'light' as ThemeMode,
        },
        {
            label: (
                <Space>
                    <MoonOutlined />
                    <span>暗黑模式</span>
                </Space>
            ),
            value: 'dark' as ThemeMode,
        },
        {
            label: (
                <Space>
                    <DesktopOutlined />
                    <span>跟随系统</span>
                </Space>
            ),
            value: 'system' as ThemeMode,
        },
    ];

    return (
        <Card title="主题设置">
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                    <Title level={5}>主题模式</Title>
                    <Text type="secondary">
                        选择您喜欢的主题模式，或设置为跟随系统自动切换
                    </Text>
                </div>

                <Divider />

                <Radio.Group
                    value={themeMode}
                    onChange={handleModeChange}
                    options={themeOptions}
                    optionType="button"
                    buttonStyle="solid"
                    style={{ width: '100%' }}
                />

                <div style={{ marginTop: 16 }}>
                    <Text type="secondary">
                        当前模式：{getThemeModeText()}
                    </Text>
                    <br />
                    <Text type="secondary">
                        当前显示：{currentTheme === 'dark' ? '暗黑主题' : '亮色主题'}
                    </Text>
                </div>
            </Space>
        </Card>
    );
};

export default ThemeSettings;
