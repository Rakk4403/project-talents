import PropTypes from "prop-types";
import {useDrag} from "react-dnd";
import {ItemTypes} from "../data/types";


function Member (props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.Member,
    item: { memberId: props.memberId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))


  return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.3 : 1,
          backgroundColor: 'lightgray',
          width: 100,
          height: 20,
        }}>
        {props.title}
      </div>
  )
}

Member.propTypes = {
  title: PropTypes.string,
  memberId: PropTypes.number,
}

export default Member;