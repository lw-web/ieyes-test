/**
 * 列宽拖拽 Hook
 * 支持拖拽调整列宽、持久化配置
 */

import { useCallback, useRef, useState } from 'react';
import type { ColumnType } from 'antd/es/table';

interface ResizableColumnConfig {
  key: string;
  width: number;
  minWidth?: number;
}

interface UseResizableColumnsOptions {
  columns: ColumnType<any>[];
  storageKey?: string; // localStorage 存储键
  minColumnWidth?: number; // 默认最小列宽
  onResize?: (key: string, width: number) => void;
}

interface UseResizableColumnsReturn {
  columns: ColumnType<any>[];
  handleResize: (key: string, width: number) => void;
  resetWidths: () => void;
}

// 从 localStorage 读取列宽配置
const loadWidthsFromStorage = (storageKey: string): Record<string, number> => {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// 保存列宽配置到 localStorage
const saveWidthsToStorage = (storageKey: string, widths: Record<string, number>) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(widths));
  } catch (error) {
    console.warn('Failed to save column widths to localStorage:', error);
  }
};

/**
 * 列宽拖拽 Hook
 */
export function useResizableColumns(
  options: UseResizableColumnsOptions
): UseResizableColumnsReturn {
  const { columns: originalColumns, storageKey, minColumnWidth = 80, onResize } = options;

  // 初始化列宽
  const [widthsMap, setWidthsMap] = useState<Record<string, number>>(() => {
    if (storageKey) {
      return loadWidthsFromStorage(storageKey);
    }
    return {};
  });

  const columnsRef = useRef(originalColumns);

  // 更新 columns 引用
  if (columnsRef.current !== originalColumns) {
    columnsRef.current = originalColumns;
  }

  // 处理列宽调整
  const handleResize = useCallback(
    (key: string, width: number) => {
      const minWidth = minColumnWidth;
      const newWidth = Math.max(width, minWidth);

      setWidthsMap((prev) => {
        const newWidths = { ...prev, [key]: newWidth };

        // 持久化到 localStorage
        if (storageKey) {
          saveWidthsToStorage(storageKey, newWidths);
        }

        // 触发回调
        onResize?.(key, newWidth);

        return newWidths;
      });
    },
    [minColumnWidth, storageKey, onResize]
  );

  // 重置列宽
  const resetWidths = useCallback(() => {
    setWidthsMap({});
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  // 增强列定义，添加宽度属性
  const enhancedColumns: ColumnType<any>[] = originalColumns.map((col) => {
    const key = typeof col.key === 'string' ? col.key : (col.dataIndex as string) || '';
    const savedWidth = widthsMap[key];

    if (!savedWidth) {
      return col;
    }

    return {
      ...col,
      width: savedWidth,
    };
  });

  return {
    columns: enhancedColumns,
    handleResize,
    resetWidths,
  };
}

/**
 * 列可调整宽度的表头组件
 */
export interface ResizableHeaderProps {
  width: number;
  minWidth?: number;
  onResize: (width: number) => void;
  children: React.ReactNode;
}

export const ResizableHeader: React.FC<ResizableHeaderProps> = ({
  width,
  minWidth = 80,
  onResize,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(width);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startX.current = e.clientX;
    startWidth.current = width;
    setIsDragging(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX.current;
    const newWidth = Math.max(startWidth.current + deltaX, minWidth);
    onResize(newWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <th
      style={{
        width,
        minWidth,
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {children}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 10,
          cursor: 'col-resize',
          backgroundColor: isDragging ? 'rgba(24, 144, 255, 0.2)' : 'transparent',
          transition: isDragging ? 'none' : 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      />
    </th>
  );
};
