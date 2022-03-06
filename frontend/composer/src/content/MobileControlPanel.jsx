import WasteBox from "../component/WasteBox";
import {addElem} from "../data/Data";
import {ItemTypes} from "../data/Types";
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
        width: window.innerWidth,
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
          padding: 10,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            margin: 5,
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>
                Hold & Drag:
              </div>
              <div>
                <li>Talent to Member</li>
                <li>Member to Group</li>
              </div>
            </div>
            <button
              style={{height: 40}}
              onClick={() => addElem(ItemTypes.Group)}>Add Group
            </button>
          </div>
          <div style={{display: 'flex', height: '40%'}}>
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
          <div style={{display: 'flex', height: '30%'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', width: '80%', overflow: 'auto'}}>
              {talentKeys
                .sort((aKey, bKey) =>
                  data[aKey].id <= data[bKey].id ? 1 : -1)
                .map((key) =>
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
            <div style={{
              display: 'flex',
              flexFlow: 'column',
              justifyContent: 'space-between',
              width: '20%',
              height: '100%',
            }}>
              <button
                style={{width: '100%', height: '48%'}}
                onClick={() => addElem(ItemTypes.Talent)}>Add Talent
              </button>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '48%',
              }}>
                <WasteBox data={data}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileControlPanel;