"use client";
import React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableContainer from "./SortableContainer";
import Item from "./Item";
import { useDndItems } from "../hooks/useDndItems";

const initialItems = {
  toDo: ["shadcn/ui", "prisma", "vercel", "Pomodoro"],
  inProgress: ["trello", "E", "F"],
  review: ["G", "H", "I"],
  done: [],
};

const Container = () => {
  const { items, activeId, handleDragStart, handleDragOver, handleDragEnd } =
    useDndItems(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="flex flex-row space-x-4 p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event: DragStartEvent) =>
          handleDragStart(event.active.id.toString())
        }
        onDragOver={(event: DragOverEvent) =>
          handleDragOver(
            event.active.id.toString(),
            event.over?.id.toString() ?? null,
          )
        }
        onDragEnd={(event: DragEndEvent) =>
          handleDragEnd(
            event.active.id.toString(),
            event.over?.id.toString() ?? null,
          )
        }
      >
        <SortableContainer id="toDo" items={items.toDo ?? []} label="To Do" />
        <SortableContainer
          id="inProgress"
          label="In Progress"
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
