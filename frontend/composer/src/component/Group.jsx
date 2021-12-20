import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {
  appendMember,
  getChildrenLevels,
  getGroups,
  getLevel,
  getMembers,
  getMembersMerged, getParent,
  setLevel
} from "../data/Data";
import Member from "./Member";
import ToggleInput from "./ToggleInput";
import BubbleChart from "./BubbleChart";

function Group({
                 groupId, title, data, style,
                 disableBubbleChart, disableDrag, disableDrop
               }) {
  const level = getLevel(groupId);
  const [{isOverCurrent}, drop] = useDrop(() => ({
    accept: [ItemTypes.Member, ItemTypes.Group],
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      if (item.type === ItemTypes.Group) {
        appendMember(groupId, item.groupId)
      } else if (item.type === ItemTypes.Member) {
        appendMember(groupId, item.memberId)
      } else {
        console.error('ItemTypes error', item)
      }

      if (item.type === ItemTypes.Group) {
        const childrenLevels = getChildrenLevels(groupId);
        childrenLevels.push(item.level);
        const nextLevel = Math.max(...childrenLevels) + 1;
        setLevel(groupId, nextLevel)
        console.log(title, level, item.level, nextLevel)
        return {title}
      }
    },
    canDrop: (item, monitor) => {
      console.log('candrop', groupId)
      return item.groupId !== groupId;
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver({shallow: true}),
    }),
  }), [level, setLevel])

  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Group,
    item: {
      groupId: groupId,
      level: level,
      type: ItemTypes.Group,
      prevParent: getParent(groupId),
    },
    end: (item, monitor) => {
      if (!item.prevParent) return
      const childrenLevels = getChildrenLevels(item.prevParent);
      childrenLevels.splice(childrenLevels.indexOf(item.level), 1)
      if (!childrenLevels || childrenLevels.length === 0) {
        setLevel(item.prevParent, 1)
        return
      }
      const nextLevel = Math.max(...childrenLevels) + 1;
      setLevel(item.prevParent, nextLevel)
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [level, setLevel])
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

  const width = style && style.width || 100 + level * 100;
  const isOverStyle = isOverCurrent ? {
    backgroundColor: 'lightgray',
  } : {};
  return (
    <div
      ref={disableDrop ? null : drop}
      style={{
        display: 'flex',
        flexFlow: 'column',
        position: 'relative',
        minWidth: width,
        maxWidth: width,
        minHeight: 300,
        border: '1px solid gray',
        borderRadius: 5,
        backgroundColor: 'white',
        ...style,
      }}
    >
      <div
        ref={disableDrag ? null : drag}
        style={{
          display: 'flex',
          flexFlow: 'column',
          minHeight: 300,
          gap: 5,
          ...isOverStyle,
        }}>
        <div style={{fontWeight: 'bold', padding: 5}}>
          <ToggleInput value={title} elemId={groupId}/>
        </div>
        {!disableBubbleChart &&
        <BubbleChart
          useLabels
          data={Object.keys(talentCountMap)
            .map((key) => ({
              v: talentCountMap[key],
              title: data[key].title,
              color: data[key].color,
            }))}
        />
        }
        <div
          style={{display: 'flex', gap: 5, margin: 5, overflow: 'auto'}}>
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
    </div>
  )
}

Group.defaultProps = {
  data: {},
  members: [],
  disableDrag: false,
  disableDrop: false,
}

export default Group;