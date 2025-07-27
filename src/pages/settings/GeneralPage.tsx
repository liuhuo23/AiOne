import React from 'react';
import { Card, Switch, Select, Typography, Space, Row, Col } from 'antd';
import { useSettings } from '@/store/AppStateContext';
import { useTranslation } from '@/hooks/useTranslation';

const { Option } = Select;

const GeneralPage: React.FC = () => {
    const { settings, setLanguage, setNotifications } = useSettings();
    const { t } = useTranslation();

    // 配置项列表自动生成
    const configItems = [
        {
            key: 'language',
            label: t('settings.language'),
            control: (
                <Select
                    value={settings.language}
                    onChange={setLanguage}
                    style={{ width: 120 }}
                >
                    <Option value="zh-CN">简体中文</Option>
                    <Option value="en-US">English</Option>
                </Select>
            ),
        },
        {
            key: 'notifications',
            label: t('settings.notifications') || '消息通知',
            control: (
                <Switch
                    checked={settings.notifications}
                    onChange={setNotifications}
                />
            ),
        },
        {
            key: 'log_level',
            label: t('settings.log_level') || '日志级别',
            control: (
                <Select
                    value={settings.log_level}
                    style={{ width: 120 }}
                    disabled
                >
                    <Option value="info">Info</Option>
                    <Option value="warn">Warn</Option>
                    <Option value="error">Error</Option>
                    <Option value="debug">Debug</Option>
                </Select>
            ),
        },
        {
            key: 'startup_page',
            label: t('settings.startup_page') || '启动页',
            control: (
                <Select
                    value={settings.startup_page}
                    style={{ width: 120 }}
                    disabled
                >
                    <Option value="/">首页</Option>
                    <Option value="/dashboard">仪表盘</Option>
                    <Option value="/user">用户管理</Option>
                </Select>
            ),
        },
    ];

    return (
        <div style={{
            padding: '24px',
            minHeight: '100%',
            height: 'auto'
        }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Typography.Title level={3}>通用设置</Typography.Title>
                    <Typography.Paragraph type="secondary">
                        配置应用的基本功能和行为设置
                    </Typography.Paragraph>
                </div>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card title={t('settings.app_settings')}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                {/* 语言设置 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>{t('settings.language')}</Typography.Text>
                                    <Select
                                        value={settings.language}
                                        onChange={setLanguage}
                                        style={{ width: 120 }}
                                    >
                                        <Option value="zh-CN">简体中文</Option>
                                        <Option value="en-US">English</Option>
                                    </Select>
                                </div>
                                {/* 通知开关 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>{t('settings.notifications') || '消息通知'}</Typography.Text>
                                    <Switch
                                        checked={settings.notifications}
                                        onChange={setNotifications}
                                    />
                                </div>
                                {/* 日志级别*/}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>{t('settings.log_level') || '日志级别'}</Typography.Text>
                                    <Select
                                        value={settings.log_level}
                                        style={{ width: 120 }}
                                    >
                                        <Option value="info">Info</Option>
                                        <Option value="warn">Warn</Option>
                                        <Option value="error">Error</Option>
                                        <Option value="debug">Debug</Option>
                                    </Select>
                                </div>
                                {/* 启动页 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>{t('settings.startup_page') || '启动页'}</Typography.Text>
                                    <Select
                                        value={settings.startup_page}
                                        style={{ width: 120 }}
                                    >
                                        <Option value="/">首页</Option>
                                        <Option value="/dashboard">仪表盘</Option>
                                        <Option value="/user">用户管理</Option>
                                    </Select>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default GeneralPage;
