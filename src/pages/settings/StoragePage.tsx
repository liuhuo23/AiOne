import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Row, Col, Button } from 'antd';
import { FolderOpenOutlined, CopyOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/core';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { useNotifications } from '@/store/AppStateContext';
import { getConfigLocation } from '@/store/fileStorage';
// import { useNotificationPosition } from '@/hooks/useNotificationPosition';
interface StorageInfo {
    app_data_dir: string | null;
    app_config_dir: string | null;
    app_cache_dir: string | null;
    app_local_data_dir: string | null;
    app_log_dir: string | null;
}

const StoragePage: React.FC = () => {
    const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [configLocation, setConfigLocation] = useState<string>('');

    const { error, success } = useNotifications();
    // useNotificationPosition('top'); // 设置通知位置为居中上方
    const fetchStorageInfo = async () => {
        setLoading(true);
        try {
            const info = await invoke<StorageInfo>('get_storage_locations');
            setStorageInfo(info);

            // 获取配置文件位置
            const location = await getConfigLocation();
            setConfigLocation(location);

            success('存储位置信息已更新');
        } catch (err) {
            error('错误', '获取存储位置失败: ' + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStorageInfo();
    }, []);

    const copyToClipboard = async (text: string) => {
        try {
            await writeText(text);
            success('复制成功', '路径已复制到剪贴板');
        } catch (err) {
            error('复制失败', `无法复制到剪贴板: ${String(err)}`);

            // 备用方案：尝试使用浏览器原生 API
            try {
                await navigator.clipboard.writeText(text);
                success('复制成功', '路径已复制到剪贴板（使用备用方案）');
            } catch (fallbackErr) {
                console.error('备用复制方案也失败:', fallbackErr);
                error('复制失败', '所有复制方案都失败了');
            }
        }
    };



    const openFolder = async (path: string) => {
        try {
            await invoke('open_folder', { path });
            success('文件夹已打开');
        } catch (err) {
            error('打开失败', '无法打开文件夹: ' + err);
        }
    };

    const StorageItem: React.FC<{ title: string; path: string | null; description: string }> = ({ title, path, description }) => (
        <Card size="small" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <Typography.Text strong>{title}</Typography.Text>
                    <Typography.Paragraph type="secondary" style={{ fontSize: 12, margin: '4px 0' }}>
                        {description}
                    </Typography.Paragraph>
                    <Typography.Text code style={{ fontSize: 12, wordBreak: 'break-all' }}>
                        {path || '未设置'}
                    </Typography.Text>
                </div>
                {path && (
                    <Space>
                        <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(path)}
                        />
                        <Button
                            type="text"
                            size="small"
                            icon={<FolderOpenOutlined />}
                            onClick={() => openFolder(path)}
                        />
                    </Space>
                )}
            </div>
        </Card>
    );

    return (
        <div style={{
            padding: '24px',
            minHeight: '100%',
            height: 'auto'
        }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Typography.Title level={3}>存储位置</Typography.Title>
                    <Typography.Paragraph type="secondary">
                        查看应用数据的存储位置信息
                    </Typography.Paragraph>
                </div>

                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Card
                            title="应用存储目录"
                            loading={loading}
                            extra={
                                <Button
                                    size="small"
                                    onClick={fetchStorageInfo}
                                    loading={loading}
                                >
                                    刷新
                                </Button>
                            }
                        >
                            {storageInfo && (
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <StorageItem
                                        title="应用数据目录"
                                        path={storageInfo.app_data_dir}
                                        description="存储应用的用户数据和设置"
                                    />
                                    <StorageItem
                                        title="配置目录"
                                        path={storageInfo.app_config_dir}
                                        description="存储应用的配置文件"
                                    />
                                    <StorageItem
                                        title="缓存目录"
                                        path={storageInfo.app_cache_dir}
                                        description="存储临时文件和缓存数据"
                                    />
                                    <StorageItem
                                        title="本地数据目录"
                                        path={storageInfo.app_local_data_dir}
                                        description="存储应用的本地数据文件"
                                    />
                                    <StorageItem
                                        title="日志目录"
                                        path={storageInfo.app_log_dir}
                                        description="存储应用的日志文件"
                                    />
                                </Space>
                            )}
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Card
                            title="设置保存位置"
                            size="small"
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <Typography.Text strong>当前设置保存方式：</Typography.Text>
                                    <Typography.Text style={{ marginLeft: 8 }}>文件存储（推荐）</Typography.Text>
                                </div>
                                <StorageItem
                                    title="设置文件位置"
                                    path={configLocation || storageInfo?.app_config_dir + '/settings.json'}
                                    description="应用的主题、语言等设置信息保存在此文件中，支持备份和迁移"
                                />
                                <Typography.Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
                                    💡 提示：设置会自动保存到配置文件中，你可以备份此文件来保存你的个性化设置。
                                </Typography.Paragraph>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default StoragePage;
