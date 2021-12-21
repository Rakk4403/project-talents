import {modifyElemTitle} from "../data/Data";
import {Fragment, useState} from "react";

function ToggleInput({value, elemId, style}) {
  const [clicked, setClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(value);
  return (
    <Fragment>
      {clicked ?
        <input
          style={{...style}}
          autoFocus
          value={newTitle}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              if (newTitle) {
                modifyElemTitle(elemId, newTitle);
                setClicked(false);
              }
            } else if (e.code === 'Escape') {
              modifyElemTitle(elemId, value);
              setNewTitle(value);
              setClicked(false);
            }
          }}
          onBlur={() => {
            if (newTitle) {
              modifyElemTitle(elemId, newTitle);
              setClicked(false);
            }
          }}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        :
        <span onClick={() => setClicked(true)}>{newTitle}</span>
      }
    </Fragment>
  )
}

export default ToggleInput;