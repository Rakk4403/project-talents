import './App.css';
import MainContent from "./content/MainContent";
import {Route, Routes} from "react-router-dom";
import ProjectSelect from "./content/ProjectSelect";

function App({data}) {
  return (
    <div className="App" style={{width: '100%', height: '100%', display: 'flex'}}>
      <Routes>
        <Route path="*" element={
          <MainContent>
            <div style={{
              position: 'absolute',
              background: 'black',
              opacity: 0.2,
              width: '100%',
              height: '100%',
            }}>

            </div>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <ProjectSelect/>
            </div>
          </MainContent>
        }/>
        <Route path="p/:projectId" element={<MainContent data={data}/>}/>
      </Routes>
    </div>
  );
}

export default App;
