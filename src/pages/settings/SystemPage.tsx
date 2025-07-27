import React from 'react';
import { Card, Typography, Space, Row, Col, Button, message } from 'antd';
import { useLoading } from '@/store/AppStateContext';
import { useOptimizedWindowState } from '@/hooks/useOptimizedWindowState';

const SystemPage: React.FC = () => {
    const { isMaximized, isDragging } = useOptimizedWindowState();
    const { loading, setGlobalLoading } = useLoading();

    const handleSaveSettings = async () => {
        setGlobalLoading(true);
        try {
            // 模拟保存设置到服务器
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('设置保存成功');
        } catch (error) {
            message.error('设置保存失败');
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleResetSettings = () => {
        message.info('设置已重置为默认值');
    };

    return (
        <div style={{ minHeight: '100%' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Typography.Title level={3}>系统信息</Typography.Title>
                    <Typography.Paragraph type="secondary">
                        查看应用和系统的运行状态信息
                    </Typography.Paragraph>
                </div>
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card title="窗口状态">
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>窗口状态</Typography.Text>
                                    <Typography.Text type={isMaximized ? 'success' : 'secondary'}>
                                        {isMaximized ? '最大化' : '正常大小'}
                                    </Typography.Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>拖拽状态</Typography.Text>
                                    <Typography.Text type={isDragging ? 'warning' : 'secondary'}>
                                        {isDragging ? '拖拽中' : '静止'}
                                    </Typography.Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="应用信息">
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>应用名称</Typography.Text>
                                    <Typography.Text>AiOne</Typography.Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>版本</Typography.Text>
                                    <Typography.Text>0.1.0</Typography.Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>构建环境</Typography.Text>
                                    <Typography.Text>Tauri + React</Typography.Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24}>
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

export default SystemPage;
