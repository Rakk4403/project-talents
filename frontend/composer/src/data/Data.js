import {ItemTypes} from "./types";

const Data = {
  'g0': { id: 'g0', parent: null, children: [], title: 'group1', type: ItemTypes.Group },
  'g1': { id: 'g1',  parent: null, children: [], title: 'group2', type: ItemTypes.Group },
  'g2': { id: 'g2',  parent: null, children: [], title: 'group3', type: ItemTypes.Group },
  'm0': { id: 'm0',  parent: null, children: [], title: 'member1', type: ItemTypes.Member },
  'm1': { id: 'm1',  parent: null, children: [], title: 'member2', type: ItemTypes.Member },
  'm2': { id: 'm2',  parent: null, children: [], title: 'member3', type: ItemTypes.Member },
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

export const addElem = (groupId, memberId) => {
  const prevGroupId = getParent(memberId);
  removeChild(prevGroupId, memberId);
  addChild(groupId, memberId);
  changeParent(memberId, groupId);
  console.log('Data', Data);
  emitChange();
}

export const observe = (o) => {
  observer = o;
  emitChange();
}