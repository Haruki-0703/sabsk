import { useState, useCallback } from "react";

export function useMultiSelect<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  }, [items]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === items.length) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [items.length, selectedIds.size, selectAll, deselectAll]);

  const getSelectedItems = useCallback(() => {
    return items.filter((item) => selectedIds.has(item.id));
  }, [items, selectedIds]);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const isAllSelected = selectedIds.size === items.length && items.length > 0;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < items.length;
  const selectedCount = selectedIds.size;

  return {
    selectedIds,
    toggleSelect,
    selectAll,
    deselectAll,
    toggleSelectAll,
    getSelectedItems,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    selectedCount,
  };
}
