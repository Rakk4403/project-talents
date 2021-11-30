import {useDrag} from "react-dnd";
import {ItemTypes} from "../data/types";
import {useState} from "react";
import {modifyElemTitle} from "../data/Data";

function Talent({ title, talentId }) {
  const [clicked, setClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.Talent,
    item: {talentId: talentId},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))


  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.3 : 1,
      }}
    >{clicked ?
      <input
        autoFocus
        value={newTitle}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            modifyElemTitle(talentId, newTitle);
            setClicked(false);
          } else if (e.code === 'Escape') {
            modifyElemTitle(talentId, title);
            setNewTitle(title);
            setClicked(false);
          }
        }}
        onBlur={() => {
          modifyElemTitle(talentId, newTitle);
          setClicked(false);
        }}
        onChange={(e) => setNewTitle(e.target.value)}
      />
    : <span onClick={() => setClicked(true)}>{newTitle}</span>
    }</div>
  );
}

export default Talent;