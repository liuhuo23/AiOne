import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const DocumentsPage = () => {
    return (
        <div className="page-container">
            <Card className="content-card">
                <Title level={2}>文档管理</Title>
                <Paragraph>
                    文档管理系统让您能够轻松管理和组织所有文档。
                </Paragraph>
                <Paragraph>
                    功能包括：文档上传、分类管理、版本控制、搜索等。
                </Paragraph>
                <Paragraph strong>
                    此功能模块正在开发中，敬请期待...
                </Paragraph>
            </Card>
        </div>
    );
};

export default DocumentsPage;
