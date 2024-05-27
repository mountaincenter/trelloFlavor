import type { UniqueIdentifier } from "@dnd-kit/core";

const Item = ({ id }: { id: UniqueIdentifier }) => {
  return (
    <div className="flex h-10 items-center justify-center rounded-lg border border-gray-400 bg-white p-2">
      {id}
    </div>
  );
};
export default Item;
