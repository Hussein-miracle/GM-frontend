import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import io, { Socket } from "socket.io-client";

import {
  setMainStream,
  setCurrentUser,
} from "../../reduxtoolkit/features/user/userSlice";
import Controls from "../controls/controls";
import MeetJoiners from "../meetjoiners/meetjoiners";
import { MEDIA_CONTRAINTS } from "../../utils/constants";
// import InputContextProvider from "../../contexts/inputcontext/inputcontext";

import "./mainscreen.styles.scss";

interface ScreenInterface {
  socket: Socket;
}

const MainScreen: React.FC<ScreenInterface>= ({socket}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const settings = useSelector((state: any) => state.user.currentUser.settings);

  console.log(settings,'settings');

  let connected = false;

  const init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONTRAINTS);
    stream.getAudioTracks()[0].enabled = settings.audio;
    stream.getVideoTracks()[0].enabled = settings.cam;
  
    dispatch(setMainStream(stream));
  };

  useEffect(() => {
    if (connected) {
      init();
    }

    return () => {
      //@ts-ignore
      // eslint-disable-next-line react-hooks/exhaustive-deps
      connected = true;
    };
  }, []);

  useEffect(() => {
    console.log(params,'params');
  },[])


  return (
    // <InputContextProvider>
    <div className="mainscreen">
      <main className="mainscreen__content">
        <MeetJoiners />
      </main>
      <footer className="mainscreen__footer">
        <Controls
        // handleShareScreenClick={handleShareScreenClick}
        // handleMicClick={handleMicClick}
        // handleCamClick={handleCamClick}
        />
      </footer>
    </div>
    // </InputContextProvider>
  );
};

export default MainScreen;
