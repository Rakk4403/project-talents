import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {appendMember} from "../data/Data";
import Member from "./Member";
import ToggleInput from "./ToggleInput";

function Group({groupId, title, members, data}) {
  const [{isOver}, drop] = useDrop(() => ({
    accept: [ItemTypes.Member, ItemTypes.Group],
    drop: (item) => {
      appendMember(groupId, item.groupId || item.memberId)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Member,
    item: {groupId: groupId},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  const groups = Object.keys(data)
    .filter((key) => data[key].parent === groupId && data[key].type === ItemTypes.Group)
    .map((key) => data[key]);

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
        position: 'relative',
        margin: 5,
        width: 200,
        height: 300,
        maxHeight: 500,
        border: '1px solid gray',
        borderRadius: 5,
      }}
    >
      <div
        ref={drag}
        style={{display: 'flex', flexDirection: 'column', height: '100%'}}
      >
        <div style={{fontWeight: 'bold'}}>
          <ToggleInput value={title} elemId={groupId}/>
        </div>
        <div>
          {Object.keys(talentCountMap).map(key => <div>{`${data[key].title} : ${talentCountMap[key]}`}</div>)}
        </div>
        <div>
          {groups && groups.map((group) => (
            <Group
              groupId={group.id}
              title={group.title}
              members={group.children}
              data={data}
            />
          ))}
        </div>
        <div style={{overflow: 'auto'}}>
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
    </div>
  )
}

Group.defaultProps = {
  data: {},
  members: [],
}

export default Group;