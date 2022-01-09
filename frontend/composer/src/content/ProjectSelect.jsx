import {useNavigate} from "react-router-dom";

function ProjectSelect({history}) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minWidth: 400,
        minHeight: 300,
        backgroundColor: 'aliceblue',
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        border: 'solid 1px darkgray',
        boxShadow: "grey 1px 1px 5px",
      }}
    >
      <div style={{
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'start',
        width: '50%',
        height: '80%',
      }}>
        <div style={{textAlign: 'start'}}>
          Join or Create Project<br/>
          Enter project name<br/>
          
        </div>
        <input onKeyPress={(e) => {
          if (e.key === 'Enter') {
            console.log(e.target.value);
            navigate(`/p/${e.target.value}`)
          }
        }}/>
      </div>
    </div>
  )
}

export default ProjectSelect;