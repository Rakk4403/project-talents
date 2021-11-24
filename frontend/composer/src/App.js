import './App.css';
import Group from "./component/Group";
import Member from "./component/Member";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ItemTypes} from "./data/types";

function App({data}) {
  const keys = Object.keys(data);
  const groupKeys = keys.filter((key) => data[key].type === ItemTypes.Group);
  const memberKeys = keys.filter((key) => data[key].type === ItemTypes.Member);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        {groupKeys.map((key) => {
          const value = data[key];
          const members = Object.values(data).filter((elem) => elem.parent === key);
          return (
            <Group
              // data={data}
              key={key}
              groupId={key}
              title={value.title}
              members={members}
            />
          )
        })}
        All Members:
        {memberKeys
          .filter(memberId => !data[memberId].parent)
          .map((key) => {
            const value = data[key];
            return (
              <Member
                data={data}
                key={key}
                memberId={key}
                title={value.title}
              />
            )
          })}
      </div>
    </DndProvider>
  );
}

export default App;
