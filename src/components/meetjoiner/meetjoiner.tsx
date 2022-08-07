import React,{useState, useEffect, MutableRefObject} from 'react';
import { useSelector } from 'react-redux';
import "./meetjoiner.styles.scss";
import Tooltip from '@mui/material/Tooltip';
import MicOffIcon from '@mui/icons-material/MicOff';
import Screen from "../screen/screen";
// {currentIndex,curJoiner,hideVideo,camRef,showPhoto,currentUser}

type MeetJoinerProps = {
  currentIndex:number;
  curJoiner:object | null;
  hideVideo:boolean;
  camRef: MutableRefObject<HTMLVideoElement> ;
  showPhoto:boolean;
  currentUser:any
}
const MeetJoiner:React.FC<MeetJoinerProps> = ({currentIndex,curJoiner,hideVideo,camRef,showPhoto,currentUser}:MeetJoinerProps) => {
  // console.log(curJoiner,"meetjoiner component")
  const [user ,setUser]= useState(null)
  const [curUser ,setCurUser]= useState(null)
  // const currentUserData = useSelector((state) => state.user.currentUser); 



  // const {joinerInitialSettings,userName,photoURLColor} = curJoiner; 

  
  

  


  //  className={`meetjoiner ${hideVideo ? "hidden" : ""}`}
  return (
    <div 
    
    >

      <Screen>
        <video 
          ref={camRef}
          
          id={`meetJoinerCam${currentIndex}`}
        autoPlay  playsInline></video>


        {/* <MicOffIcon title="Muted"  className={`mic-off ${ curUser?.joinerInitialSettings?.audio === false ? "" : "hidden"}`}/> */}

        <Tooltip  title="Muted" >
            <MicOffIcon className={`mic-off`}/>
        </Tooltip>;

        {/* <div className={`photo ${ !showPhoto ? "hidden" : ""}`} style={{
          backgroundColor:photoURLColor
        }}>{ showPhoto === true && userName[0].toUpperCase()}</div> */}


        {/* <div className="display-name">
          {userName} <span> {currentUser ?  "(You)" : ""}</span>
        </div> */}

      </Screen>

    </div>
  )
}

export default MeetJoiner;