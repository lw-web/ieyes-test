/**
 * API 请求示例页面
 * 演示封装的 fetch 请求方法进行 API 调用
 */

import React, { FC, useState } from 'react';
import { Card, Button, Input, Form, Space, Typography, message, Alert, Row, Col } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CodeOutlined,
  SafetyOutlined,
  ApiOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
// @ts-ignore
import { login, getUserList, createUser, updateUser, deleteUser } from '@/services';
// @ts-ignore
import type { LoginParams } from '@/services';
import PageLayout from '@/components/PageLayout';

const { Text, Paragraph } = Typography;

const ApiDemoPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loginForm] = Form.useForm();

  // 登录示例
  const handleLogin = async (values: LoginParams) => {
    setLoading(true);
    try {
      const result = await login(values);
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
      setUserData(result);
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
      setUserData(result);
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
    <PageLayout
      title="API 请求封装 - Fetch Demo"
      description="本页面演示如何使用封装的 fetch 请求方法进行 API 调用，包含登录、CRUD 操作、统一错误处理等功能。"
      breadcrumbs={[{ label: 'API 请求 Demo' }]}
    >
      <Row gutter={[24, 24]}>
        {/* 登录示例 */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <LoginOutlined />
                登录示例
              </Space>
            }
            className="api-card api-card--login"
          >
            <Form
              form={loginForm}
              onFinish={handleLogin}
              layout="vertical"
              className="login-form"
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  icon={<LoginOutlined />}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* CRUD 操作 */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <ApiOutlined />
                CRUD 操作示例
              </Space>
            }
            className="api-card"
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Space wrap>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleGetUserList}
                  loading={loading}
                  className="api-btn api-btn--read"
                >
                  获取用户列表
                </Button>
                <Button
                  icon={<PlusOutlined />}
                  onClick={handleCreateUser}
                  loading={loading}
                  className="api-btn api-btn--create"
                >
                  创建用户
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={handleUpdateUser}
                  loading={loading}
                  className="api-btn api-btn--update"
                >
                  更新用户
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteUser}
                  loading={loading}
                  className="api-btn api-btn--delete"
                >
                  删除用户
                </Button>
              </Space>

              {/* 响应数据展示 */}
              {userData && (
                <Card
                  title={
                    <Space>
                      <CodeOutlined />
                      响应数据
                    </Space>
                  }
                  size="small"
                  className="response-card"
                >
                  <pre className="response-data">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </Card>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 功能特性 */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined />
            功能特性
          </Space>
        }
        className="features-card"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <div className="feature-item">
              <div className="feature-icon feature-icon--auth">
                <SafetyOutlined />
              </div>
              <h4>自动 Token</h4>
              <p>从 localStorage/sessionStorage 自动获取并添加到请求头</p>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="feature-item">
              <div className="feature-icon feature-icon--error">
                <ApiOutlined />
              </div>
              <h4>错误处理</h4>
              <p>统一处理 401、403、404、500 等常见错误码</p>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="feature-item">
              <div className="feature-icon feature-icon--json">
                <CodeOutlined />
              </div>
              <h4>JSON 解析</h4>
              <p>自动解析 JSON 响应，返回 data 字段</p>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="feature-item">
              <div className="feature-icon feature-icon--methods">
                <ApiOutlined />
              </div>
              <h4>多种请求</h4>
              <p>支持 GET、POST、PUT、DELETE、表单提交等</p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 使用说明 */}
      <Card
        title={
          <Space>
            <CodeOutlined />
            使用说明
          </Space>
        }
        className="usage-card"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="usage-item">
              <Text strong>1. 请求封装位置：</Text>
              <Paragraph code>src/services/request.ts</Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="usage-item">
              <Text strong>2. API 定义位置：</Text>
              <Paragraph code>src/services/user.ts</Paragraph>
            </div>
          </Col>
        </Row>
        <div className="usage-code">
          <Text strong>3. 使用方式：</Text>
          <pre>{`import { login, getUserList } from '@/services';

// 调用 API
const result = await login({ username, password });
const list = await getUserList({ current: 1, pageSize: 10 });`}</pre>
        </div>
      </Card>
    </PageLayout>
  );
};

export default ApiDemoPage;
