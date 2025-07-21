import React from 'react';
import { Card, Switch, Select, Typography, Space, Row, Col } from 'antd';
import { useSettings } from '@/store/AppStateContext';
import { useTranslation } from '@/hooks/useTranslation';

const { Option } = Select;

const GeneralPage: React.FC = () => {
    const { settings, setLanguage, setAutoSave, setNotifications } = useSettings();
    const { t } = useTranslation();

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

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>{t('settings.auto_save')}</Typography.Text>
                                    <Switch
                                        checked={settings.autoSave}
                                        onChange={setAutoSave}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>通知提醒</Typography.Text>
                                    <Switch
                                        checked={settings.notifications}
                                        onChange={setNotifications}
                                    />
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
