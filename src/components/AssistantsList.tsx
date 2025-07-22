import React, { useState } from 'react';
import axios from 'axios';

interface AssistantsListProps { }

const AssistantsList: React.FC<AssistantsListProps> = () => {
    const [networkStatus, setNetworkStatus] = useState<string>('未开始测试');
    const [responseData, setResponseData] = useState<string>('');

    const testNetwork = async () => {
        setNetworkStatus('测试中...');
        try {
            // 使用公共API测试网络连接
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
            setNetworkStatus('网络访问成功');
            setResponseData(JSON.stringify(response.data, null, 2));
        } catch (error) {
            setNetworkStatus('网络访问失败');
            setResponseData(`错误信息: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <h2>Tauri 网络访问测试</h2>
            <button
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#1890ff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
                onClick={testNetwork}
            >
                测试网络访问
            </button>
            <div style={{
                margin: '20px 0',
                padding: '15px',
                borderRadius: '8px',
                border: `1px solid ${networkStatus.includes('成功') ? '#b7eb8f' : networkStatus.includes('失败') ? '#ffccc7' : '#d9d9d9'}`
            }}>
                <strong>状态:</strong> {networkStatus}
            </div>
            <div style={{
                marginTop: '20px',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
            }}>
                <strong>响应数据:</strong>
                <br />
                {responseData || '无数据'}
            </div>
        </div>
    );
};

export default AssistantsList;