import { useDraggable } from "@dnd-kit/react";

export function Draggable(props) {
  const { ref } = useDraggable({
    id: props.id,
  });

  return (
    <div ref={ref} className="btn">
      {props.children}
    </div>
  );
}
