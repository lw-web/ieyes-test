/**
 * 列配置组件
 * 支持显示/隐藏列、固定列配置
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Checkbox, Popover, Button, Divider, Space, Input } from 'antd';
import { SettingOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnConfig } from './types';
import './index.less';

interface ColumnSettingProps {
  columns: ColumnConfig[];
  onChange: (columns: ColumnConfig[]) => void;
  storageKey?: string;
}

/**
 * 列配置组件
 */
const ColumnSetting: React.FC<ColumnSettingProps> = ({ columns, onChange }) => {
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // 过滤后的列列表
  const filteredColumns = useMemo(() =>
    columns.filter((col) =>
      col.label.toLowerCase().includes(searchValue.toLowerCase())
    ),
    [columns, searchValue]
  );

  // 当前可见的列 key 列表
  const visibleKeys = useMemo(() =>
    new Set(columns.filter((col) => col.visible).map((col) => col.key)),
    [columns]
  );

  // 过滤后可见的列 key 列表
  const filteredVisibleKeys = useMemo(() =>
    new Set(filteredColumns.filter((col) => col.visible).map((col) => col.key)),
    [filteredColumns]
  );

  // 全选状态
  const checkAll = filteredColumns.length > 0 && filteredVisibleKeys.size === filteredColumns.length;
  const indeterminate = filteredVisibleKeys.size > 0 && filteredVisibleKeys.size < filteredColumns.length;

  // 处理单个列的勾选变化
  const handleItemCheck = useCallback((columnKey: string, checked: boolean) => {
    // 计算所有列的新可见状态
    const newColumns = columns.map((col) => ({
      ...col,
      visible: col.key === columnKey ? checked : col.visible,
    }));
    onChange(newColumns);
  }, [columns, onChange]);

  // 全选/取消全选
  const handleCheckAll = useCallback((checked: boolean) => {
    // 只更新过滤后的列的可见状态，保持其他列不变
    const filteredKeySet = new Set(filteredColumns.map((col) => col.key));
    const newColumns = columns.map((col) => ({
      ...col,
      visible: filteredKeySet.has(col.key) ? checked : col.visible,
    }));
    onChange(newColumns);
  }, [columns, filteredColumns, onChange]);

  // 重置为默认配置
  const handleReset = useCallback(() => {
    const newColumns = columns.map((col) => ({
      ...col,
      visible: !col.key.startsWith('action'), // 默认隐藏操作列
    }));
    onChange(newColumns);
  }, [columns, onChange]);

  // 使用 useMemo 缓存 content，避免每次渲染创建新引用
  const content = useMemo(() => (
    <div className="protable-column-setting">
      {/* 搜索框 */}
      <Input
        placeholder="搜索列"
        prefix={<SearchOutlined />}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        allowClear
        style={{ marginBottom: 12 }}
      />

      {/* 全选 */}
      <div className="protable-column-setting-header">
        <Checkbox
          indeterminate={indeterminate}
          checked={checkAll}
          onChange={(e) => handleCheckAll(e.target.checked)}
        >
          列展示 / {filteredVisibleKeys.size} / {filteredColumns.length}
        </Checkbox>
        <Button
          type="link"
          size="small"
          icon={<ReloadOutlined />}
          onClick={handleReset}
        >
          重置
        </Button>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 列列表 */}
      <div className="protable-column-setting-list">
        <Space direction="vertical" style={{ width: '100%' }}>
          {filteredColumns.map((col) => (
            <Checkbox
              key={col.key}
              checked={col.visible}
              onChange={(e) => handleItemCheck(col.key, e.target.checked)}
            >
              <span className="protable-column-setting-item">
                {col.label}
              </span>
            </Checkbox>
          ))}
        </Space>
      </div>
    </div>
  ), [
    searchValue,
    filteredColumns,
    filteredVisibleKeys,
    visibleKeys,
    checkAll,
    indeterminate,
    handleCheckAll,
    handleReset,
    handleItemCheck,
  ]);

  return (
    <Popover
      content={content}
      title={null}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottomRight"
      overlayClassName="protable-column-setting-popover"
      destroyTooltipOnHide
    >
      <Button icon={<SettingOutlined />} type="text" size="small">
        列设置
      </Button>
    </Popover>
  );
};

export default ColumnSetting;
