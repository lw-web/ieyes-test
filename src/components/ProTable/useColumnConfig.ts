/**
 * 列配置管理 Hook
 * 管理表格列的显示/隐藏和宽度配置
 */

import { useCallback, useState, useMemo } from 'react';
import type { ColumnType } from 'antd/es/table';

export interface ColumnConfigItem<T = any> {
  key: string;
  label: string;
  visible: boolean;
  width?: number;
  fixed?: boolean | 'left' | 'right';
  originalColumn: ColumnType<T>;
}

interface UseColumnConfigOptions<T = any> {
  columns: ColumnType<T>[];
  defaultConfig?: Partial<ColumnConfigItem<T>>[];
  storageKey?: string;
}

interface UseColumnConfigReturn<T = any> {
  columnConfigs: ColumnConfigItem<T>[];
  visibleColumns: ColumnType<T>[];
  updateColumnWidth: (key: string, width: number) => void;
  updateColumnConfig: (newConfigs: ColumnConfigItem<T>[]) => void;
  saveConfig: () => void;
}

/**
 * 从 localStorage 加载列配置
 */
function loadConfigFromStorage<T>(
  storageKey: string,
  defaultConfigs: ColumnConfigItem<T>[]
): Partial<ColumnConfigItem<T>>[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // 忽略错误
  }

  return null;
}

/**
 * 保存列配置到 localStorage
 */
function saveConfigToStorage<T>(
  storageKey: string,
  configs: ColumnConfigItem<T>[]
): void {
  if (typeof window === 'undefined') return;

  try {
    const configToSave = configs.map(({ key, visible, width }) => ({ key, visible, width }));
    localStorage.setItem(storageKey, JSON.stringify(configToSave));
  } catch {
    // 忽略错误
  }
}

/**
 * 列配置管理 Hook
 */
export function useColumnConfig<T = any>(
  options: UseColumnConfigOptions<T>
): UseColumnConfigReturn<T> {
  const { columns: originalColumns, defaultConfig = [], storageKey } = options;

  // 初始化列配置
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfigItem<T>[]>(() => {
    // 生成默认配置
    const defaultConfigs: ColumnConfigItem<T>[] = originalColumns.map((col, index) => {
      const key = (col.key as string) || (col.dataIndex as string) || `col-${index}`;
      return {
        key,
        label: (col.title as string) || key,
        visible: true,
        width: col.width as number,
        fixed: col.fixed,
        originalColumn: col,
      };
    });

    // 尝试从 localStorage 加载配置
    if (storageKey) {
      const saved = loadConfigFromStorage<T>(storageKey, defaultConfigs);
      if (saved) {
        return defaultConfigs.map((item) => {
          const savedItem = saved.find((c) => c.key === item.key);
          return savedItem ? { ...item, ...savedItem, originalColumn: item.originalColumn } : item;
        });
      }
    }

    return defaultConfigs;
  });

  // 计算可见的列定义
  const visibleColumns = useMemo(() => {
    return columnConfigs
      .filter((col) => col.visible)
      .map((col) => ({
        ...col.originalColumn,
        width: col.width,
      }));
  }, [columnConfigs]);

  // 更新列宽
  const updateColumnWidth = useCallback((key: string, width: number) => {
    setColumnConfigs((prev) => {
      const updated = prev.map((col) =>
        col.key === key ? { ...col, width } : col
      );
      if (storageKey) {
        saveConfigToStorage(storageKey, updated);
      }
      return updated;
    });
  }, [storageKey]);

  // 更新列配置（批量更新，用于列设置）
  const updateColumnConfig = useCallback((newConfigs: ColumnConfigItem<T>[]) => {
    setColumnConfigs(newConfigs);
    if (storageKey) {
      saveConfigToStorage(storageKey, newConfigs);
    }
  }, [storageKey]);

  // 手动保存配置
  const saveConfig = useCallback(() => {
    if (storageKey) {
      saveConfigToStorage(storageKey, columnConfigs);
    }
  }, [storageKey, columnConfigs]);

  return {
    columnConfigs,
    visibleColumns,
    updateColumnWidth,
    updateColumnConfig,
    saveConfig,
  };
}
