import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {appendMember} from "../data/Data";
import Member from "./Member";
import ToggleInput from "./ToggleInput";
import BubbleChart from "./BubbleChart";

function Group({groupId, title, members, data, disableShowTalent, style}) {
  const [{isOver}, drop] = useDrop(() => ({
    accept: [ItemTypes.Member],
    drop: (item) => {
      appendMember(groupId, item.groupId || item.memberId)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Group,
    item: {groupId: groupId},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  let talentsForMembers = [];
  members.forEach(member => {
    if (member.children) {
      talentsForMembers = talentsForMembers.concat(member.children);
    }
  })
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
        display: 'flex',
        flexFlow: 'column',
        position: 'relative',
        width: 200,
        height: 300,
        maxHeight: 500,
        border: '1px solid gray',
        borderRadius: 5,
        ...style,
      }}
    >
      <div ref={drag} style={{height: '100%', display: 'flex', flexFlow: 'column'}}>
        <div style={{fontWeight: 'bold', padding: 5}}>
          <ToggleInput value={title} elemId={groupId}/>
        </div>
        <BubbleChart
          useLabels
          data={Object.keys(talentCountMap)
            .map((key) => ({
              v: talentCountMap[key],
              title: data[key].title,
              color: data[key].color,
            }))}
        />
        <div style={{overflow: 'auto', padding: 5}}>
          {members && members.map((user) => (
            <div style={{paddingRight: 5, paddingLeft: 5}}>
              <Member
                key={user.id}
                title={user.title}
                memberId={user.id}
                talentIds={user.children}
                data={data}
              >
              </Member>
            </div>
          ))}
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
          opacity: 0.3,
        }}
      />}
    </div>
  )
}

Group.defaultProps = {
  data: {},
  members: [],
}

export default Group;