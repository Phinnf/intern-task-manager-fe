import { useDroppable } from "@dnd-kit/react";

export function Droppable({ children, id }) {
  const { isDropTarget, ref } = useDroppable({ id });
  return (
    <div ref={ref} className={isDropTarget ? "droppable active" : "droppable"}>
      {children}
    </div>
  );
}
