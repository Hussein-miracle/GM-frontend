import React, { useEffect ,useRef,MutableRefObject, SetStateAction,Dispatch} from 'react';
import { useDispatch, useSelector } from "react-redux";


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
  },[screenStream]);

  return (
    <div className='stream-screen'>
      <video autoPlay playsInline ref={shareRef}>
      </video>
    </div>
  )
}

export default StreamScreen;