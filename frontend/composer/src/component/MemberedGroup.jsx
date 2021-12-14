import {useDrag} from "react-dnd";
import {ItemTypes} from "../data/types";

function MemberedGroup({groupId, title}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Group,
    item: {groupId: groupId, type: ItemTypes.Group},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <div
      ref={drag}
      style={{
        backgroundColor: 'lightgray',
        borderRadius: 10,
        padding: 5,
        margin: 5,
      }}>{title}</div>
  );
}

export default MemberedGroup;