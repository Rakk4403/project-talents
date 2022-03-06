import {useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {
  appendMember,
  getGroups,
  getProjectName,
  setProjectId,
  wsHandler
} from "../data/Data";
import Group from "../component/Group";
import ControlPanel from "./ControlPanel";
import {Link, useParams} from "react-router-dom";
import {connected, getWebsocket, requestList} from "../data/Websocket";
import {useEffect, useRef, useState} from "react";
import {isMobile} from "../util/utils";
import MobileControlPanel from "./MobileControlPanel";

let getProjectIdInterval;

function MainContent({data = {}, children}) {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [zoomValue, setZoomValue] = useState(1);
  const [openMenu, setOpenMenu] = useState(false);
  useEffect(() => {
    const ws = getWebsocket();
    ws.addEventListener('message', wsHandler);

    getProjectIdInterval = setInterval(() => {
      if (connected() && params.projectId) {
        setProjectId(params.projectId || '');
        requestList(params.projectId);
        clearInterval(getProjectIdInterval);
        setIsLoading(false);
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

  useEffect(() => {
    window.addEventListener('focus', () => requestList(params.projectId))
  }, [])

  return (
    <div style={{
      width: '100%',
      height: '100%',
    }}>
      <div
        className="AppBar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          height: 40,
          backgroundColor: 'lightslategray',
          zIndex: 99,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center',}}>
          <Link to="/">
            <div
              style={{margin: 10, cursor: 'pointer'}}
              onClick={<Link to="/"/>}
            >
              Project Talents
            </div>
          </Link>
          {
            params.projectId &&
            <div>
              {` > ${params.projectId}`}
            </div>
          }
        </div>
      </div>
      <div style={{display: 'flex', height: '100%', width: '100%'}}>
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}>
          <div style={{
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'start',
            height: '100%',
            width: '100%',
          }}>
            <div
              id='zoomable'
              ref={zoomable}
              style={{
                // zoom: zoomValue,
                width: '100%',
                height: isMobile() && openMenu ? '50%' : '100%',
                overflow: 'scroll',
              }}
            >
              <div
                id="playground"
                ref={drop}
                style={{
                  padding: 10,
                  opacity: 1,
                  backgroundColor: isOver ? 'lightgray' : 'transparent',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignContent: 'flex-start',
                  width: '100%',
                  height: '100%',
                }}
              >
                {isLoading && `Loading Now ...`}
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
            {isMobile() &&
            <div style={{
              display: 'flex',
              flexFlow: 'column',
              height: openMenu && '50%',
              position: 'fixed',
              bottom: 0,
              justifyContent: 'end',
              width: '100%',
            }}>
              {openMenu ?
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(false);
                  }}
                >Close</button>
                : <button onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(true);
                }}>Open</button>}
              {openMenu && <MobileControlPanel data={data}/>}
            </div>
            }
          </div>
          {children}
        </div>
        {!isMobile() &&
        <div style={{
          position: 'absolute',
          float: 'right',
          right: 0,
        }}>
          <ControlPanel data={data}/>
        </div>
        }
      </div>
    </div>
  );
}

export default MainContent;