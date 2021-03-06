import {modifyElemTitle} from "../data/Data";
import {Fragment, useEffect, useState} from "react";

function ToggleInput({value, elemId, style}) {
  const [clicked, setClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(value);

  useEffect(() => {
    setNewTitle(value);
  }, [value]);

  return (
    <Fragment>
      {clicked ?
        <input
          style={{
            cursor: 'text',
            ...style,
          }}
          autoFocus
          value={newTitle}
          onKeyDown={(e) => {
            e.stopPropagation()
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
          onBlur={(e) => {
            e.stopPropagation()
            if (newTitle) {
              modifyElemTitle(elemId, newTitle);
              setClicked(false);
            }
          }}
          onChange={(e) => {
            e.stopPropagation()
            setNewTitle(e.target.value)
          }}
        />
        :
        <span onClick={(e) => {
          e.stopPropagation();
          setClicked(true)
        }}>{newTitle}</span>
      }
    </Fragment>
  )
}

export default ToggleInput;