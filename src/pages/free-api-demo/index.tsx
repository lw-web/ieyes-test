/**
 * 免费测试 API 演示页面
 * 展示各类免费 API 的调用效果
 */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tabs, List, Tag, Avatar, Button, Spin, Space, Typography, Statistic } from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  ReadOutlined,
  BarChartOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
// @ts-ignore
import {
  fetchPosts,
  fetchProducts,
  fetchRandomUsers,
  transformRandomUser,
  fetchCategories,
  fetchCatFact,
  fetchDashboardData,
} from '@/services/free-apis';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;

interface FreeApiDemoProps {}

const FreeApiDemo: React.FC<FreeApiDemoProps> = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [catFact, setCatFact] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);

  // 加载所有数据
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [postsData, productsData, usersData, categoriesData, factData, dashboardData] =
        await Promise.all([
          fetchPosts(1, 10),
          fetchProducts(8),
          fetchRandomUsers(10, ['us', 'gb', 'cn']),
          fetchCategories(),
          fetchCatFact(),
          fetchDashboardData(),
        ]);

      setPosts(postsData);
      setProducts(productsData);
      setUsers(usersData.results?.map(transformRandomUser) || []);
      setCategories(categoriesData);
      setCatFact(factData);
      setDashboard(dashboardData);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>🌐 免费测试 API 演示</Title>
        <Paragraph type="secondary">
          使用以下免费 API 服务，无需后端即可测试前端功能
        </Paragraph>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={loadAllData}
          loading={loading}
        >
          刷新数据
        </Button>
      </div>

      <Spin spinning={loading}>
        <Tabs
          defaultActiveKey="dashboard"
          items={[
            {
              key: 'dashboard',
              label: (
                <span>
                  <BarChartOutlined />
                  仪表板
                </span>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card>
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Statistic title="文章数量" value={posts.length} suffix="篇" />
                        <Statistic title="商品数量" value={products.length} suffix="件" />
                        <Statistic title="用户数量" value={users.length} suffix="人" />
                      </Space>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'posts',
              label: (
                <span>
                  <ReadOutlined />
                  文章 (JSONPlaceholder)
                </span>
              ),
              children: (
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
                  dataSource={posts}
                  renderItem={item => (
                    <List.Item>
                      <Card
                        size="small"
                        title={<Text ellipsis>{item.title}</Text>}
                        hoverable
                      >
                        <Paragraph
                          ellipsis={{ rows: 3 }}
                          type="secondary"
                          style={{ marginBottom: 0 }}
                        >
                          {item.body}
                        </Paragraph>
                      </Card>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'products',
              label: (
                <span>
                  <ShoppingOutlined />
                  商品 (Fake Store API)
                </span>
              ),
              children: (
                <>
                  <Space style={{ marginBottom: 16 }} wrap>
                    {categories.map(cat => (
                      <Tag key={cat} color="blue">
                        {cat}
                      </Tag>
                    ))}
                  </Space>
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
                    dataSource={products}
                    renderItem={item => (
                      <List.Item>
                        <Card
                          size="small"
                          cover={
                            <div
                              style={{
                                height: 150,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 8,
                              }}
                            >
                              <img
                                alt={item.title}
                                src={item.image}
                                style={{ maxHeight: '100%', maxWidth: '100%' }}
                              />
                            </div>
                          }
                          hoverable
                        >
                          <Card.Meta
                            title={
                              <Text ellipsis={{ tooltip: item.title }} style={{ fontSize: 12 }}>
                                {item.title}
                              </Text>
                            }
                            description={
                              <Space direction="vertical" size={0}>
                                <Tag color="green">${item.price.toFixed(2)}</Tag>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  ⭐ {item.rating.rate} ({item.rating.count})
                                </Text>
                              </Space>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                </>
              ),
            },
            {
              key: 'users',
              label: (
                <span>
                  <UserOutlined />
                  用户 (RandomUser.me)
                </span>
              ),
              children: (
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
                  dataSource={users}
                  renderItem={user => (
                    <List.Item>
                      <Card size="small">
                        <Card.Meta
                          avatar={<Avatar src={user.avatar} />}
                          title={user.nickname}
                          description={
                            <Space direction="vertical" size={0}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                @{user.username}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                {user.email}
                              </Text>
                            </Space>
                          }
                        />
                      </Card>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'fun',
              label: '🎲 趣味 API',
              children: (
                <Card>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                      <Title level={4}>🐱 猫咪冷知识</Title>
                      <Paragraph>{catFact?.fact || '加载中...'}</Paragraph>
                      <Text type="secondary">长度: {catFact?.length || 0} 字符</Text>
                    </div>
                  </Space>
                </Card>
              ),
            },
          ]}
        />
      </Spin>

      <Card style={{ marginTop: 24 }} title="📚 API 文档">
        <Paragraph>
          <Text strong>JSONPlaceholder</Text> -{' '}
          <a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noopener">
            jsonplaceholder.typicode.com
          </a>
          <br />
          提供文章、评论、用户、相册等数据，支持 RESTful 操作
        </Paragraph>
        <Paragraph>
          <Text strong>Fake Store API</Text> -{' '}
          <a href="https://fakestoreapi.com/" target="_blank" rel="noopener">
            fakestoreapi.com
          </a>
          <br />
          电商数据，包含商品、分类、购物车、用户等
        </Paragraph>
        <Paragraph>
          <Text strong>Random User Generator</Text> -{' '}
          <a href="https://randomuser.me/" target="_blank" rel="noopener">
            randomuser.me
          </a>
          <br />
          生成随机用户数据，支持按国籍筛选
        </Paragraph>
        <Paragraph>
          <Text strong>Cat Facts</Text> -{' '}
          <a href="https://catfact.ninja/" target="_blank" rel="noopener">
            catfact.ninja
          </a>
          <br />
          随机猫咪冷知识
        </Paragraph>
      </Card>
    </div>
  );
};

export default FreeApiDemo;
