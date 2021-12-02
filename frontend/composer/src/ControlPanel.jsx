import WasteBox from "./component/WasteBox";
import {addElem, reset} from "./data/Data";
import {ItemTypes} from "./data/types";
import Group from "./component/Group";
import Talent from "./component/Talent";
import Draggable from "react-draggable";

function ControlPanel({data}) {
  const keys = Object.keys(data);
  const talentKeys = keys.filter((key) => data[key].type === ItemTypes.Talent);
  return (
    <Draggable handle=".panelHandle">
      <div style={{
        display: 'flex',
        flexFlow: 'column',
        backgroundColor: 'aliceblue',
        width: '20%',
        height: 800,
      }}>
        <strong className="panelHandle">
          <div>Handle</div>
        </strong>
        <WasteBox
          data={data}
        />
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
    </Draggable>
  )
}

export default ControlPanel;