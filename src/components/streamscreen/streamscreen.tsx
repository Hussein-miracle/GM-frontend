import React, { useEffect ,useRef,MutableRefObject, SetStateAction,Dispatch} from 'react';
import { useDispatch, useSelector } from "react-redux";


import  './streamscreen.styles.scss';


interface ScreenInterface {
  handleLoadingShareStream:any;
}    

const StreamScreen: React.FC<ScreenInterface> = ({handleLoadingShareStream}) => {
  const  screenStream = useSelector((state: any) => state.user.screenStream);
  const shareRef = useRef<HTMLVideoElement | null>(
    null
  ) as MutableRefObject<HTMLVideoElement>;
  
  useEffect(() => {
    if(screenStream && shareRef.current){
      shareRef.current.srcObject = screenStream;
      handleLoadingShareStream(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[screenStream]);

  return (
    <div className='streamscreen'>
      {/* <span></span> */}
      <video autoPlay playsInline ref={shareRef} className='vid' >
      </video>
    </div>
  )
}

export default StreamScreen;