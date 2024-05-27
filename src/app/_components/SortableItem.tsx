import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UniqueIdentifier } from "@dnd-kit/core";
import Item from "./Item";

const SortableItem = ({ id }: { id: UniqueIdentifier }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="my-2 cursor-pointer rounded-lg bg-blue-100 p-2 shadow"
      {...attributes}
      {...listeners}
    >
      <Item id={id} />
    </div>
  );
};

export default SortableItem;
