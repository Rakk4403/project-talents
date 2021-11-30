import {useDrag} from "react-dnd";
import {ItemTypes} from "../data/types";
import ToggleInput from "./ToggleInput";
import {generateRandomColor} from "../data/Data";

function Talent({ title, talentId }) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Talent,
    item: {talentId: talentId},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))


  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.3 : 1,
        padding: 10,
        margin: 3,
        borderRadius: 20,
        backgroundColor: generateRandomColor(),
      }}
    >
     <ToggleInput elemId={talentId} value={title} />
    </div>
  );
}

export default Talent;