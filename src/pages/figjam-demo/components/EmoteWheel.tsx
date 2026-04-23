/**
 * 表情轮盘组件
 * 圆形布局的表情选择器
 */

import React, { FC } from 'react';
import './EmoteWheel.less';

interface EmoteItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface EmoteWheelProps {
  items: EmoteItem[];
  onSelect: (id: string) => void;
}

const EmoteWheel: FC<EmoteWheelProps> = ({ items, onSelect }) => {
  // 将项目排列成圆形
  const radius = 100;
  const centerX = 120;
  const centerY = 120;

  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle) - 20,
      y: centerY + radius * Math.sin(angle) - 20,
    };
  };

  return (
    <div className="emote-wheel">
      <svg width="240" height="240" viewBox="0 0 240 240" className="wheel-svg">
        {/* 外圆 */}
        <circle cx={centerX} cy={centerY} r={115} fill="none" stroke="#e8e8e8" strokeWidth="2" />
        {/* 内圆 */}
        <circle cx={centerX} cy={centerY} r={70} fill="#fafafa" stroke="#e8e8e8" strokeWidth="1" />
        {/* 中心圆 */}
        <circle cx={centerX} cy={centerY} r={35} fill="white" stroke="#d9d9d9" strokeWidth="2" />
        {/* 分隔线 */}
        {items.map((_, index) => {
          const angle = (index / items.length) * 2 * Math.PI - Math.PI / 2;
          const x1 = centerX + 70 * Math.cos(angle);
          const y1 = centerY + 70 * Math.sin(angle);
          const x2 = centerX + 115 * Math.cos(angle);
          const y2 = centerY + 115 * Math.sin(angle);
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e8e8e8" strokeWidth="1" />;
        })}
      </svg>

      {/* 表情图标 */}
      <div className="emote-items">
        {items.map((item, index) => {
          const pos = getPosition(index, items.length);
          return (
            <button
              key={item.id}
              className="emote-item"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                '--emote-color': item.color,
              } as React.CSSProperties}
              onClick={() => onSelect(item.id)}
              title={item.label}
            >
              {item.icon}
            </button>
          );
        })}
      </div>

      {/* 中心图标 */}
      <div className="wheel-center">
        <span className="center-icon">😊</span>
      </div>
    </div>
  );
};

export default EmoteWheel;
