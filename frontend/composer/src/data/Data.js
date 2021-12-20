import {ItemTypes} from "./types";

export const generateRandomColor = () => {
  function r() {
    return Math.floor(Math.random() * 255)
  }

  return 'rgb(' + r() + "," + r() + "," + r() + ')';
}

const Data = {
  'g0': {id: 'g0', parent: null, children: [], title: 'group1', type: ItemTypes.Group},
  'g1': {id: 'g1', parent: null, children: [], title: 'group2', type: ItemTypes.Group},
  'g2': {id: 'g2', parent: null, children: [], title: 'group3', type: ItemTypes.Group},
  'm0': {id: 'm0', parent: null, children: ['t0', 't1', 't2'], title: 'member1', type: ItemTypes.Member},
  'm1': {id: 'm1', parent: null, children: ['t1', 't2'], title: 'member2', type: ItemTypes.Member},
  'm2': {id: 'm2', parent: null, children: ['t2'], title: 'member3', type: ItemTypes.Member},
  't0': {id: 't0', title: 'talent1', type: ItemTypes.Talent},
  't1': {id: 't1', title: 'talent2', type: ItemTypes.Talent},
  't2': {id: 't2', title: 'talent3', type: ItemTypes.Talent},
};
Object.keys(Data).forEach((key) => Data[key].color = generateRandomColor());

const changeParent = (elemId, newParentId) => {
  if (Data[elemId]) {
    Data[elemId].parent = newParentId;
  } else {
    Data[elemId] = {
      ...Data[elemId],
      parent: newParentId,
    };
  }
}

const generateRandomId = () => {
  return (Math.random() + 1).toString(36).substring(2, 7);
}

const hasChild = (elemId, childId) => {
  return Data[elemId].children.includes(childId);
}
const addChild = (elemId, newChildId) => {
  if (!elemId) {
    return;
  }
  if (Data[elemId] && Data[elemId].children) {
    Data[elemId].children.push(newChildId);
  } else {
    Data[elemId] = {
      ...Data[elemId],
      children: [newChildId],
    };
  }
}

const removeChild = (elemId, childId) => {
  if (elemId) {
    const idx = Data[elemId].children.indexOf(childId)
    idx !== -1 && Data[elemId].children.splice(idx, 1);
  }
}

export const getParent = (elemId) => {
  return Data[elemId] && Data[elemId].parent;
}


let observer = null;

const emitChange = () => {
  console.log('Data', Data);
  observer(Data);
}

export const getChildrenLevels = (groupId) => {
  if (Data[groupId]) {
    return Data[groupId].children.map(childId => getLevel(childId));
  }
  return [];
}
export const getLevel = (groupId) => {
  if (Data[groupId]) {
    return Data[groupId].level || 1
  }
  return 0
}

export const setLevel = (groupId, level) => {
  Data[groupId].level = level;
  emitChange();
}

export const getGroups = (groupId) => {
  if (groupId) {
    return Object.values(Data).filter(
      (elem) => elem.type === ItemTypes.Group && elem.parent === groupId
    )
  } else {
    return Object.values(Data).filter(
      (elem) => elem.type === ItemTypes.Group && !elem.parent
    )
  }
}

export const getMembers = (groupId) => {
  if (!groupId) {
    return Object.values(Data)
      .filter((elem) =>
        elem.type === ItemTypes.Member
        && !elem.parent
      )
  }
  const memberIds =
    Data[groupId] && Data[groupId].children
      ? Data[groupId].children
        .filter((memberId) => Data[memberId].type === ItemTypes.Member)
      : [];
  return Object.values(Data).filter((elem) => memberIds.includes(elem.id));
}

export const getMembersMerged = (groupId) => {
  if (!groupId) {
    return Object.values(Data)
      .filter((elem) => !elem.parent)
      .filter((elem) => elem.type === ItemTypes.Member)
  }
  let members = [];
  if (Data[groupId] && Data[groupId].children) {
    Data[groupId].children
      .filter((childId) => Data[childId].type === ItemTypes.Group)
      .forEach((groupId) => {
        const m = getMembersMerged(groupId);
        members = members.concat(m);
      })
  }

  const ownMembers = getMembers(groupId);
  return members.concat(ownMembers);
}

export const appendMember = (groupId, memberId) => {
  if (groupId && hasChild(groupId, memberId)) {
    return;
  }
  const prevGroupId = getParent(memberId);
  removeChild(prevGroupId, memberId);
  addChild(groupId, memberId);
  changeParent(memberId, groupId);
  emitChange();
}

export const appendTalent = (memberId, talentId) => {
  if (memberId && hasChild(memberId, talentId)) {
    return;
  }
  addChild(memberId, talentId);
  changeParent(talentId, memberId);
  emitChange();
}

export const addElem = (itemType) => {
  const randomId = generateRandomId();
  let prefix = 'Group';
  if (itemType === ItemTypes.Member) {
    prefix = 'Member';
  } else if (itemType === ItemTypes.Talent) {
    prefix = 'Talent';
  }
  Data[randomId] = {
    id: randomId,
    title: `${prefix}-${randomId}`,
    type: itemType,
    children: [],
    color: generateRandomColor(),
  };
  emitChange();
}

const deleteElemFromAllChildren = (elemId) => {
  Object.keys(Data).forEach((key) => {
    if (Data[key].children && Data[key].children.includes(elemId)) {
      Data[key].children.splice(elemId, 1);
    }
  })
}

export const deleteElem = (elemId) => {
  deleteElemFromAllChildren(elemId)
  if (Data[elemId].type === ItemTypes.Group) {
    Data[elemId].children
      .filter((childId) => Data[childId].type === ItemTypes.Group)
      .forEach((childId) => {
        removeChild(elemId, childId)
        changeParent(childId, null);
      })
  } else if (Data[elemId].type === ItemTypes.Member) {

  } else if (Data[elemId].type === ItemTypes.Talent) {

  }
  delete Data[elemId];
  emitChange();
}

export const modifyElemTitle = (elemId, title) => {
  Data[elemId].title = title;
  emitChange();
}

export const reset = () => {
  Object.keys(Data).forEach((key) => {
    if (Data[key].type === ItemTypes.Group) {
      Data[key].children = [];
    }
    Data[key].parent = null;
  })
  emitChange();
}


export const observe = (o) => {
  observer = o;
  emitChange();
}