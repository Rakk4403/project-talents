import './App.css';
import Group from "./component/Group";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ItemTypes} from "./data/types";
import {addElem, reset} from "./data/Data";
import WasteBox from "./component/WasteBox";
import Talent from "./component/Talent";

function App({data}) {
  const keys = Object.keys(data);
  const groupKeys = keys.filter((key) => data[key].type === ItemTypes.Group);
  const talentKeys = keys.filter((key) => data[key].type === ItemTypes.Talent);
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
              <Group
                data={data}
                key={key}
                groupId={key}
                title={value.title}
                members={members}
              />
            )
          })}
        </div>
        <div style={{
          display: 'flex',
          flexFlow: 'column',
          backgroundColor: 'aliceblue',
          width: '20%',
        }}>
          <div style={{display: 'flex'}}>
            <button onClick={() => addElem(ItemTypes.Group)}>Add Group</button>
            <button onClick={() => addElem(ItemTypes.Member)}>Add Member</button>
            <button onClick={() => addElem(ItemTypes.Talent)}>Add Talent</button>
            <button onClick={() => reset()}>Reset</button>
          </div>
          <div style={{display: 'flex', height: '50%'}}>
            <Group
              disableShowTalent
              style={{height: '100%', width: '100%'}}
              data={data}
              title={'Member Basket'}
              members={Object.values(data)
                .filter((elem) => !elem.parent && elem.type === ItemTypes.Member)}
            />
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {talentKeys.map((key) =>
              <Talent
                key={key}
                title={data[key].title}
                color={data[key].color}
                talentId={key}
              />)}
          </div>
        </div>
        <WasteBox
          data={data}
        />
      </div>
    </DndProvider>
  );
}

export default App;
