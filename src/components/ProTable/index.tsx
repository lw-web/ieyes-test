/**
 * ProTable 高级表格组件
 *
 * 功能特性：
 * - 分页
 * - 表头筛选（filterDropdown）
 * - 排序
 * - 列配置
 * - 列宽拖拽（带最大/最小宽度限制）
 */

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Table, Space } from 'antd';
import type { TableProps } from 'antd/es/table';
import type { ProTableProps, ProTableRef } from './types';
import { useTableQuery } from './useTableQuery';
import { useColumnResize } from './useColumnResize';
import { useColumnConfig } from './useColumnConfig';
import ColumnSetting from './ColumnSetting';
import './index.less';

function ProTable<T = any>(props: ProTableProps<T>, ref: React.Ref<ProTableRef>) {
  const {
    request,
    columns: originalColumns,
    rowKey = 'id',
    defaultColumnConfig,
    enableColumnSetting = true,
    enableResizable = true,
    columnConfigKey = 'protable-column-config',
    toolbarRender,
    tableProps,
    autoRequest = true,
    initialValues,
    onRequestSuccess,
    onRequestError,
  } = props;

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 使用列配置管理 Hook
  const {
    columnConfigs,
    visibleColumns: rawVisibleColumns,
    updateColumnWidth,
    updateColumnConfig,
  } = useColumnConfig<T>({
    columns: originalColumns,
    defaultConfig: defaultColumnConfig,
    storageKey: columnConfigKey,
  });

  // 使用列宽拖拽 Hook
  const { getOnHeaderCell } = useColumnResize({
    containerRef: tableContainerRef,
    enableResizable,
    minWidth: 60,
    maxWidth: 800,
    onColumnResize: updateColumnWidth,
  });

  // 使用查询状态管理 Hook
  const {
    dataSource,
    loading,
    pagination,
    handleTableChange,
    resetQuery,
    reload,
    setFilters,
    setSorter,
    getQueryParams,
  } = useTableQuery<T>({
    request,
    autoRequest,
    initialValues,
    onRequestSuccess,
    onRequestError,
  });

  // 应用列宽拖拽配置到可见列
  const visibleColumns = rawVisibleColumns.map((col) => ({
    ...col,
    onHeaderCell: enableResizable ? () => getOnHeaderCell(col) : undefined,
  }));

  // 重置表格
  const handleReset = () => {
    resetQuery();
  };

  // 暴露给父组件的方法
  useImperativeHandle(
    ref,
    () => ({
      reload: (resetPageIndex = false) => {
        reload(resetPageIndex);
      },
      reset: handleReset,
      getQueryParams,
      getDataSource: () => dataSource,
      setFilters,
      setSorter,
    }),
    [reload, handleReset, getQueryParams, dataSource, setFilters, setSorter]
  );

  // 默认工具栏
  const defaultToolbar = (
    <Space style={{ marginLeft: 'auto' }}>
      {toolbarRender?.()}
      {enableColumnSetting && (
        <ColumnSetting
          columns={columnConfigs}
          // @ts-ignore
          onChange={updateColumnConfig}
          storageKey={columnConfigKey}
        />
      )}
    </Space>
  );

  // 表格变化处理
  const onTableChange: TableProps<T>['onChange'] = (
    newPagination,
    newFilters,
    newSorter,
    extra
  ) => {
    handleTableChange({
      // @ts-ignore
      pagination: newPagination,
      filters: newFilters,
      sorter: newSorter,
      extra,
    });
  };

  return (
    <div className="protable" ref={tableContainerRef}>
      {/* 工具栏 */}
      <div className="protable-header">{defaultToolbar}</div>

      {/* 表格 */}
      <Table
        className={`protable-table ${enableResizable ? 'protable-resizable' : ''}`}
        // @ts-ignore
        rowKey={rowKey}
        // @ts-ignore
        columns={visibleColumns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        // @ts-ignore
        onChange={onTableChange}
        scroll={{ x: 'max-content' }}
        {...tableProps}
      />
    </div>
  );
}

// 使用 forwardRef 暴露 ref 方法
const ProTableWithRef = forwardRef(ProTable) as <T = any>(
  props: ProTableProps<T> & { ref?: React.Ref<ProTableRef> }
) => JSX.Element;

// @ts-ignore
ProTableWithRef.displayName = 'ProTable';

export default ProTableWithRef;

// 导出类型
export type {
  ProTableProps,
  ProTableRef,
  ColumnConfig,
  TableQueryParams,
  ProColumns,
} from './types';
export type { ColumnConfigItem } from './useColumnConfig';
