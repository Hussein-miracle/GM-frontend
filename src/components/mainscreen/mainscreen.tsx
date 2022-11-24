import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Navigate } from "react-router-dom";

import { Socket } from "socket.io-client";

import {
  setMainStream,
  updateCurrentUserSettings,
  setCurrentUser,
  setScreenStream,
  getName,
  setLeaveMeetDetails,
  setShowStream,
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setContextStream } = useContext(StreamContext);
  const { meetingId } = useParams();
  const mainStream = useSelector((state: any) => state.user.mainStream);
  const name = useSelector((state: any) => state.user.currentUser.name);
  const [loadingStream, setLoadingStream] = useState(!true);
  const [loadingShareStream, setLoadingShareStream] = useState(false);
  const settings = useSelector((state: any) => state.user.currentUser.settings);
  let connected = false;
  let forceConnected = false;

  // console.log(settings,'settings');

  const handleLoadingShareStream = (value: boolean) => {
    setLoadingShareStream(value);
  };

  const handleShareScreenEnd = () => {
    dispatch(setShowStream(false));
    dispatch(updateCurrentUserSettings({ ...settings, screen: false }));
  };
  const handleShareScreenStart = async () => {
    dispatch(setShowStream(true));
    setLoadingShareStream(true);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(
        MEDIA_CONTRAINTS
      );

      stream.getVideoTracks()[0].onended = handleShareScreenEnd;

      dispatch(setScreenStream(stream));
      dispatch(updateCurrentUserSettings({ ...settings, screen: true }));

      // setTimeout(() => {
      //   setLoadingShareStream(false);
      // }, 1500);
    } catch (e) {
      dispatch(setShowStream(false));
      console.error(e);
    }
  };

  const init = async () => {
    setLoadingStream(!false);
    const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONTRAINTS);
    stream.getAudioTracks()[0].enabled = settings.voice;
    stream.getVideoTracks()[0].enabled = settings.cam;
    setContextStream(stream);
    dispatch(setMainStream(stream));
  };

  useEffect(() => {
    // if(meetingId){
    if (connected) {
      if (name) {
        init();
      }
      setTimeout(() => {
        setLoadingStream(false);
      }, 1200);
      // console.log(mainStream, "on mount");
    }

    // }

    return () => {
      // console.log(mainStream, "on unmount");
      if (mainStream) {
        StopStreams(mainStream);
      }
      //@ts-ignore
      // eslint-disable-next-line react-hooks/exhaustive-deps
      connected = true;
    };
  }, []);

  return (
    <>
      {name === "" ? (
        <Navigate to="/" replace />
      ) : (
        <StreamContextProvider>
          <div className="mainscreen">
            <main className="mainscreen__content">
              <MeetJoiners
                loadingStream={loadingStream}
                setLoadingStream={setLoadingStream}
                handleLoadingShareStream={handleLoadingShareStream}
                loadingShareStream={loadingShareStream}
              />
            </main>
            <footer className="mainscreen__footer">
              <Controls
                socket={socket}
                handleShareScreen={handleShareScreenStart}
              />
            </footer>
          </div>
        </StreamContextProvider>
      )}
    </>
  );
};

export default MainScreen;
