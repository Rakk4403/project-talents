import {useDrag} from "react-dnd";
import {ItemTypes} from "../data/types";
import ToggleInput from "./ToggleInput";

function Talent({title, talentId, color}) {
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
        border: 'solid 3px',
        borderRadius: 10,
        color: color,
        backgroundColor: 'white',
        width: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'grab',
      }}
    >
      <div style={{color: 'black'}}>
        <ToggleInput style={{width: 40}} elemId={talentId} value={title}/>
      </div>
    </div>
  );
}

export default Talent;