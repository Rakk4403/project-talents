import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {observe} from "./data/Data";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

observe((data) =>
  ReactDOM.render(
    <React.StrictMode>

      <DndProvider backend={HTML5Backend}>
        <App data={data}/>
      </DndProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
