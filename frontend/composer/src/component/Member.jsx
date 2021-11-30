import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {appendElem} from "../data/Data";

function Member({ memberId, title, talentIds, data }) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Member,
    item: {memberId: memberId},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.Talent,
    drop: (item) => {
      appendElem(memberId, item.talentId)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  const talents = Object.values(data).filter((elem) => talentIds.includes(elem.id));
  return (
    <div ref={drop} style={{ position: 'relative'}}>
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.3 : 1,
        backgroundColor: 'lightgray',
        width: 100,
      }}>
      {title}
      {talents.map((talent) => <div>{talent.title}</div>)}
    </div>
      {isOver && <div
        style={{
          position:'absolute',
          top: 0,
          left: 0,
          width:'100%',
          height:'100%',
          backgroundColor: 'black',
          opacity: 0.5,
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