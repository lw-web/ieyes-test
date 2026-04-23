/**
 * 流程图组件
 * 使用 CSS 实现的简单流程图
 */

import React, { FC } from 'react';
import './FlowChart.less';

interface FlowChartProps {}

const FlowChart: FC<FlowChartProps> = () => {
  return (
    <div className="flow-chart">
      <div className="flow-container">
        {/* 顶部节点 */}
        <div className="flow-node flow-node--diamond">
          <span className="node-text">开始</span>
        </div>

        {/* 连接线 */}
        <div className="flow-connector flow-connector--left" />
        <div className="flow-connector flow-connector--right" />

        {/* 底部两个节点 */}
        <div className="flow-row">
          <div className="flow-node flow-node--square">
            <span className="node-text">选项 A</span>
          </div>
          <div className="flow-node flow-node--square">
            <span className="node-text">选项 B</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowChart;
