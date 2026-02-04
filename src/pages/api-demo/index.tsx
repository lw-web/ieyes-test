/**
 * API 请求示例页面
 */
import React, { FC, useState } from 'react';
import { Card, Button, Input, Form, Space, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// @ts-ignore
import { login, getUserList, createUser, updateUser, deleteUser } from '@/services';
// @ts-ignore
import type { LoginParams } from '@/services';

const { Title, Paragraph, Text } = Typography;

const ApiDemoPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loginForm] = Form.useForm();

  // 登录示例
  const handleLogin = async (values: LoginParams) => {
    setLoading(true);
    try {
      const result = await login(values);
      // 存储 token 到 localStorage
      localStorage.setItem('token', result.token);
      message.success('登录成功！');
      setUserData(result.userInfo);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取用户列表示例
  const handleGetUserList = async () => {
    setLoading(true);
    try {
      const result = await getUserList({ current: 1, pageSize: 10 });
      message.success(`获取成功，共 ${result.total} 条数据`);
      console.log('用户列表:', result);
      setUserData(result);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建用户示例
  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const result = await createUser({
        username: 'test_user',
        nickname: '测试用户',
        email: 'test@example.com',
      });
      message.success('创建成功！');
      console.log('创建的用户:', result);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新用户示例
  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      const result = await updateUser(1, {
        nickname: '更新后的昵称',
      });
      message.success('更新成功！');
      console.log('更新后的用户:', result);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除用户示例
  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await deleteUser(1);
      message.success('删除成功！');
    } catch (error) {
      message.error(error instanceof Error ? error.message : '删除失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 16 }}>
        <Title level={2}>API 请求示例</Title>
        <Paragraph>
          本页面演示如何使用封装的 <code>fetch</code> 请求方法进行 API 调用。
        </Paragraph>
      </Card>

      <Alert
        message="提示"
        description="当前使用 Mock 数据，实际使用时请替换为真实的 API 地址。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* 登录示例 */}
      <Card title="登录示例" style={{ marginBottom: 16 }}>
        <Form form={loginForm} onFinish={handleLogin} style={{ maxWidth: 400 }}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* CRUD 示例 */}
      <Card title="CRUD 操作示例">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>
            <Button type="primary" onClick={handleGetUserList} loading={loading}>
              获取用户列表
            </Button>
            <Button onClick={handleCreateUser} loading={loading}>
              创建用户
            </Button>
            <Button onClick={handleUpdateUser} loading={loading}>
              更新用户
            </Button>
            <Button danger onClick={handleDeleteUser} loading={loading}>
              删除用户
            </Button>
          </Space>

          {/* 响应数据展示 */}
          {userData && (
            <Card title="响应数据" size="small" style={{ marginTop: 16 }}>
              <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            </Card>
          )}
        </Space>
      </Card>

      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>1. 请求封装位置：</Text>
            <Paragraph code>src/services/request.ts</Paragraph>
          </div>
          <div>
            <Text strong>2. API 定义位置：</Text>
            <Paragraph code>src/services/user.ts</Paragraph>
          </div>
          <div>
            <Text strong>3. 使用方式：</Text>
            <Paragraph>
              <pre>{`import { login, getUserList } from '@/services';

// 调用 API
const result = await login({ username, password });
const list = await getUserList({ current: 1, pageSize: 10 });`}</pre>
            </Paragraph>
          </div>
          <div>
            <Text strong>4. 功能特性：</Text>
            <ul>
              <li>自动从 localStorage/sessionStorage 获取 token 并添加到请求头</li>
              <li>统一处理常见错误码（401、403、404、500 等）</li>
              <li>自动解析 JSON 响应，返回 data 字段</li>
              <li>支持 GET、POST、PUT、DELETE、表单提交等请求方式</li>
            </ul>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ApiDemoPage;
