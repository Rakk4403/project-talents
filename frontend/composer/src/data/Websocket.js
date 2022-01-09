const WSURL = process.env.REACT_APP_WSURL;
export const ACTION = 'create';
let ws = new WebSocket(WSURL);

let pingInterval;
ws.onopen = (e) => {
  pingInterval = setInterval(() => {
    ws.send(JSON.stringify({operation: 'ping', action: ACTION}));
  }, 40000);
}
ws.onclose = () => {
  clearInterval(pingInterval);
}

const send = (data) => {
  if (connected()) {
    ws.send(JSON.stringify(data));
    return true;
  }
  return false;
}

export const getWebsocket = () => {
  return ws;
}

export const connected = () => {
  if (ws) {
    return ws.readyState === 1;
  }
  return false;
}

export const createItem = (item) => {
  const data = {operation: 'create', action: ACTION, item: item}
  send(data)
}
export const updateItem = (item) => {
  const data = {operation: 'update', action: ACTION, item: item};
  send(data)
}
export const deleteItem = (item) => {
  const data = {operation: 'delete', action: ACTION, item: item};
  send(data)
}
export const requestList = (projectId) => {
  const data = {operation: 'list', action: ACTION, projId: projectId}
  send(data)
}
export const sendProjectId = (projectId) => {
  const data = {operation: 'landing', action: ACTION, projId: projectId}
  send(data)
}