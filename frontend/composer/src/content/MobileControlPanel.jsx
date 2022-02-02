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
    <div open={openDetails} style={{height: '100%'}}>
      <summary style={{listStyle: 'none', display: 'none'}}/>
      <div style={{
        border: 'solid',
        borderColor: 'lightgray',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 1,
        boxShadow: "grey 1px 1px 5px",
        backgroundColor: 'aliceblue',
        width: window.screen.width,
        height: '100%',
        display: 'flex',
        gap: 10,
      }}>
        <div style={{
          display: 'flex',
          flexFlow: 'column',
          height: '95%',
          gap: 10,
          width: '100%',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            margin: 5,
          }}>
            Drag components to Member or Group
            <button
              style={{height: 40}}
              onClick={() => addElem(ItemTypes.Group)}>Add Group
            </button>
          </div>
          <div style={{display: 'flex', height: '50%'}}>
            <div style={{width: '80%', height: '100%'}}>
              <Group
                disableBubbleChart
                disableDrag
                disableDrop
                style={{height: '100%', width: '100%'}}
                data={data}
              />
            </div>
            <button
              style={{width: '20%', height: '100%'}}
              onClick={() => addElem(ItemTypes.Member)}>Add Member
            </button>
          </div>
          <div style={{display: 'flex', height: '50%'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', width: '80%', overflow: 'auto'}}>
              {talentKeys.map((key) =>
                <Talent
                  key={key}
                  title={data[key].title}
                  color={data[key].color}
                  talentId={key}
                  style={{
                    height: 30,
                    width: 30,
                    flexWrap: 'wrap',
                    overflow: 'hidden',
                  }}
                  tooltip={data[key].title}
                />)}
            </div>
            <button
              style={{width: '20%', height: '100%'}}
              onClick={() => addElem(ItemTypes.Talent)}>Add Talent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileControlPanel;