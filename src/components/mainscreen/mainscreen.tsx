import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import io, { Socket } from "socket.io-client";

import {
  setMainStream,
  setCurrentUser,
} from "../../reduxtoolkit/features/user/userSlice";
import {
  StreamContext,
  StreamContextProvider,
} from "../../contexts/streamContext/streamContext";

import Controls from "../controls/controls";
import MeetJoiners from "../meetjoiners/meetjoiners";
import { MEDIA_CONTRAINTS } from "../../utils/constants";
import { StopStreams } from "../../utils/helpers";
// import InputContextProvider from "../../contexts/inputcontext/inputcontext";

import "./mainscreen.styles.scss";

interface ScreenInterface {
  socket: Socket;
}

const MainScreen: React.FC<ScreenInterface> = ({ socket }) => {
  const dispatch = useDispatch();
  const { contextStream, setContextStream } = useContext(StreamContext);
  const params = useParams();
  const mainStream = useSelector((state: any) => state.user.mainStream);
  const [loadingStream, setLoadingStream] = useState(!true);
  const settings = useSelector((state: any) => state.user.currentUser.settings);
  let connected = false;

  // console.log(settings,'settings');

  const init = async () => {
    setLoadingStream(!false);
    const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONTRAINTS);
    stream.getAudioTracks()[0].enabled = settings.voice;
    stream.getVideoTracks()[0].enabled = settings.cam;
    dispatch(setMainStream(stream));
  };

  useEffect(() => {
    if (connected) {
      init();
      setTimeout(() => {
        setLoadingStream(false);
      }, 1000);
      // console.log(mainStream, "on mount");
    }

    return () => {
      // console.log(mainStream, "on unmount");
      // if (connected && mainStream) {
      //   StopStreams(mainStream);
      // }
      //@ts-ignore
      // eslint-disable-next-line react-hooks/exhaustive-deps
      connected = true;
    };
  }, []);

  // useEffect(() => {
  //   if(mainStream){
  //     console.log(mainStream,'mainStream useEfect')
  //   }
  //  },[mainStream])

  return (
    <StreamContextProvider>
      <div className="mainscreen">
        <main className="mainscreen__content">
          <MeetJoiners
            loadingStream={loadingStream}
            setLoadingStream={setLoadingStream}
          />
        </main>
        <footer className="mainscreen__footer">
          <Controls
          // handleShareScreenClick={handleShareScreenClick}
          // handleMicClick={handleMicClick}
          // handleCamClick={handleCamClick}
          />
        </footer>
      </div>
    </StreamContextProvider>
  );
};

export default MainScreen;
