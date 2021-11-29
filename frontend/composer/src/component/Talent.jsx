import {useDrag} from "react-dnd";
import {ItemTypes} from "../data/types";

function Talent({ title }) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Talent,
    item: {talentName: title},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.3 : 1,
      }}
    >{title}</div>
  );
}

export default Talent;