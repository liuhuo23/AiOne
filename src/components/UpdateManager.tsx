import React, { useState, useEffect } from 'react';
import { Button, Modal, Progress, notification, Space, Typography, Divider } from 'antd';
import { DownloadOutlined, CloudDownloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

const { Text, Title } = Typography;

interface UpdateInfo {
    version: string;
    date: string;
    body: string;
}

const UpdateManager: React.FC = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [checking, setChecking] = useState(false);

    // 检查更新
    const checkForUpdates = async (silent = false) => {
        try {
            setChecking(true);
            const update = await check();

            if (update?.available) {
                setUpdateAvailable(true);
                setUpdateInfo({
                    version: update.version,
                    date: update.date || '',
                    body: update.body || '暂无更新说明'
                });

                if (!silent) {
                    setShowModal(true);
                }

                notification.success({
                    message: '发现新版本',
                    description: `版本 ${update.version} 可用，点击查看详情`,
                    placement: 'topRight',
                    onClick: () => setShowModal(true)
                });
            } else {
                if (!silent) {
                    notification.info({
                        message: '已是最新版本',
                        description: '当前版本已是最新版本',
                        placement: 'topRight'
                    });
                }
            }
        } catch (error) {
            console.error('检查更新失败:', error);
            if (!silent) {
                notification.error({
                    message: '检查更新失败',
                    description: '无法检查更新，请稍后重试',
                    placement: 'topRight'
                });
            }
        } finally {
            setChecking(false);
        }
    };

    // 下载并安装更新
    const downloadAndInstall = async () => {
        try {
            setDownloading(true);
            setDownloadProgress(0);

            const update = await check();
            if (!update?.available) {
                throw new Error('没有可用更新');
            }

            // 开始下载
            let downloaded = 0;
            let contentLength = 0;
            await update.downloadAndInstall((event) => {
                switch (event.event) {
                    case 'Started':
                        contentLength = event.data.contentLength!;
                        console.log('开始下载，文件大小:', contentLength);
                        break;
                    case 'Progress':
                        downloaded += event.data.chunkLength!;
                        const progress = Math.round((downloaded / contentLength) * 100);
                        setDownloadProgress(progress);
                        break;
                    case 'Finished':
                        setDownloaded(true);
                        setDownloading(false);
                        console.log('下载完成');
                        break;
                }
            });

            notification.success({
                message: '更新下载完成',
                description: '应用将重启以完成更新',
                placement: 'topRight'
            });

            // 延迟2秒后重启应用
            setTimeout(async () => {
                await relaunch();
            }, 2000);

        } catch (error) {
            console.error('下载更新失败:', error);
            setDownloading(false);
            notification.error({
                message: '下载更新失败',
                description: '无法下载更新，请稍后重试',
                placement: 'topRight'
            });
        }
    };

    // 应用启动时自动检查更新
    useEffect(() => {
        // 延迟5秒后静默检查更新
        const timer = setTimeout(() => {
            checkForUpdates(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const formatUpdateBody = (body: string) => {
        // 简单的 markdown 格式化
        return body
            .split('\n')
            .map((line, index) => {
                if (line.startsWith('### ')) {
                    return <Title key={index} level={5}>{line.replace('### ', '')}</Title>;
                }
                if (line.startsWith('- ')) {
                    return <Text key={index}>• {line.replace('- ', '')}</Text>;
                }
                if (line.trim()) {
                    return <Text key={index}>{line}</Text>;
                }
                return <br key={index} />;
            });
    };

    return (
        <>
            <Space>
                <Button
                    icon={<CloudDownloadOutlined />}
                    onClick={() => checkForUpdates(false)}
                    loading={checking}
                >
                    检查更新
                </Button>

                {updateAvailable && !downloaded && (
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => setShowModal(true)}
                    >
                        有新版本可用
                    </Button>
                )}

                {downloaded && (
                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => relaunch()}
                    >
                        重启应用
                    </Button>
                )}
            </Space>

            <Modal
                title={`发现新版本 ${updateInfo?.version}`}
                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowModal(false)}>
                        稍后更新
                    </Button>,
                    <Button
                        key="download"
                        type="primary"
                        loading={downloading}
                        disabled={downloaded}
                        onClick={downloadAndInstall}
                        icon={downloaded ? <CheckCircleOutlined /> : <DownloadOutlined />}
                    >
                        {downloaded ? '已下载' : downloading ? '下载中...' : '立即更新'}
                    </Button>,
                ]}
                width={600}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {updateInfo?.date && (
                        <Text type="secondary">发布时间: {updateInfo.date}</Text>
                    )}

                    <Divider />

                    <div>
                        <Title level={5}>更新内容:</Title>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {updateInfo && formatUpdateBody(updateInfo.body)}
                        </div>
                    </div>

                    {downloading && (
                        <>
                            <Divider />
                            <div>
                                <Text>下载进度:</Text>
                                <Progress percent={downloadProgress} status="active" />
                            </div>
                        </>
                    )}
                </Space>
            </Modal>
        </>
    );
};

export default UpdateManager;
