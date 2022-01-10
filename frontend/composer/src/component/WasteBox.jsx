import {useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {deleteElem} from "../data/Data";

function WasteBox() {
  const [{isOver}, drop] = useDrop(() => ({
    accept: [ItemTypes.Member, ItemTypes.Group, ItemTypes.Talent],
    drop: (item, monitor) => {
      deleteElem(item.memberId || item.groupId || item.talentId)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        height: 100,
        border: 'dashed',
        borderColor: 'gray',
        borderRadius: 5,
        width: '100%',
      }}
    >
      WasteBox:
      {isOver && <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          opacity: 0.5,
        }}
      />}
    </div>
  );
}

export default WasteBox;