import {useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {appendElem} from "../data/Data";
import Member from "./Member";

function Group({ groupId, title, members, color, data }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.Member,
    drop: (item, monitor) => {
      appendElem(groupId, item.memberId)
      console.log('dropped', item, monitor)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  let talentsForMembers = [];
  members.forEach(member => {
    if (member.children) {
      talentsForMembers = talentsForMembers.concat(member.children);
    }
  })
  console.log('talentsForMembers', talentsForMembers);
  const talentCountMap = {};
  talentsForMembers.forEach(talentId => {
    if (!talentCountMap[talentId]) {
      talentCountMap[talentId] = 0
    }
    talentCountMap[talentId] += 1;
  })
  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        backgroundColor: color,
        width: 100,
        minHeight: 300,
      }}
    >
      <h4>{title}</h4>
      <div>
        {Object.keys(talentCountMap).map(key => <div>{`${data[key].title} : ${talentCountMap[key]}`}</div>)}
      </div>
      {members && members.map((user) => (
        <Member
          key={user.id}
          title={user.title}
          memberId={user.id}
          talentIds={user.children}
          data={data}
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

Group.defaultProps = {
  data: {},
}

export default Group;