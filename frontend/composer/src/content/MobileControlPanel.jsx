import WasteBox from "../component/WasteBox";
import {addElem} from "../data/Data";
import {ItemTypes} from "../data/types";
import Group from "../component/Group";
import Talent from "../component/Talent";
import Draggable from "react-draggable";
import {useState} from "react";

function MobileControlPanel({data}) {
  const [openDetails, setOpenDetails] = useState(true);
  const keys = Object.keys(data);
  const talentKeys = keys.filter((key) => data[key].type === ItemTypes.Talent);
  const toggleDetails = () => {
    setOpenDetails(!openDetails);
  }
  return (
    <div
      style={{
        display: 'flex',
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 100,
        overflowX: 'scroll'
      }}
    >
      <div>
        <div open={openDetails}>
          <summary style={{listStyle: 'none', display: 'none'}}/>
          <div style={{
            border: 'solid',
            borderColor: 'lightgray',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderWidth: 1,
            boxShadow: "grey 1px 1px 5px",
            backgroundColor: 'aliceblue',
            width: '100%',
            height: 100,
            display: 'flex',
            gap: 10,
          }}>
            <div style={{
              display: 'flex',
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
              <div style={{
                display: 'hidden',
                flexFlow: 'column',
                justifyContent: 'space-between',
                margin: 5,
              }}>
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
              <div style={{display: 'flex', height: '50%'}}>
                <Group
                  disableBubbleChart
                  disableDrag
                  disableDrop
                  style={{height: '100%', width: '100%'}}
                  data={data}
                />
              </div>
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
        </div>
      </div>
    </div>
  )
}

export default MobileControlPanel;