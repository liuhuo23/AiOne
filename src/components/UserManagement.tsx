import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    createTime: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            name: '张三',
            email: 'zhangsan@example.com',
            role: '管理员',
            status: 'active',
            createTime: '2024-01-15',
        },
        {
            id: '2',
            name: '李四',
            email: 'lisi@example.com',
            role: '用户',
            status: 'active',
            createTime: '2024-02-10',
        },
        {
            id: '3',
            name: '王五',
            email: 'wangwu@example.com',
            role: '用户',
            status: 'inactive',
            createTime: '2024-03-05',
        },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <Space>
                    <UserOutlined />
                    {text}
                </Space>
            ),
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color={role === '管理员' ? 'red' : 'blue'}>{role}</Tag>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'default'}>
                    {status === 'active' ? '活跃' : '非活跃'}
                </Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个用户吗？',
            onOk() {
                setUsers(users.filter(user => user.id !== id));
                message.success('删除成功');
            },
        });
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingUser) {
                // 编辑用户
                setUsers(users.map(user =>
                    user.id === editingUser.id
                        ? { ...user, ...values }
                        : user
                ));
                message.success('用户更新成功');
            } else {
                // 添加新用户
                const newUser: User = {
                    id: Date.now().toString(),
                    ...values,
                    createTime: new Date().toISOString().split('T')[0],
                };
                setUsers([...users, newUser]);
                message.success('用户创建成功');
            }
            setIsModalVisible(false);
        } catch (error) {
            message.error('操作失败');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card
                title="用户管理"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        添加用户
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                    }}
                />
            </Card>

            <Modal
                title={editingUser ? '编辑用户' : '添加用户'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                    >
                        <Input placeholder="请输入姓名" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                        ]}
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="角色"
                        rules={[{ required: true, message: '请选择角色' }]}
                    >
                        <Select placeholder="请选择角色">
                            <Option value="管理员">管理员</Option>
                            <Option value="用户">用户</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="状态"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select placeholder="请选择状态">
                            <Option value="active">活跃</Option>
                            <Option value="inactive">非活跃</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingUser ? '更新' : '创建'}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>
                                取消
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
