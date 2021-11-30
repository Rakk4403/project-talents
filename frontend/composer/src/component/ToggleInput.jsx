import {modifyElemTitle} from "../data/Data";
import {Fragment, useState} from "react";

function ToggleInput({value, elemId}) {
  const [clicked, setClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(value);
  return (
    <Fragment>
      {clicked ?
        <input
          autoFocus
          value={newTitle}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              modifyElemTitle(elemId, newTitle);
              setClicked(false);
            } else if (e.code === 'Escape') {
              modifyElemTitle(elemId, value);
              setNewTitle(value);
              setClicked(false);
            }
          }}
          onBlur={() => {
            modifyElemTitle(elemId, newTitle);
            setClicked(false);
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