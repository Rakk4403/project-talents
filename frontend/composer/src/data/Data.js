import {ItemTypes} from "./types";
import {createItem, deleteItem, requestList, sendProjectId, updateItem} from "./Websocket";

let projectId = '';

export const generateRandomColor = () => {
  function r() {
    return Math.floor(Math.random() * 255)
  }

  return 'rgb(' + r() + "," + r() + "," + r() + ')';
}

const cleanupChildren = () => {
  Object.values(Data).forEach((elem) => {
    let modified = false;
    if (elem.parent && !Data[elem.parent]) {
      elem.parent = '';
      modified = true;
    }
    if (elem.children) {
      const elemsToDelete = [];
      elem.children.forEach((childId) => {
        if (!Data[childId]) {
          elemsToDelete.push(childId)
        }
      })
      elemsToDelete.forEach((delId) => {
        elem.children.splice(elem.children.indexOf(delId), 1);
        modified = true;
      })
    }
    if (modified) {
      updateItem(elem);
    }
  })
}

export const wsHandler = (e) => {
  if (e.data === 'pong') return;

  const data = JSON.parse(e.data);
  if (data.operation === 'create') {
    Data[data.item.id] = data.item;
  } else if (data.operation === 'delete') {
    delete Data[data.item.id];
  } else if (data.operation === 'update') {
    Data[data.item.id] = data.item;
  } else if (data.operation === 'list') {
    data.items.forEach((item) => {
      Data[item.id] = item;
    })

    cleanupChildren();
  } else if (data.message === 'Internal server error') {
    requestList(projectId)
    return;
  }
  emitChange();
}
const Data = {};
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
  updateItem(Data[elemId]);
}

const removeChild = (elemId, childId) => {
  if (elemId) {
    const idx = Data[elemId].children.indexOf(childId)
    idx !== -1 && Data[elemId].children.splice(idx, 1);
    updateItem(Data[elemId]);
  }
}

export const getParentId = (elemId) => {
  return Data[elemId] && Data[elemId].parent;
}


let observer = null;

const emitChange = () => {
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
  updateItem(Data[groupId]);
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
    Data[groupId] && Data[groupId].children.length > 0
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
  const prevGroupId = getParentId(memberId);
  removeChild(prevGroupId, memberId);
  updateItem(Data[prevGroupId])
  addChild(groupId, memberId);
  updateItem(Data[groupId])
  changeParent(memberId, groupId);
  updateItem(Data[memberId])
}

export const appendTalent = (memberId, talentId) => {
  if (memberId && hasChild(memberId, talentId)) {
    return;
  }
  addChild(memberId, talentId);
  updateItem(Data[memberId]);
}

export const addElem = (itemType) => {
  let prefix = 'Group';
  if (itemType === ItemTypes.Member) {
    prefix = 'Member';
  } else if (itemType === ItemTypes.Talent) {
    prefix = 'Talent';
  }
  const elemCount = Object.values(Data)
    .filter((elem) => elem.type === itemType)
    .length
  const elem = {
    title: `${prefix}${elemCount}`,
    type: itemType,
    children: [],
    color: generateRandomColor(),
    projId: projectId,
  };
  createItem(elem)
}

const deleteElemFromAllChildren = (elemId) => {
  Object.keys(Data).forEach((key) => {
    if (Data[key].children && Data[key].children.includes(elemId)) {
      const idx = Data[key].children.indexOf(elemId)
      Data[key].children.splice(idx, 1);
      updateItem(Data[key]);
    }
  })
}

export const deleteElem = (elemId) => {
  deleteElemFromAllChildren(elemId)
  if (Data[elemId].type === ItemTypes.Group) {
    Data[elemId].children
      .filter((childId) => Data[childId].type === ItemTypes.Group)
      .forEach((childId) => {
        changeParent(childId, null);
        updateItem(Data[childId])
      })
    Data[elemId].children
      .filter((childId) => Data[childId].type === ItemTypes.Member)
      .forEach((childId) => {
        changeParent(childId, null);
        updateItem(Data[childId])
      })
  } else if (Data[elemId].type === ItemTypes.Member) {

  } else if (Data[elemId].type === ItemTypes.Talent) {

  }
  deleteItem(Data[elemId]);
}

export const modifyElemTitle = (elemId, title) => {
  Data[elemId].title = title;
  updateItem(Data[elemId]);
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

export const setProjectId = (val) => {
  projectId = val;
  sendProjectId(val);
}

export const getProjectName = () => {
  return projectId;
}

export const getAncestorsId = (elemId) => {
  let l = [];
  if (Data[elemId].parent) {
    const ancestors = getAncestorsId(Data[elemId].parent);
    l.push(Data[elemId].parent)
    return l.concat(ancestors)
  }
  return [];
}