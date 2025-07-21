import React from 'react';
import { Card, Slider, Select, Typography, Row, Col, Space } from 'antd';
import { useTheme } from '@/store/AppStateContext';
import { useTranslation } from '@/hooks/useTranslation';
import ThemeSettings from '@/components/ThemeSettings';

const { Option } = Select;

const AppearancePage: React.FC = () => {
    const { theme, setPrimaryColor, setSiderWidth } = useTheme();
    const { t } = useTranslation();

    // 主题色选项
    const themeColors = [
        { label: t('settings.colors.fresh_green'), value: '#11998e' },
        { label: t('settings.colors.classic_blue'), value: '#1890ff' },
        { label: t('settings.colors.vibrant_purple'), value: '#722ed1' },
        { label: t('settings.colors.warm_orange'), value: '#fa8c16' },
        { label: t('settings.colors.rose_red'), value: '#eb2f96' },
    ];

    return (
        <div style={{
            padding: '24px',
            minHeight: '100%',
            height: 'auto'
        }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Typography.Title level={3}>外观显示</Typography.Title>
                    <Typography.Paragraph type="secondary">
                        自定义应用的主题、颜色和布局设置
                    </Typography.Paragraph>
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
                </Row>
            </Space>
        </div>
    );
};

export default AppearancePage;
