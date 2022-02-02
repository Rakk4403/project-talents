const WSURL = process.env.REACT_APP_WSURL;
const DEBUG = process.env.REACT_APP_DEBUG;
export const ACTION = 'create';
let ws = null;
let connectInterval = null;

const connect = () => {
  return new Promise((res, rej) => {
    ws = new WebSocket(WSURL);
    ws.onopen = () => {
      clearInterval(connectInterval);
      console.log('websocket connected', ws)
      res(ws);
    }
    ws.onerror = (err) => {
      rej(err)
    }
    ws.onclose = () => {
      connectInterval = setInterval(() => {
        if (connected()) {
          connectInterval(connectInterval)
          return
        }
        connect()
      }, 1000);
    }
  });
}
connect();

const send = async (data) => {
  if (DEBUG) return;
  if (connected()) {
    ws.send(JSON.stringify(data));
    return;
  }
  ws = await connect()
  await send(data)
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