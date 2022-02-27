import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {
  getChildrenLevels,
  getGroups, getGroupsMerged,
  getLevel,
  getMembers,
  getMembersMerged, getParentId,
  setLevel
} from "../data/Data";
import Member from "./Member";
import ToggleInput from "./ToggleInput";
import BubbleChart from "./BubbleChart";
import {useState} from "react";
import MinimizedGroup from "./MinimizedGroup";
import {dropCallable, isMobile} from "../util/utils";

function arrangeLevel(groupId) {
  if (!groupId) return
  const childrenLevels = getChildrenLevels(groupId);
  childrenLevels.splice(childrenLevels.indexOf(getLevel(groupId)), 1)
  if (!childrenLevels || childrenLevels.length === 0) {
    setLevel(groupId, 1)
    arrangeLevel(getParentId(groupId))
    return
  }
  const nextLevel = Math.max(...childrenLevels) + 1;
  arrangeLevel(getParentId(groupId))
  setLevel(groupId, nextLevel)
}

function Group({
                 groupId, title, data, style,
                 disableBubbleChart, disableDrag, disableDrop,
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
      arrangeLevel(item.prevParent)
      arrangeLevel(item.id)
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [level, setLevel])

  function attachRef(el) {
    !disableDrag && drag(el)
    !disableDrop && drop(el)
  }

  const [expendedGroups, setExpendedGroups] = useState([]);

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
        minWidth: 200,
        width: 'fit-content',
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
          gap: 5,
          ...isOverStyle,
        }}>
        {title && !disableBubbleChart &&
        <div style={{display: 'flex', flexFlow: 'column', justifyContent: 'start'}}>
          {title &&
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'left',
            fontWeight: 'bold',
            padding: 5,
          }}>
            <ToggleInput value={title} elemId={groupId}/>
            <span>▲</span>
          </div>
          }
          {!disableBubbleChart &&
          <BubbleChart
            useLabels
            data={Object.keys(talentCountMap)
              .map((key) => ({
                v: talentCountMap[key],
                title: data[key].title,
                color: data[key].color,
              }))}
            onClick={(e) => isMobile() && e.stopPropagation()}
          />
          }
        </div>
        }
        <div style={{display: 'flex', flexFlow: 'column', minWidth: 200}}>
          <div style={{overflowY: 'auto', minWidth: 100, maxWidth: 250}}>
            {members && members
              .map((user) => (
                <div
                  key={user.id}
                  style={{width: '100%'}}
                >
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
          <div>
            {groups.map((group) => {
              if (expendedGroups.includes(group.id)) {
                return (
                  <div
                    key={group.id}
                    style={{margin: 5, minWidth: 400}}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newGroups = [...expendedGroups]
                      newGroups.splice(newGroups.indexOf(group.id), 1)
                      setExpendedGroups(newGroups)
                    }}
                  >
                    <Group
                      data={data}
                      groupId={group.id}
                      title={group.title}
                    />
                  </div>
                )
              } else {
                return (
                  <div
                    style={{margin: 5}}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newGroups = [...expendedGroups]
                      newGroups.push(group.id)
                      setExpendedGroups(newGroups)
                    }}>
                    <MinimizedGroup
                      data={data}
                      groupId={group.id}
                      title={group.title}
                      childrenGroup={getGroupsMerged(group.id)}
                      childrenMember={getMembersMerged(group.id)}
                    />
                  </div>
                )
              }
            })}
          </div>
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