import './App.css';
import MainContent from "./content/MainContent";
import {Route, Routes} from "react-router-dom";

function App({data}) {
  return (
    <div className="App" style={{width: '100%', height: '100%', display: 'flex'}}>
      <Routes>
        <Route path="p/:projectId" element={<MainContent data={data}/>}/>
      </Routes>
    </div>
  );
}

export default App;
