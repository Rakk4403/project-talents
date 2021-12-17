import './App.css';
import Group from "./component/Group";
import {useDrop} from "react-dnd";
import {ItemTypes} from "./data/types";
import ControlPanel from "./ControlPanel";
import {appendMember, getGroups} from "./data/Data";

function App({data}) {
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
      return item.groupId;
    },
    collect: monitor => {
      return {
        isOver: !!monitor.isOver({shallow: true}),
      };
    },
  }), [])

  const groups = getGroups();

  return (
    <div className="App" style={{width: '100%', height: '100%', display: 'flex'}}>
      <div
        id="playground"
        ref={drop}
        style={{
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
    </div>
  )
    ;
}

export default App;
