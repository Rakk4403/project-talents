import './App.css';
import Group from "./component/Group";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ItemTypes} from "./data/types";
import {addElem} from "./data/Data";
import WasteBox from "./component/WasteBox";
import Talent from "./component/Talent";

function App({data}) {
  const keys = Object.keys(data);
  const groupKeys = keys.filter((key) => data[key].type === ItemTypes.Group);
  const talentKeys = keys.filter((key) => data[key].type === ItemTypes.Talent);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{ width: '100%', display: 'flex' }}>
        <div
          id="playground"
          style={{
            display: 'flex',
            width: '80%',
          }}
        >
          {groupKeys.map((key) => {
            const value = data[key];
            const members = Object.values(data).filter((elem) => elem.parent === key);
            return (
              <div style={{
                margin: 10,
                border: '1px solid gray',
                borderRadius: 5,
                alignItems: 'stretch',
              }}>
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
        <div style={{ backgroundColor: 'aliceblue', width: '20%' }}>
          <div onClick={() => addElem(ItemTypes.Group)}>Add Group</div>
          <div onClick={() => addElem(ItemTypes.Member)}>Add Member</div>
          <div onClick={() => addElem(ItemTypes.Talent)}>Add Talent</div>
        <Group
          data={data}
          title={'Member Basket'}
          members={Object.values(data)
            .filter((elem) => !elem.parent && elem.type === ItemTypes.Member)}
          />
          {talentKeys.map((key) => <Talent title={data[key].title} />)}
        </div>
        <WasteBox
          data={data}
          />
      </div>
    </DndProvider>
  );
}

export default App;
