import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar } from 'antd';
import { UserOutlined, RiseOutlined, FallOutlined, EyeOutlined } from '@ant-design/icons';

interface DashboardProps { }

const DashboardPage: React.FC<DashboardProps> = () => {
    // 模拟数据
    const statistics = [
        {
            title: '总用户数',
            value: 1128,
            prefix: <UserOutlined />,
            valueStyle: { color: '#3f8600' },
        },
        {
            title: '活跃用户',
            value: 893,
            prefix: <EyeOutlined />,
            valueStyle: { color: '#1890ff' },
        },
        {
            title: '增长率',
            value: 9.3,
            precision: 1,
            suffix: '%',
            prefix: <RiseOutlined />,
            valueStyle: { color: '#cf1322' },
        },
        {
            title: '转化率',
            value: 32.1,
            precision: 1,
            suffix: '%',
            prefix: <FallOutlined />,
            valueStyle: { color: '#722ed1' },
        },
    ];

    const recentActivities = [
        {
            title: '新用户注册',
            description: '用户 张三 刚刚注册了账户',
            avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
            time: '2 分钟前',
        },
        {
            title: '系统更新',
            description: '系统已更新到 v2.1.0 版本',
            avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
            time: '1 小时前',
        },
        {
            title: '数据备份',
            description: '每日数据备份已完成',
            avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
            time: '3 小时前',
        },
        {
            title: '安全扫描',
            description: '系统安全扫描通过',
            avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
            time: '6 小时前',
        },
    ];

    return (
        <div className="page-container">
            {/* 统计卡片 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {statistics.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card className="stat-card">
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                precision={stat.precision}
                                valueStyle={stat.valueStyle}
                                prefix={stat.prefix}
                                suffix={stat.suffix}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                {/* 进度指标 */}
                <Col xs={24} lg={12}>
                    <Card title="系统性能监控" className="content-card">
                        <div style={{ marginBottom: '20px' }}>
                            <p>CPU 使用率</p>
                            <Progress percent={30} status="active" />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <p>内存使用率</p>
                            <Progress percent={50} status="active" strokeColor="#52c41a" />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <p>磁盘使用率</p>
                            <Progress percent={70} status="active" strokeColor="#1890ff" />
                        </div>
                        <div>
                            <p>网络使用率</p>
                            <Progress percent={85} status="active" strokeColor="#faad14" />
                        </div>
                    </Card>
                </Col>

                {/* 最近活动 */}
                <Col xs={24} lg={12}>
                    <Card title="最近活动" className="content-card">
                        <List
                            itemLayout="horizontal"
                            dataSource={recentActivities}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} />}
                                        title={item.title}
                                        description={
                                            <div>
                                                <div>{item.description}</div>
                                                <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                                                    {item.time}
                                                </div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;
