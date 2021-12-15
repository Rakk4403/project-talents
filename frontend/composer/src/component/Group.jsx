import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {appendMember, getGroups, getMembers, getMembersMerged} from "../data/Data";
import Member from "./Member";
import ToggleInput from "./ToggleInput";
import BubbleChart from "./BubbleChart";
import MemberedGroup from "./MemberedGroup";

function Group({groupId, title, data, disableShowTalent, style}) {
  const [{isOver}, drop] = useDrop(() => ({
    accept: [ItemTypes.Member, ItemTypes.Group],
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      appendMember(groupId, item.groupId || item.memberId)
    },
    canDrop: (item, monitor) => {
      return item.groupId !== groupId;
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

  const groups = groupId ? getGroups(groupId) : [];
  const members = getMembers(groupId);
  const mergedMembers = getMembersMerged(groupId);
  let talentsForMembers = [];
  mergedMembers
    .filter((member) => member.type === ItemTypes.Member)
    .forEach(member => {
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
        minWidth: 200,
        maxWidth: 300,
        minHeight: 300,
        border: '1px solid gray',
        borderRadius: 5,
        ...style,
      }}
    >
      <div
        ref={drag}
        style={{
          display: 'flex',
          flexFlow: 'column',
          minWidth: 200,
          minHeight: 300,
          gap: 5,
        }}>
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
        <div style={{display: 'flex', gap: 5, margin: 5, overflow: 'auto'}}>
          {groups.map((group) => (
            <Group
              key={group.id}
              data={data}
              groupId={group.id}
              title={group.title}
            />
          ))}
        </div>
        <div style={{overflow: 'auto', padding: 5}}>
          {members && members
            .map((user) => (
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