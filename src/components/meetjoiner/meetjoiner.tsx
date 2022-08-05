import React,{useState, useEffect, MutableRefObject} from 'react';
import { useSelector } from 'react-redux';
import "./meetjoiner.styles.scss";

// import MicOffIcon from '@mui/icons-material/MicOff';
import Screen from "../screen/screen";
// {currentIndex,curJoiner,hideVideo,camRef,showPhoto,currentUser}

type MeetJoinerProps = {
  currentIndex:number;
  curJoiner:any;
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

  // useEffect(()=> {
  //   if(!!currentUserData){
  //   const {userName,currentUser} = currentUserData[Object.keys(currentUserData)[0]];
  //   // console.log("user ineer",user);
  //   setUser(userName)
  //   setCurUser(currentUser)
  // } 
  // },[currentUserData , curJoiner])

  // if (!curJoiner){
  //   return null;

  // }

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

        {/* <div className={`photo ${ !showPhoto ? "hidden" : ""}`} style={{
          backgroundColor:photoURLColor
        }}>{ showPhoto === true && userName[0].toUpperCase()}</div> */}


        {/* <div className="display-name">
          {userName} <span> {currentUser ?  "(You)" : ""}</span>
        </div> */}
      Meetjoiner
      </Screen>

    </div>
  )
}

export default MeetJoiner;