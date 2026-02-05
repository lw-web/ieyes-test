/**
 * ProTable 查询状态管理 Hook
 * 管理分页、过滤、排序状态和数据请求
 */

import { useCallback, useRef, useState } from 'react';
import type { TableQueryParams, TableChangeParams, ProTableRequestResult } from './types';

interface UseTableQueryOptions<T = any> {
  request: (params: TableQueryParams) => Promise<ProTableRequestResult<T>>;
  autoRequest?: boolean;
  initialValues?: Partial<TableQueryParams>;
  onRequestSuccess?: (data: ProTableRequestResult<T>) => void;
  onRequestError?: (error: Error) => void;
}

interface UseTableQueryReturn<T = any> {
  // 状态
  dataSource: T[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger: boolean;
    showQuickJumper: boolean;
    showTotal: (total: number) => string;
  };
  // 查询参数
  filters: Record<string, any>;
  sorter: Record<string, 'ascend' | 'descend' | null>;
  // 方法
  fetchTable: (silent?: boolean) => Promise<void>;
  handleTableChange: (params: TableChangeParams<T>) => void;
  resetQuery: () => void;
  reload: (resetPageIndex?: boolean) => void;
  setFilters: (filters: Record<string, any>) => void;
  setSorter: (sorter: Record<string, 'ascend' | 'descend' | null>) => void;
  setPagination: (pagination: { current?: number; pageSize?: number }) => void;
  getQueryParams: () => TableQueryParams;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * 表格查询状态管理 Hook
 */
export function useTableQuery<T = any>(
  options: UseTableQueryOptions<T>
): UseTableQueryReturn<T> {
  const {
    request,
    autoRequest = true,
    initialValues = {},
    onRequestSuccess,
    onRequestError,
  } = options;

  // 数据源
  const [dataSource, setDataSource] = useState<T[]>([]);

  // 加载状态
  const [loading, setLoading] = useState(false);

  // 分页状态
  const [pagination, setPagination] = useState({
    current: initialValues.current || 1,
    pageSize: initialValues.pageSize || DEFAULT_PAGE_SIZE,
    total: 0,
  });

  // 过滤器状态
  const [filters, setFilters] = useState<Record<string, any>>({});

  // 排序状态
  const [sorter, setSorter] = useState<Record<string, 'ascend' | 'descend' | null>>({});

  // 请求函数引用，避免重复请求
  const requestRef = useRef(request);
  requestRef.current = request;

  /**
   * 执行数据请求
   * @param silent 是否静默请求（不显示 loading）
   * @param overrideParams 可选：覆盖当前查询参数（用于状态更新前的即时请求）
   */
  const fetchTable = useCallback(
    async (silent = false, overrideParams?: { filters?: Record<string, any>; sorter?: Record<string, 'ascend' | 'descend' | null> }) => {
      // 防止重复请求
      if (loading && !silent) return;

      if (!silent) {
        setLoading(true);
      }

      try {
        // 使用覆盖参数或当前状态参数
        const currentFilters = overrideParams?.filters ?? filters;
        const currentSorter = overrideParams?.sorter ?? sorter;

        // 构建查询参数
        const params: TableQueryParams = {
          current: pagination.current,
          pageSize: pagination.pageSize,
        };

        // 添加过滤器参数
        if (Object.keys(currentFilters).length > 0) {
          params.filters = currentFilters;
        }

        // 添加排序参数
        if (Object.keys(currentSorter).length > 0) {
          const sortField = Object.keys(currentSorter)[0];
          const sortOrder = currentSorter[sortField];
          if (sortOrder) {
            params.sorter = {
              field: sortField,
              order: sortOrder,
            } as any;
          }
        }

        console.log('=== fetchTable 发起请求 ===');
        console.log('params:', params);

        // 发起请求
        const result = await requestRef.current(params);

        // 更新数据源
        setDataSource(result.list || []);

        // 更新分页信息
        setPagination((prev) => ({
          ...prev,
          total: result.total,
          current: result.current || prev.current,
          pageSize: result.pageSize || prev.pageSize,
        }));

        // 成功回调
        onRequestSuccess?.(result);
      } catch (error) {
        // 错误回调
        onRequestError?.(error as Error);
        console.error('Table request failed:', error);
      } finally {
        setLoading(false);
      }
    },
    [pagination, filters, sorter, loading, onRequestSuccess, onRequestError]
  );

  /**
   * 处理表格变化（分页、排序、筛选）
   */
  const handleTableChange = useCallback(
    (params: TableChangeParams<T>) => {
      const { pagination: newPagination, filters: newFilters, sorter: newSorter } = params;

      // 更新分页
      setPagination((prev) => ({
        ...prev,
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      }));

      // 格式化过滤器 - 只保留有值的过滤条件
      let formattedFilters: Record<string, any> = {};
      if (newFilters) {
        Object.entries(newFilters).forEach(([key, value]) => {
          // value 可能是数组或单个值
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              if (value.length > 0) {
                formattedFilters[key] = value;
              }
            } else {
              formattedFilters[key] = value;
            }
          }
        });
        setFilters(formattedFilters);
      }

      // 格式化排序
      let formattedSorter: Record<string, 'ascend' | 'descend' | null> = {};
      if (newSorter) {
        if (Array.isArray(newSorter)) {
          // 多列排序
          newSorter.forEach((item) => {
            if (item.field) {
              formattedSorter[item.field as string] = item.order || null;
            }
          });
        } else if (newSorter.field && newSorter.order) {
          // 单列排序 - 只在有有效排序时设置
          formattedSorter = {
            [newSorter.field as string]: newSorter.order,
          };
        }
        setSorter(formattedSorter);
      }

      // 使用新的过滤器和排序值立即请求数据（避免状态更新延迟问题）
      fetchTable(true, { filters: formattedFilters, sorter: formattedSorter });
    },
    [fetchTable]
  );

  /**
   * 重置查询条件
   */
  const resetQuery = useCallback(() => {
    setPagination({
      current: initialValues.current || 1,
      pageSize: initialValues.pageSize || DEFAULT_PAGE_SIZE,
      total: 0,
    });
    setFilters({});
    setSorter({});
    setDataSource([]);
  }, [initialValues]);

  /**
   * 重新加载（可选重置页码）
   */
  const reload = useCallback(
    (resetPageIndex = false) => {
      if (resetPageIndex) {
        setPagination((prev) => ({
          ...prev,
          current: 1,
        }));
      }
      fetchTable();
    },
    [fetchTable]
  );

  /**
   * 手动设置过滤器
   */
  const setFiltersValue = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
  }, []);

  /**
   * 手动设置排序
   */
  const setSorterValue = useCallback((newSorter: Record<string, 'ascend' | 'descend' | null>) => {
    setSorter(newSorter);
  }, []);

  /**
   * 手动设置分页
   */
  const setPaginationValue = useCallback((newPagination: { current?: number; pageSize?: number }) => {
    setPagination((prev) => ({
      ...prev,
      ...newPagination,
    }));
  }, []);

  /**
   * 获取当前查询参数
   */
  const getQueryParams = useCallback((): TableQueryParams => {
    const params: TableQueryParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    };

    if (Object.keys(filters).length > 0) {
      params.filters = filters;
    }

    if (Object.keys(sorter).length > 0) {
      const sortField = Object.keys(sorter)[0];
      const sortOrder = sorter[sortField];
      if (sortOrder) {
        params.sorter = {
          field: sortField,
          order: sortOrder,
        } as any;
      }
    }

    return params;
  }, [pagination, filters, sorter]);

  // 初始化时自动请求
  const initializedRef = useRef(false);
  if (autoRequest && !initializedRef.current) {
    initializedRef.current = true;
    fetchTable();
  }

  return {
    dataSource,
    loading,
    pagination: {
      ...pagination,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条`,
    },
    filters,
    sorter,
    fetchTable,
    handleTableChange,
    resetQuery,
    reload,
    setFilters: setFiltersValue,
    setSorter: setSorterValue,
    setPagination: setPaginationValue,
    getQueryParams,
  };
}
