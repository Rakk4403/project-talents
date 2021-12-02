import './App.css';
import Group from "./component/Group";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ItemTypes} from "./data/types";
import ControlPanel from "./ControlPanel";

function App({data}) {
  const keys = Object.keys(data);
  const groupKeys = keys.filter((key) => data[key].type === ItemTypes.Group);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{width: '100%', height: '100%', display: 'flex'}}>
        <div
          id="playground"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '80%',
          }}
        >
          {groupKeys.map((key) => {
            const value = data[key];
            const members = Object.values(data).filter((elem) => elem.parent === key);
            return (
              <div style={{margin: 5}}>
                <Group
                  data={data}
                  key={key}
                  groupId={key}
                  title={value.title}
                  members={members}
                />
              </div>
            )
          })}
        </div>
        <ControlPanel data={data}/>
      </div>
    </DndProvider>
  );
}

export default App;
