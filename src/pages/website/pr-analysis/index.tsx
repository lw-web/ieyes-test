/**
 * PR Analysis Page - AI模型PR智能推荐用例分析页面
 * 包含打字机效果、步骤依次显示、表格逐行动画
 */

import React, { FC, useState, useEffect, useRef } from 'react';
import { Typography, Card, Table, Tag, Row, Col, Space } from 'antd';
import { BulbOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, MoonOutlined } from '@ant-design/icons';
import { WebsiteNav, WebsiteFooter } from '@/components/WebsiteLayout';
import './index.less';

const { Title, Text } = Typography;

interface TestCase {
  id: string;
  name: string;
  dtsId: string;
  type: string;
}

interface RecommendedCase {
  id: string;
  name: string;
  module: string;
  priority: string;
  reason: string;
}

// 思考内容数据
const thinkingContent = {
  step1: '查询PR信息：分析PR提交代码涉及的子系统为用户认证模块和数据处理模块，主要影响的API包括用户登录接口(/api/auth/login)、用户信息获取接口(/api/user/info)和数据提交接口(/api/data/submit)。',
  step2: '历史影响分析：通过PR提交代码改动的文件UserAuth.java和DataProcessor.js，查询到历史上关联的DTS问题单共3个，分别是DTS20230512、DTS20230618和DTS20230805。分析发现这些DTS单主要影响了用户登录验证用例、数据格式校验用例和权限控制用例。',
  step3: '总结：综合分析结果，形成风险评估和用例推荐。',
};

// 风险总结数据
const riskSummary = {
  historyRisk: '历史上类似修改曾导致2次登录验证失败问题和1次数据格式错误问题，主要集中在用户认证模块的边界条件处理上。',
  impactRisk: '本次修改可能影响用户登录流程和数据提交功能，特别是在高并发场景下可能出现性能瓶颈，建议重点关注相关用例的执行情况。',
};

// 推荐用例数据
const recommendedCases: RecommendedCase[] = [
  {
    id: 'UC-2023-001',
    name: '用户登录验证测试',
    module: '用户认证',
    priority: '高',
    reason: '涉及修改的登录接口核心功能',
  },
  {
    id: 'UC-2023-005',
    name: '数据格式校验测试',
    module: '数据处理',
    priority: '高',
    reason: '与修改的数据处理逻辑直接相关',
  },
  {
    id: 'UC-2023-012',
    name: '权限控制边界测试',
    module: '用户认证',
    priority: '中',
    reason: '历史问题高发区域',
  },
  {
    id: 'UC-2023-024',
    name: '高并发登录性能测试',
    module: '用户认证',
    priority: '中',
    reason: '潜在性能风险点',
  },
  {
    id: 'UC-2023-036',
    name: '异常数据提交测试',
    module: '数据处理',
    priority: '中',
    reason: '涉及修改的数据验证逻辑',
  },
];

// 测试用例表格数据
const testCases: TestCase[] = [
  { id: 'TC-001', name: '高负载内存泄漏测试', dtsId: 'DTS20240515001', type: '性能测试' },
  { id: 'TC-002', name: '网络稳定性测试', dtsId: 'DTS20240520003', type: '功能测试' },
  { id: 'TC-003', name: '内存分配压力测试', dtsId: 'DTS20240515001', type: '压力测试' },
];

