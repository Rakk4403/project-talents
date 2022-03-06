import WasteBox from "../component/WasteBox";
import {addElem} from "../data/Data";
import {ItemTypes} from "../data/Types";
import Group from "../component/Group";
import Talent from "../component/Talent";
import Draggable from "react-draggable";
import {useState} from "react";

function ControlPanel({data}) {
  const [openDetails, setOpenDetails] = useState(true);
  const keys = Object.keys(data);
  const talentKeys = keys
    .filter((key) => data[key].type === ItemTypes.Talent)
    .sort((aKey, bKey) =>
      data[aKey].created <= data[bKey].created ? -1 : 1);
  const toggleDetails = () => {
    setOpenDetails(!openDetails);
  }
  return (
    <Draggable handle=".panelHandle">
      <div>
        <div style={{width: 50, height: 50, display: openDetails && 'none'}}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDetails();
            }}
          >Open
          </button>
        </div>
        <details open={openDetails}>
          <summary style={{listStyle: 'none', display: 'none'}}/>
          <div
            className="panelHandle"
            style={{
              display: 'flex',
              justifyContent: 'right',
              backgroundColor: 'gray',
              height: 20,
              width: 250,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              borderWidth: 1,
              boxShadow: "grey 1px 1px 5px",
              cursor: 'move',
              listStyle: 'none',
            }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleDetails();
              }}
            >Close
            </button>
          </div>
          <div style={{
            border: 'solid',
            borderColor: 'lightgray',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderWidth: 1,
            boxShadow: "grey 1px 1px 5px",
            backgroundColor: 'aliceblue',
            width: 250,
            height: 800,
            display: 'flex',
            flexFlow: 'column',
            gap: 10,
          }}>
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
              <div style={{display: 'flex', justifyContent: 'space-between', margin: 5}}>
                <button
                  style={{height: 40}}
                  onClick={() => addElem(ItemTypes.Group)}>Add Group
                </button>
                <button
                  style={{height: 40}}
                  onClick={() => addElem(ItemTypes.Member)}>Add Member
                </button>
                <button
                  style={{height: 40}}
                  onClick={() => addElem(ItemTypes.Talent)}>Add Talent
                </button>
              </div>
              <span style={{fontWeight: 'bold'}}>Members</span>
              <div style={{display: 'flex', height: '50%'}}>
                <Group
                  disableBubbleChart
                  disableDrag
                  disableDrop
                  style={{height: '100%', width: '100%', overflowY: 'auto'}}
                  data={data}
                />
              </div>
              <span style={{fontWeight: 'bold'}}>Talents</span>
              <div style={{display: 'flex', flexWrap: 'wrap', overflow: 'auto'}}>
                {talentKeys.map((key) =>
                  <Talent
                    key={key}
                    title={data[key].title}
                    color={data[key].color}
                    talentId={key}
                    style={{
                      height: 30,
                      flexWrap: 'wrap',
                      overflow: 'hidden',
                    }}
                    tooltip={data[key].title}
                  />)}
              </div>
            </div>
          </div>
        </details>
      </div>
    </Draggable>
  )
}

export default ControlPanel;