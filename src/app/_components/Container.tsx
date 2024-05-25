"use client";
import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableContainer from "./SortableContainer";
import Item from "./Item";

const Container = () => {
  const [items, setItems] = useState<Record<string, string[]>>({
    toDo: ["shadcn/ui", "prisma", "vercel"],
    inProgress: ["trello", "E", "F"],
    review: ["G", "H", "I"],
    done: [],
  });

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findContainer = (id: UniqueIdentifier): string => {
    if (id in items) {
      return id.toString();
    }
    const container = Object.keys(items).find((key) =>
      items[key]?.includes(id.toString()),
    );
    if (!container) {
      throw new Error(`Container not found for id: ${id}`);
    }
    return container;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();
    setActiveId(id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const id = active.id.toString();
    const overId = over?.id.toString();

    if (!overId) return;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (activeContainer === overContainer) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer]!;
      const overItems = prev[overContainer]!;

      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);

      if (activeIndex === -1 || (overIndex === -1 && overItems.length > 0)) {
        return prev;
      }

      let newIndex;
      if (overIndex === -1) {
        newIndex = overItems.length; // 空の配列の場合の処理
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      const updatedActiveItems = activeItems.filter(
        (item) => item !== active.id,
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
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const id = active.id.toString();
    const overId = over?.id.toString();

    if (!overId) return;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (activeContainer !== overContainer) {
      return;
    }

    const activeIndex = items[activeContainer]!.indexOf(id);
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
  };

  return (
    <div className="mx-auto flex flex-row">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContainer id="toDo" items={items.toDo ?? []} label="toDo" />
        <SortableContainer
          id="inProgress"
          label="inProgress"
          items={items.inProgress ?? []}
        />
        <SortableContainer
          id="review"
          label="Review"
          items={items.review ?? []}
        />
        <SortableContainer id="done" label="Done" items={items.done ?? []} />
        <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
};

export default Container;
