import {useDrop} from "react-dnd";
import {ItemTypes} from "../data/Types";
import {deleteElem} from "../data/Data";
import trashIcon from "../res/trash.png";

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: '100%',
        border: 'dashed',
        borderColor: 'gray',
        borderRadius: 5,
        width: '100%',
      }}
    >
      <img style={{maxWidth: '30%', maxHeight: '30%'}} src={trashIcon}/>
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