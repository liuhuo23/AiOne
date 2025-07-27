import React from "react";
import { Card, Typography, Space } from "antd";
import UpdateManager from "@/components/UpdateManager";

const UpdatePage: React.FC = () => {
    return (
        <div style={{ minHeight: '100%' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="应用更新">
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <img src="/AiOne.png" alt="AiOne Logo" style={{ width: 48, height: 48, borderRadius: 8 }} />
                            <div>
                                <Typography.Title level={4} style={{ marginBottom: 0 }}>AiOne</Typography.Title>
                                <Typography.Text type="secondary">版本：0.1.0</Typography.Text>
                            </div>
                        </div>
                        <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
                            检查并安装应用更新，获取最新功能和修复。
                        </Typography.Paragraph>
                        <UpdateManager />
                        <Card type="inner" title="项目信息" style={{ marginTop: 16 }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>GitHub 仓库</Typography.Text>
                                    <a href="https://github.com/liuhuo23/AiOne" target="_blank" rel="noopener noreferrer">
                                        github.com/liuhuo23/AiOne
                                    </a>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>联系邮箱</Typography.Text>
                                    <a href="#" onClick={() => window.open("mailto:liuhuo2370@gmail.com")}>liuhuo2370@gmail.com</a>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>当前版本</Typography.Text>
                                    <Typography.Text>0.1.0</Typography.Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text strong>新版特性</Typography.Text>
                                    <Typography.Text type="success">优化界面，修复若干问题，支持自动更新</Typography.Text>
                                </div>
                            </Space>
                        </Card>
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default UpdatePage;

