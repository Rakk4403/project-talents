import {useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {addElem} from "../data/Data";
import Member from "./Member";

function Group(props) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.Member,
    drop: (item, monitor) => {
      addElem(props.groupId, item.memberId)
      console.log('dropped', item, monitor)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  const members = props.members;

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        backgroundColor: props.color,
        opacity: props.selected ? 0.3 : 1,
        width: 100,
        height: 100,
      }}
    >
      teamname: {props.title}
      {props.selected}
      {members && members.map((user) => (
        <Member
          key={user.id}
          title={user.title}
          memberId={user.id}
        >
        </Member>
      ))}
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

export default Group;