const PRAnalysisPage: FC = () => {
  // 动画状态
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedContent, setDisplayedContent] = useState({ step1: '', step2: '', step3: '' });
  const [showResult, setShowResult] = useState(false);
  const [typingComplete, setTypingComplete] = useState({ step1: false, step2: false, step3: false });
  const [riskText, setRiskText] = useState({ history: '', impact: '' });
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const [isTypingRisk, setIsTypingRisk] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // 打字机效果 Hook
  const useTypewriter = (text: string, speed: number = 30, callback?: () => void) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
      if (index < text.length) {
        const timeout = setTimeout(() => {
          setIndex(index + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else if (callback) {
        callback();
      }
    }, [index, text.length, speed, callback]);

    return text.substring(0, index);
  };

  // 启动动画序列
  useEffect(() => {
    const startAnimation = async () => {
      // 步骤1：显示第一个思考步骤
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentStep(1);

      // 步骤2：显示第二个思考步骤（包含子步骤）
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCurrentStep(2);

      // 步骤3：显示第三个思考步骤
      await new Promise(resolve => setTimeout(resolve, 5000));
      setCurrentStep(3);

      // 显示结果区域
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowResult(true);

      // 开始打字机效果显示风险
      setIsTypingRisk(true);
    };

    startAnimation();
  }, []);

  // 打字机效果 - 步骤1
  const step1Text = useTypewriter(
    currentStep >= 1 ? thinkingContent.step1 : '',
    30,
    () => setTypingComplete(prev => ({ ...prev, step1: true }))
  );

  // 打字机效果 - 步骤2
  const step2Text = useTypewriter(
    currentStep >= 2 ? thinkingContent.step2 : '',
    30,
    () => setTypingComplete(prev => ({ ...prev, step2: true }))
  );

  // 打字机效果 - 步骤3
  const step3Text = useTypewriter(
    currentStep >= 3 ? thinkingContent.step3 : '',
    30,
    () => setTypingComplete(prev => ({ ...prev, step3: true }))
  );

  // 风险文本打字机效果
  useEffect(() => {
    if (!isTypingRisk || !showResult) return;

    let historyIndex = 0;
    let impactIndex = 0;

    const historySpeed = 30;
    const impactSpeed = 30;

    const typeHistory = () => {
      if (historyIndex < riskSummary.historyRisk.length) {
        setRiskText(prev => ({
          ...prev,
          history: riskSummary.historyRisk.substring(0, historyIndex + 1)
        }));
        historyIndex++;
        setTimeout(typeHistory, historySpeed);
      } else {
        // 历史风险打完，开始影响风险
        setTimeout(typeImpact, 500);
      }
    };

    const typeImpact = () => {
      if (impactIndex < riskSummary.impactRisk.length) {
        setRiskText(prev => ({
          ...prev,
          impact: riskSummary.impactRisk.substring(0, impactIndex + 1)
        }));
        impactIndex++;
        setTimeout(typeImpact, impactSpeed);
      } else {
        // 风险打完，开始显示表格行
        startTableAnimation();
      }
    };

    setTimeout(typeHistory, 500);
  }, [isTypingRisk, showResult]);

  // 表格逐行动画
  const startTableAnimation = () => {
    recommendedCases.forEach((_, index) => {
      setTimeout(() => {
        setVisibleRows(prev => [...prev, index]);
      }, index * 300);
    });
  };

  // 测试用例表格列定义
  const testCaseColumns = [
    {
      title: '用例ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '用例名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '关联DTS单',
      dataIndex: 'dtsId',
      key: 'dtsId',
      width: 180,
    },
    {
      title: '测试类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
  ];

  // 推荐用例表格列定义
  const recommendedCasesColumns = [
    {
      title: '用例ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
    },
    {
      title: '用例名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '关联模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={priority === '高' ? 'red' : 'orange'}>{priority}</Tag>
      ),
    },
    {
      title: '推荐理由',
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  return (
    <div className="pr-analysis-page">
      {/* Navigation */}
      <WebsiteNav siteName="AI Analysis" theme="light" />

      {/* Main Content */}
      <div className="pr-analysis-container">
        {/* Page Title Area */}
        <div className="page-title-area">
          <Title level={1} className="page-title">AI模型PR智能推荐用例分析</Title>
        </div>

        {/* Thinking Process Area */}
        <div className="thinking-process-area">
          <Title level={2} className="section-title">
            <BulbOutlined className="title-icon" />
            推荐思考过程
          </Title>

          {/* Step 1 */}
          <Card
            className={`thinking-card ${currentStep >= 1 ? 'step-visible' : ''}`}
            bordered={false}
          >
            <div className="step-header">
              <div className="step-number">1</div>
              <Text strong className="step-title">查询PR信息</Text>
            </div>
            <div className="step-content">
              <Text>
                {step1Text}
                {currentStep >= 1 && step1Text.length < thinkingContent.step1.length && (
                  <span className="typing-cursor" />
                )}
              </Text>
            </div>
          </Card>

          {/* Step 2 */}
          <Card
            className={`thinking-card ${currentStep >= 2 ? 'step-visible' : ''}`}
            bordered={false}
          >
            <div className="step-header">
              <div className="step-number">2</div>
              <Text strong className="step-title">历史影响分析</Text>
            </div>

            {/* Sub-step 2.1 */}
            <div className={`sub-step ${currentStep >= 2 ? 'sub-step-visible' : ''}`}>
              <div className="sub-step-header">
                <div className="sub-step-number">2.1</div>
                <Text strong>查找PR变更文件和方法</Text>
              </div>
              <Card className="sub-step-content" bordered>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text><Text strong>变更文件：</Text>memory_manager.c, network_module.c</Text>
                  <Text><Text strong>变更方法：</Text>alloc_memory(), free_memory(), send_packet(), receive_packet()</Text>
                  <Text><Text strong>变更范围：</Text>内存管理模块、网络通信模块</Text>
                </Space>
              </Card>
            </div>

            {/* Sub-step 2.2 */}
            <div className={`sub-step ${currentStep >= 2 ? 'sub-step-visible' : ''}`}>
              <div className="sub-step-header">
                <div className="sub-step-number">2.2</div>
                <Text strong>查找变更代码相关联DTS问题单</Text>
              </div>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Card className="dts-issue-card" bordered>
                  <Title level={5}>DTS问题单 #DTS20240515001</Title>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text><Text strong>问题描述：</Text>设备在高负载情况下出现内存泄漏，导致系统崩溃。</Text>
                    <Text><Text strong>关联理由：</Text>本次PR修改了内存管理相关的核心函数，可能影响该问题的修复效果。</Text>
                    <Text><Text strong>涉及设备形态：</Text>服务器、边缘计算设备</Text>
                  </Space>
                </Card>
                <Card className="dts-issue-card" bordered>
                  <Title level={5}>DTS问题单 #DTS20240520003</Title>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text><Text strong>问题描述：</Text>网络连接不稳定，出现间歇性断连现象。</Text>
                    <Text><Text strong>关联理由：</Text>本次PR修改了网络通信模块的代码，可能影响连接稳定性。</Text>
                    <Text><Text strong>涉及设备形态：</Text>路由器、交换机</Text>
                  </Space>
                </Card>
              </Space>
            </div>

            {/* Sub-step 2.3 */}
            <div className={`sub-step ${currentStep >= 2 ? 'sub-step-visible' : ''}`}>
              <div className="sub-step-header">
                <div className="sub-step-number">2.3</div>
                <Text strong>查找问题单关联的测试用例</Text>
              </div>
              <Card className="sub-step-content" bordered>
                <Table
                  columns={testCaseColumns}
                  dataSource={testCases}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  className="test-case-table"
                />
              </Card>
            </div>
          </Card>

          {/* Step 3 */}
          <Card
            className={`thinking-card ${currentStep >= 3 ? 'step-visible' : ''}`}
            bordered={false}
          >
            <div className="step-header">
              <div className="step-number">3</div>
              <Text strong className="step-title">总结与风险评估</Text>
            </div>
            <div className="step-content">
              <Text>
                {step3Text}
                {currentStep >= 3 && step3Text.length < thinkingContent.step3.length && (
                  <span className="typing-cursor" />
                )}
              </Text>
            </div>
          </Card>
        </div>

        {/* Result Section */}
        <div
          ref={resultRef}
          className={`result-section ${showResult ? 'result-visible' : ''}`}
        >
          <Title level={2} className="section-title">
            <CheckCircleOutlined className="title-icon" />
            推荐用例结果
          </Title>

          <Card className="result-card" bordered={false}>
            {/* Risk Summary */}
            <div className="risk-summary">
              <Title level={3} className="subsection-title">风险总结</Title>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Card className="risk-card risk-history" bordered>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong className="risk-title">
                        <ExclamationCircleOutlined className="risk-icon" />
                        历史风险
                      </Text>
                      <Text className="risk-content">
                        {riskText.history}
                        {showResult && riskText.history.length < riskSummary.historyRisk.length && (
                          <span className="typing-cursor typing-cursor-small" />
                        )}
                      </Text>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card className="risk-card risk-impact" bordered>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong className="risk-title">
                        <InfoCircleOutlined className="risk-icon" />
                        影响风险
                      </Text>
                      <Text className="risk-content">
                        {riskText.impact}
                        {showResult && riskText.impact.length < riskSummary.impactRisk.length && (
                          <span className="typing-cursor typing-cursor-small" />
                        )}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* Recommended Cases Table */}
            <div className="recommended-cases">
              <Title level={3} className="subsection-title">历史用例推荐</Title>
              <Table
                columns={recommendedCasesColumns}
                dataSource={recommendedCases.filter((_, index) => visibleRows.includes(index))}
                rowKey="id"
                pagination={false}
                className="recommended-cases-table"
                rowClassName={(record) => {
                  const index = recommendedCases.findIndex(c => c.id === record.id);
                  return visibleRows.includes(index) ? 'table-row-visible' : '';
                }}
              />
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="page-footer">
          <Text className="footer-brand">HONOR X50</Text>
          <Space>
            <MoonOutlined className="footer-icon" />
            <Text className="footer-text">AI智能分析系统</Text>
          </Space>
        </div>
      </div>

      {/* Website Footer */}
      <WebsiteFooter />
    </div>
  );
};

export default PRAnalysisPage;
