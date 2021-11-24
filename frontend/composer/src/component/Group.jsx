import {useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {addElem} from "../data/Data";
import Member from "./Member";

function Group({ groupId, title, members, color }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.Member,
    drop: (item, monitor) => {
      addElem(groupId, item.memberId)
      console.log('dropped', item, monitor)
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
        backgroundColor: color,
        width: 100,
        height: 100,
      }}
    >
      teamname: {title}
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