const WSURL = process.env.REACT_APP_WSURL;
export const ACTION = 'create';
export const ws = new WebSocket(WSURL);

export const connected = () => {
  return ws.readyState === 1;
}

export const createItem = (item) => {
  const data = {
    operation: 'create',
    action: ACTION,
    item: item,
  }
  ws.send(JSON.stringify(data))
}
export const updateItem = (item) => {
  const data = {
    operation: 'update',
    action: ACTION,
    item: item,
  };
  ws.send(JSON.stringify(data));
}
export const deleteItem = (item) => {
  const data = {
    operation: 'delete',
    action: ACTION,
    item: item,
  };
  ws.send(JSON.stringify(data));
}
export const requestList = (projectId) => {
  const data = {operation: 'list', action: ACTION, projId: projectId}
  ws.send(JSON.stringify(data));
}
