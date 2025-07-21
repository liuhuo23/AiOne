import React from 'react';
import { Card, Switch, Slider, Select, Button, Typography, Row, Col, Space, message } from 'antd';
import { useTheme, useSettings, useWindowState, useLoading } from '../store/AppStateContext';
import { useTranslation } from '../hooks/useTranslation';
import ThemeSettings from '../components/ThemeSettings';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const SettingsPage: React.FC = () => {
    const { theme, setPrimaryColor, setSiderWidth } = useTheme();
    const { settings, setLanguage, setAutoSave, setNotifications } = useSettings();
    const { window } = useWindowState();
    const { loading, setGlobalLoading } = useLoading();
    const { t } = useTranslation();

    // 主题色选项
    const themeColors = [
        { label: t('settings.colors.fresh_green'), value: '#11998e' },
        { label: t('settings.colors.classic_blue'), value: '#1890ff' },
        { label: t('settings.colors.vibrant_purple'), value: '#722ed1' },
        { label: t('settings.colors.warm_orange'), value: '#fa8c16' },
        { label: t('settings.colors.rose_red'), value: '#eb2f96' },
    ];

    const handleSaveSettings = async () => {
        setGlobalLoading(true);
        try {
            // 模拟保存设置到服务器
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success(t('settings.save_success'));
        } catch (error) {
            message.error(t('settings.save_failed'));
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleResetSettings = () => {
        setPrimaryColor('#11998e');
        setSiderWidth(60);
        setLanguage('zh-CN');
        setAutoSave(true);
        setNotifications(true);
        message.info(t('settings.reset_success'));
    };

    return (
        <div className="page-container">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Title level={2}>{t('settings.title')}</Title>
                    <Paragraph type="secondary">
                        {t('settings.description')}
                    </Paragraph>
                </div>

                <Row gutter={[16, 16]}>
                    {/* 主题模式设置 */}
                    <Col xs={24} lg={12}>
                        <ThemeSettings />
                    </Col>

                    {/* 主题色彩设置 */}
                    <Col xs={24} lg={12}>
                        <Card title={t('settings.appearance')}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div>
                                    <Typography.Text strong>{t('settings.theme_color')}</Typography.Text>
                                    <Select
                                        value={theme.primaryColor}
                                        onChange={(color) => {
                                            setPrimaryColor(color);
                                            document.documentElement.style.setProperty('--current-app-bg', color);
                                        }}
                                        style={{ width: '100%', marginTop: 8 }}
                                        placeholder={t('settings.theme_color')}
                                    >
                                        {themeColors.map(color => (
                                            <Option key={color.value} value={color.value}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            backgroundColor: color.value,
                                                            borderRadius: 2,
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    {color.label}
                                                </div>
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <Typography.Text strong>{t('settings.sider_width')}: {theme.siderWidth}px</Typography.Text>
                                    <Slider
                                        min={50}
                                        max={120}
                                        value={theme.siderWidth}
                                        onChange={setSiderWidth}
                                        style={{ marginTop: 8 }}
                                    />
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    {/* 应用设置 */}
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

                    {/* 窗口状态信息 */}
                    <Col xs={24} lg={12}>
                        <Card title="窗口状态">
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>窗口状态</Typography.Text>
                                    <Typography.Text type={window.isMaximized ? 'success' : 'secondary'}>
                                        {window.isMaximized ? '最大化' : '正常大小'}
                                    </Typography.Text>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>拖拽状态</Typography.Text>
                                    <Typography.Text type={window.isDragging ? 'warning' : 'secondary'}>
                                        {window.isDragging ? '拖拽中' : '静止'}
                                    </Typography.Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    {/* 操作按钮 */}
                    <Col xs={24} lg={12}>
                        <Card title="操作">
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Button
                                    type="primary"
                                    block
                                    loading={loading.global}
                                    onClick={handleSaveSettings}
                                >
                                    保存所有设置
                                </Button>
                                <Button
                                    block
                                    onClick={handleResetSettings}
                                    disabled={loading.global}
                                >
                                    重置为默认设置
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default SettingsPage;
