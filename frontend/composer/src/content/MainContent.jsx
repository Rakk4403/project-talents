import {useDrop} from "react-dnd";
import {ItemTypes} from "../data/types";
import {appendMember, getGroups, setProjectId} from "../data/Data";
import Group from "../component/Group";
import ControlPanel from "../ControlPanel";
import {useParams} from "react-router-dom";
import {connected, requestList} from "../data/Websocket";
import {useEffect} from "react";

let getProjectIdInterval;

function MainContent({data}) {
  const params = useParams();
  setProjectId(params.projectId || '');

  useEffect(() => {
    getProjectIdInterval = setInterval(() => {
      if (connected()) {
        requestList(params.projectId);
        clearInterval(getProjectIdInterval);
      }
    }, 1000);
  }, []);

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
      console.log('monitor', monitor.getItem())
      return {
        isOver: !!monitor.isOver({shallow: true})
          && monitor.getItem().prevParent !== null,
      };
    },
  }), [])

  const groups = getGroups();

  return (
    <>
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
          gap: 5,
        }}
      >
        {groups.map((group) => {
          return (
            <div>
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
      <ControlPanel data={data}/>
    </>
  );
}

export default MainContent;