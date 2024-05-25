import type { UniqueIdentifier } from "@dnd-kit/core";

const Item = ({ id }: { id: UniqueIdentifier }) => {
  return (
    <div className="my-2.5 flex h-[50px] w-full items-center justify-center rounded-lg border border-black">
      {id}
    </div>
  );
};
export default Item;
