/**
 * 列宽拖拽 Hook
 * 处理表格列宽的拖拽调整功能
 */

import { useEffect, useCallback, useRef } from 'react';

interface UseColumnResizeOptions {
  containerRef: React.RefObject<HTMLDivElement>;
  enableResizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  onColumnResize?: (columnKey: string, newWidth: number) => void;
}

interface ColumnResizeState {
  columnKey: string;
  startX: number;
  startWidth: number;
  th: HTMLElement;
}

/**
 * 列宽拖拽 Hook
 */
export function useColumnResize(options: UseColumnResizeOptions) {
  const {
    containerRef,
    enableResizable = true,
    minWidth = 60,
    maxWidth = 500,
    onColumnResize,
  } = options;

  const resizeState = useRef<ColumnResizeState | null>(null);

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeState.current || !onColumnResize) return;

    const { startX, startWidth, columnKey } = resizeState.current;
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));

    onColumnResize(columnKey, newWidth);
  }, [minWidth, maxWidth, onColumnResize]);

  // 处理鼠标释放
  const handleMouseUp = useCallback(() => {
    resizeState.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  // 设置拖拽手柄
  useEffect(() => {
    if (!enableResizable || !containerRef.current) return;

    const table = containerRef.current.querySelector('.ant-table-thead');
    if (!table) return;

    // 清理旧的拖拽手柄
    const cleanup = () => {
      const handles = table.querySelectorAll('.protable-resize-handle');
      handles.forEach((handle) => handle.remove());
    };

    // 为每个 th 添加拖拽手柄
    const setupResizeHandles = () => {
      const ths = table.querySelectorAll('th');

      ths.forEach((th) => {
        // 跳过已经有手柄的列
        if (th.querySelector('.protable-resize-handle')) {
          return;
        }

        // 创建拖拽手柄
        const handle = document.createElement('div');
        handle.className = 'protable-resize-handle';
        th.appendChild(handle);

        // 绑定 mousedown 事件
        const handleMouseDown = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const rect = th.getBoundingClientRect();
          const columnKey = th.getAttribute('data-column-key') || '';

          resizeState.current = {
            columnKey,
            startX: e.clientX,
            startWidth: rect.width,
            th,
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        };

        handle.addEventListener('mousedown', handleMouseDown);
      });
    };

    setupResizeHandles();

    // 使用 MutationObserver 监听表头变化（排序、筛选时）
    const observer = new MutationObserver(() => {
      cleanup();
      setupResizeHandles();
    });

    observer.observe(table, { childList: true, subtree: true });

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, [enableResizable, containerRef, handleMouseMove, handleMouseUp]);

  // 获取 onHeaderCell 配置
  const getOnHeaderCell = useCallback((column: any) => ({
    width: column.width,
    'data-column-key': column.key || column.dataIndex,
  }), []);

  return {
    getOnHeaderCell,
  };
}
