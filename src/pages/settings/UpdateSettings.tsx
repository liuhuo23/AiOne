import React from 'react';
import { Card, Typography, Space } from 'antd';
import UpdateManager from '@/components/UpdateManager';

const UpdateSettings: React.FC = () => {
    return (
        <div style={{ minHeight: '100%' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="应用更新">
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Typography.Paragraph type="secondary">
                            检查并安装应用更新
                        </Typography.Paragraph>
                        <UpdateManager />
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default UpdateSettings;
