import { useState, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export const useDndItems = (initialItems: Record<string, string[]>) => {
  const [items, setItems] = useState<Record<string, string[]>>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  const findContainer = useCallback(
    (id: string): string => {
      if (id in items) {
        return id;
      }
      const container = Object.keys(items).find((key) =>
        items[key]?.includes(id),
      );
      if (!container) {
        throw new Error(`Container not found for id: ${id}`);
      }
      return container;
    },
    [items],
  );

  const handleDragStart = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleDragOver = useCallback(
    (activeId: string, overId: string | null) => {
      if (!overId) return;

      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (activeContainer === overContainer) {
        return;
      }

      setItems((prev) => {
        const activeItems = prev[activeContainer]!;
        const overItems = prev[overContainer]!;

        const activeIndex = activeItems.indexOf(activeId);
        const overIndex = overItems.indexOf(overId);

        if (activeIndex === -1 || (overIndex === -1 && overItems.length > 0)) {
          return prev;
        }

        let newIndex;
        if (overIndex === -1) {
          newIndex = overItems.length; // 空の配列の場合の処理
        } else {
          const isBelowLastItem = overIndex === overItems.length - 1;
          const modifier = isBelowLastItem ? 1 : 0;
          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        const updatedActiveItems = activeItems.filter(
          (item) => item !== activeId,
        );
        const updatedOverItems = [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex),
        ];

        return {
          ...prev,
          [activeContainer]: updatedActiveItems,
          [overContainer]: updatedOverItems as string[],
        };
      });
    },
    [findContainer],
  );

  const handleDragEnd = useCallback(
    (activeId: string, overId: string | null) => {
      if (!overId) return;

      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (activeContainer !== overContainer) {
        return;
      }

      const activeIndex = items[activeContainer]!.indexOf(activeId);
      const overIndex = items[overContainer]!.indexOf(overId);

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer]!,
            activeIndex,
            overIndex,
          ),
        }));
      }
      setActiveId(null);
    },
    [findContainer, items],
  );

  return {
    items,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
