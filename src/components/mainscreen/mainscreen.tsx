import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import { DefaultEventsMap } from "@socket.io/component-emitter";

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
// const

const MainScreen: React.FC = () => {
  const dispatch = useDispatch();
  const name = useSelector((state: any) => state.user.currentUser.name);
  let connected = false;
  const init = async () => {
    socket = io(`http://localhost:8000`);
    const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONTRAINTS);
    stream.getAudioTracks()[0].enabled = false;
    // console.log(stream.getTracks(),'tracks');

    // dispatch(setMainStream(stream));

    socket.emit('create-meet');
    socket.on("meet-created", (result) => {
      console.log(result,'meetlink');
      const settings = {
        voice: !true,
        share: false,
        screen: !false,
      };

      const data = {
        settings,
        name,
        meetCreator: !false,
      };

      dispatch(setCurrentUser(data));

      //@ts-ignore
      socket.emit("meet-started", data);

      dispatch(setMainStream(stream));
    });
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

  return (
    // <InputContextProvider>
    <div className="main">
      <main className="main__content">
        <MeetJoiners />
      </main>
      <footer className="main__footer">
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
