import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const DatabasePage = () => {
    return (
        <div className="page-container">
            <Card className="content-card">
                <Title level={2}>数据管理</Title>
                <Paragraph>
                    数据管理中心帮助您管理和分析应用程序的所有数据。
                </Paragraph>
                <Paragraph>
                    功能包括：数据导入导出、数据可视化、统计分析、备份恢复等。
                </Paragraph>
                <Paragraph strong>
                    此功能模块正在开发中，敬请期待...
                </Paragraph>
            </Card>
        </div>
    );
};

export default DatabasePage;
