import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {appendTalent} from "../data/Data";
import ToggleInput from "./ToggleInput";
import Circle from "./Circle";

function Member({memberId, title, talentIds, data}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Member,
    item: {
      memberId: memberId,
      groupId: data[memberId].parent,
      type: ItemTypes.Member
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  const [{isOver}, drop] = useDrop(() => ({
    accept: ItemTypes.Talent,
    drop: (item) => {
      appendTalent(memberId, item.talentId)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  function attachRef(el) {
    drag(el)
    drop(el)
  }

  const talents = Object.values(data)
    .filter((elem) => talentIds.includes(elem.id))
    .sort((a, b) => a.created <= b.created ? -1 : 1);
  return (
    <div
      ref={attachRef}
      style={{
        position: 'relative',
        borderRadius: 10,
        padding: 5,
        margin: 5,
        backgroundColor: 'lightgray',
        opacity: isDragging ? 0.3 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        cursor: 'grab',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <ToggleInput value={title} elemId={memberId}/>
        <div style={{display: 'flex'}}>
          {talents.map((talent) =>
            <div key={talent.id} style={{padding: 2}}>
              <Circle color={talent.color}/>
            </div>)}
        </div>
      </div>
      {isOver && <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          opacity: 0.5,
          borderRadius: 10,
        }}
      />}
    </div>
  )
}

Member.defaultProps = {
  data: {},
  talentIds: [],
}

export default Member;