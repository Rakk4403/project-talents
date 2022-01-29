import {useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {appendMember, getGroups, getProjectName, setProjectId, wsHandler} from "../data/Data";
import Group from "../component/Group";
import ControlPanel from "./ControlPanel";
import {useParams} from "react-router-dom";
import {connected, getWebsocket, requestList} from "../data/Websocket";
import {useEffect, useRef, useState} from "react";
import {isMobile} from "../util/utils";
import MobileControlPanel from "./MobileControlPanel";

let getProjectIdInterval;

function MainContent({data = {}, children}) {
  const params = useParams();
  const [zoomValue, setZoomValue] = useState(1);
  useEffect(() => {
    const ws = getWebsocket();
    ws.addEventListener('message', wsHandler);

    getProjectIdInterval = setInterval(() => {
      if (connected() && params.projectId) {
        setProjectId(params.projectId || '');
        requestList(params.projectId);
        clearInterval(getProjectIdInterval);
      }
    }, 1000);

  }, [params.projectId]);

  const [{isOver}, drop] = useDrop(() => ({
    accept: ItemTypes.Group,
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      appendMember(null, item.groupId || item.memberId)
      return {title: 'playground'}
    },
    canDrop: (item, monitor) => {
      return item.groupId && item.prevParent !== null;
    },
    collect: monitor => {
      return {
        isOver: !!monitor.isOver({shallow: true})
          && monitor.getItem().prevParent !== null,
      };
    },
  }), [])

  const groups = getGroups();
  const zoomable = useRef(null);
  useEffect(() => {
    if (zoomable.current &&
      (window.innerWidth < zoomable.current.scrollWidth
        || window.innerHeight < zoomable.current.scrollHeight)) {
      const panelWidth = 250;
      const widthRatio = window.innerWidth / (zoomable.current.scrollWidth + panelWidth);
      const heightRatio = window.innerHeight / zoomable.current.scrollHeight;
      console.log(window.innerWidth, zoomable.current.scrollWidth,
        window.innerHeight, zoomable.current.scrollHeight,
        widthRatio, heightRatio
      )
      setZoomValue(widthRatio < heightRatio ? widthRatio : heightRatio)
    }
  }, [zoomable.current])
  return (
    <>
      <div style={{
        display: 'flex',
        width: '100%',
        height: window.innerHeight - 500,
      }}>
        <div style={{
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'start',
          width: '100%',
        }}>
          <h1>{getProjectName()}</h1>
          <div
            id='zoomable'
            ref={zoomable}
            style={{
              zoom: zoomValue
            }}
          >
            <div
              id="playground"
              ref={drop}
              style={{
                padding: 10,
                opacity: isOver ? 0.3 : 1,
                backgroundColor: isOver ? 'lightgray' : 'transparent',
                display: 'flex',
                flexWrap: 'wrap',
                width: '80%',
              }}
            >
              {groups.map((group) => {
                return (
                  <div key={group.id} style={{margin: 5}}>
                    <Group
                      data={data}
                      key={group.id}
                      groupId={group.id}
                      title={group.title}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {children}
        <div style={{float: 'right'}}>
          {!isMobile() && <ControlPanel data={data}/>}
        </div>
      </div>
      {isMobile() && <MobileControlPanel data={data}/>}
    </>
  );
}

export default MainContent;