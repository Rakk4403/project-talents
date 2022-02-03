import {
  getGroups,
  getLevel, getMembers, getMembersMerged,
  getParentId,
  setLevel
} from "../data/Data";
import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";

import {dropCallable} from "../util/utils";

function MinimizedGroup({
                          groupId, title, data, style,
                          disableBubbleChart, disableDrag, disableDrop
                        }) {
  const level = getLevel(groupId);
  const [{isOverCurrent, dragItem}, drop] = useDrop(() => ({
    accept: [ItemTypes.Member, ItemTypes.Group],
    drop: dropCallable(groupId),
    collect: monitor => ({
      isOverCurrent: monitor.isOver({shallow: true}),
      dragItem: monitor.getItem(),
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
  const isOverStyle = isOverCurrent && dragItem.groupId !== groupId ? {
    backgroundColor: 'lightgray',
  } : {};
  return (
    <div
      ref={attachRef}
      style={{
        display: 'flex',
        flexFlow: 'column',
        position: 'relative',
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
          justifyContent: 'space-between',
          alignItems: 'center',
          ...isOverStyle,
        }}>
        <div style={{fontWeight: 'bold', padding: 5}}>
          {title}
        </div>
        <span style={{margin: 5}}>▼</span>
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