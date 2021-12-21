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
        border: 'solid',
        borderColor: 'lightgray',
        borderRadius: 10,
        borderWidth: 1,
        boxShadow: "grey 1px 1px 5px",
        backgroundColor: 'aliceblue',
        width: '20%',
        height: 800,
        display: 'flex',
        flexFlow: 'column',
        gap: 10,
      }}>
        <div
          className="panelHandle"
          style={{
            backgroundColor: 'gray',
            height: '3%',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
        </div>
        <div style={{
          display: 'flex',
          flexFlow: 'column',
          height: '95%',
          gap: 10,
          padding: 10,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center'
          }}>
            <WasteBox data={data}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <button onClick={() => addElem(ItemTypes.Group)}>Add Group</button>
            <button onClick={() => addElem(ItemTypes.Member)}>Add Member</button>
            <button onClick={() => addElem(ItemTypes.Talent)}>Add Talent</button>
            <button onClick={() => reset()}>Reset</button>
          </div>
          <div style={{display: 'flex', height: '50%'}}>
            <Group
              disableBubbleChart
              disableDrag
              disableDrop
              style={{height: '100%', width: '100%'}}
              data={data}
              title={'Member Basket'}
            />
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', overflow: 'auto'}}>
            {talentKeys.map((key) =>
              <Talent
                key={key}
                title={data[key].title}
                color={data[key].color}
                talentId={key}
              />)}
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default ControlPanel;