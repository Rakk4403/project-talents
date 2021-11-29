import {ItemTypes} from "./types";

const Data = {
  'g0': { id: 'g0', parent: null, children: [], title: 'group1', type: ItemTypes.Group },
  'g1': { id: 'g1',  parent: null, children: [], title: 'group2', type: ItemTypes.Group },
  'g2': { id: 'g2',  parent: null, children: [], title: 'group3', type: ItemTypes.Group },
  'm0': { id: 'm0',  parent: null, children: ['t0', 't1', 't2'], title: 'member1', type: ItemTypes.Member },
  'm1': { id: 'm1',  parent: null, children: ['t1', 't2'], title: 'member2', type: ItemTypes.Member },
  'm2': { id: 'm2',  parent: null, children: ['t2'], title: 'member3', type: ItemTypes.Member },
  't0': { id: 't0', title: 'talent1', type:ItemTypes.Talent },
  't1': { id: 't1', title: 'talent2', type:ItemTypes.Talent },
  't2': { id: 't2', title: 'talent3', type:ItemTypes.Talent },
};


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

const addChild = (elemId, newChildId) => {
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

const getParent = (elemId) => {
  return Data[elemId] && Data[elemId].parent;
}


let observer = null;

const emitChange = () => {
  observer(Data);
}

export const appendElem = (groupId, memberId) => {
  const prevGroupId = getParent(memberId);
  removeChild(prevGroupId, memberId);
  addChild(groupId, memberId);
  changeParent(memberId, groupId);
  console.log('Data', Data);
  emitChange();
}

export const addElem = (itemType) => {
  const randomId = (Math.random()+1).toString(36).substring(2, 7);
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
  };
  emitChange();
}

export const deleteElem = (elemId) => {
  delete Data[elemId];
  emitChange();
}
export const observe = (o) => {
  observer = o;
  emitChange();
}