/**
 * 列配置组件
 * 支持显示/隐藏列、固定列配置
 */

import React, { useEffect, useState } from 'react';
import { Checkbox, Popover, Button, Divider, Space, Input } from 'antd';
import { SettingOutlined, SearchOutlined, CheckOutlined } from '@ant-design/icons';
import type { ColumnConfig } from './types';
import './index.less';

interface ColumnSettingProps {
  columns: ColumnConfig[];
  onChange: (columns: ColumnConfig[]) => void;
  storageKey?: string;
}

// 从 localStorage 加载列配置
const loadColumnConfig = (storageKey: string): ColumnConfig[] | null => {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// 保存列配置到 localStorage
const saveColumnConfig = (storageKey: string, columns: ColumnConfig[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(columns));
  } catch (error) {
    console.warn('Failed to save column config to localStorage:', error);
  }
};

/**
 * 列配置组件
 */
const ColumnSetting: React.FC<ColumnSettingProps> = ({ columns, onChange, storageKey }) => {
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [checkedList, setCheckedList] = useState<string[]>(() =>
    columns.filter((col) => col.visible).map((col) => col.key)
  );

  // 初始化时从 localStorage 加载配置
  useEffect(() => {
    if (storageKey) {
      const savedConfig = loadColumnConfig(storageKey);
      if (savedConfig) {
        const visibleKeys = savedConfig.filter((col) => col.visible).map((col) => col.key);
        setCheckedList(visibleKeys);
      }
    }
  }, [storageKey]);

  // 过滤后的列列表
  const filteredColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // 全选状态
  const checkAll = filteredColumns.length > 0 && checkedList.length === filteredColumns.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < filteredColumns.length;

  // 处理复选框变化
  const handleCheckChange = (checkedKeys: string[]) => {
    setCheckedList(checkedKeys);

    const newColumns = columns.map((col) => ({
      ...col,
      visible: checkedKeys.includes(col.key),
    }));

    onChange(newColumns);

    // 持久化到 localStorage
    if (storageKey) {
      saveColumnConfig(storageKey, newColumns);
    }
  };

  // 全选/取消全选
  const handleCheckAll = (checked: boolean) => {
    const newCheckedList = checked ? filteredColumns.map((col) => col.key) : [];
    handleCheckChange(newCheckedList);
  };

  // 重置为默认配置
  const handleReset = () => {
    const defaultVisibleKeys = columns
      .filter((col) => !col.key.startsWith('action')) // 默认隐藏操作列
      .map((col) => col.key);

    handleCheckChange(defaultVisibleKeys);
  };

  // 内容
  const content = (
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
          列展示
        </Checkbox>
        <a onClick={handleReset} style={{ fontSize: 12 }}>
          重置
        </a>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 列列表 */}
      <div className="protable-column-setting-list">
        <Checkbox.Group
          style={{ width: '100%' }}
          value={checkedList}
          onChange={(checkedKeys) => handleCheckChange(checkedKeys as string[])}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {filteredColumns.map((col) => (
              <Checkbox key={col.key} value={col.key}>
                <span className="protable-column-setting-item">
                  {col.label}
                </span>
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title={null}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottomRight"
      overlayClassName="protable-column-setting-popover"
    >
      <Button icon={<SettingOutlined />} type="text" size="small">
        列设置
      </Button>
    </Popover>
  );
};

export default ColumnSetting;
