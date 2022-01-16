import {
  appendMember,
  getAncestorsId,
  getChildrenLevels,
  getGroups,
  getLevel, getMembers, getMembersMerged,
  getParentId,
  setLevel
} from "../data/Data";
import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import ToggleInput from "./ToggleInput";
import BubbleChart from "./BubbleChart";
import Member from "./Member";

function MinimizedGroup({
                          groupId, title, data, style,
                          disableBubbleChart, disableDrag, disableDrop
                        }) {
  const level = getLevel(groupId);
  const [{isOverCurrent}, drop] = useDrop(() => ({
    accept: [ItemTypes.Member, ItemTypes.Group],
    drop: (item, monitor) => {
      if (monitor.didDrop() && !monitor.canDrop()) {
        return;
      }
      if (item.type === ItemTypes.Group) {
        if (getAncestorsId(groupId).includes(item.groupId)) {
          return;
        }
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
        return {title}
      }
    },
    canDrop: (item, monitor) => {
      return item.groupId !== groupId && item.prevParent !== groupId;
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver({shallow: true}),
    }),
  }), [level, setLevel])

  const [, drag] = useDrag(() => ({
    type: ItemTypes.Group,
    item: {
      groupId: groupId,
      level: level,
      type: ItemTypes.Group,
      prevParent: getParentId(groupId),
    },
    end: (item, monitor) => {
      // arrangeLevel(item.prevParent)
      // arrangeLevel(item.id)
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [level, setLevel])

  function attachRef(el) {
    !disableDrag && drag(el)
    !disableDrop && drop(el)
  }

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

  const width = (style && style.width) || 100 + level * 150;
  const isOverStyle = isOverCurrent ? {
    backgroundColor: 'lightgray',
  } : {};
  return (
    <div
      ref={attachRef}
      style={{
        display: 'flex',
        flexFlow: 'column',
        position: 'relative',
        minWidth: 200,
        //minHeight: 300,
        border: '1px solid gray',
        borderRadius: 5,
        backgroundColor: 'white',
        cursor: 'grab',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexFlow: 'column',
          //minHeight: 300,
          gap: 5,
          alignItems: 'center',
          ...isOverStyle,
        }}>
        <div style={{fontWeight: 'bold', padding: 5}}>
          <ToggleInput value={title} elemId={groupId}/>
        </div>
      </div>
    </div>
  )
}

MinimizedGroup.defaultProps = {
  data: {},
  members: [],
  disableDrag: false,
  disableDrop: false,
}

export default MinimizedGroup;