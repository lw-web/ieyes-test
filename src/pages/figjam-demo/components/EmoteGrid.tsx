/**
 * 表情网格组件
 * 网格布局的表情展示
 */

import React, { FC, useState } from 'react';
import './EmoteGrid.less';

interface EmoteItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface EmoteGridProps {
  items: EmoteItem[];
}

const EmoteGrid: FC<EmoteGridProps> = ({ items }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="emote-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className={`emote-grid-item ${hoveredId === item.id ? 'hovered' : ''}`}
          style={{ '--item-color': item.color } as React.CSSProperties}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="emote-icon">{item.icon}</div>
          <div className="emote-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default EmoteGrid;
