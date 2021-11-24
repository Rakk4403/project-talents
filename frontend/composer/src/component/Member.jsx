import {useDrag} from "react-dnd";
import {ItemTypes} from "../data/types";

function Member({ memberId, title, talentIds, data }) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Member,
    item: {memberId: memberId},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  const talents = Object.values(data).filter((elem) => talentIds.includes(elem.id));
  return (
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
  )
}

Member.defaultProps = {
  data: {},
  talentIds: [],
}

export default Member;