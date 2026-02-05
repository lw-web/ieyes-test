/**
 * ProTable 高级表格组件类型定义
 */

import { ColumnType } from 'antd/es/table';
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';

// 列配置项
export interface ColumnConfig<T = any> {
  key: string;
  label: string;
  visible: boolean;
  fixed?: boolean | 'left' | 'right';
  width?: number;
}

// 表格查询参数
export interface TableQueryParams {
  current: number;
  pageSize: number;
  filters?: Record<string, FilterValue | null>;
  sorter?: SorterResult<any> | SorterResult<any>[];
}

// 表格变化回调参数
export interface TableChangeParams<T = any> {
  pagination: {
    current: number;
    pageSize: number;
  };
  filters: Record<string, FilterValue | null>;
  sorter: SorterResult<T> | SorterResult<T>[];
  extra?: TableCurrentDataSource<T>;
}

// ProTable 请求函数返回值
export interface ProTableRequestResult<T = any> {
  list: T[];
  total: number;
  current?: number;
  pageSize?: number;
}

// ProTable Props
export interface ProTableProps<T = any> {
  // API 请求函数
  request: (params: TableQueryParams) => Promise<ProTableRequestResult<T>>;
  // 列定义
  columns: ColumnType<T>[];
  // 行 key
  rowKey?: string | ((record: T) => string);
  // 默认列配置
  defaultColumnConfig?: ColumnConfig[];
  // 是否启用列配置
  enableColumnSetting?: boolean;
  // 是否启用列宽拖拽
  enableResizable?: boolean;
  // 列配置存储 key（用于 localStorage 持久化）
  columnConfigKey?: string;
  // 工具栏渲染
  toolbarRender?: () => React.ReactNode;
  // 表格属性透传
  tableProps?: Omit<React.ComponentProps<typeof import('antd').Table>, 'columns' | 'dataSource' | 'loading' | 'onChange' | 'pagination'>;
  // 是否自动发起请求
  autoRequest?: boolean;
  // 初始查询参数
  initialValues?: Partial<TableQueryParams>;
  // 请求成功回调
  onRequestSuccess?: (data: ProTableRequestResult<T>) => void;
  // 请求失败回调
  onRequestError?: (error: Error) => void;
}

// ProTable Ref 方法
export interface ProTableRef {
  reload: (resetPageIndex?: boolean) => void;
  reset: () => void;
  getQueryParams: () => TableQueryParams;
  getDataSource: () => any[];
  setFilters: (filters: Record<string, FilterValue | null>) => void;
  setSorter: (sorter: SorterResult<any>) => void;
}
