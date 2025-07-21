import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const NotificationsPage = () => {
    return (
        <div className="page-container">
            <Card className="content-card">
                <Title level={2}>通知中心</Title>
                <Paragraph>
                    通知中心让您及时了解系统消息、任务提醒和重要更新。
                </Paragraph>
                <Paragraph>
                    功能包括：消息推送、提醒设置、历史记录、优先级管理等。
                </Paragraph>
                <Paragraph strong>
                    此功能模块正在开发中，敬请期待...
                </Paragraph>
            </Card>
        </div>
    );
};

export default NotificationsPage;
