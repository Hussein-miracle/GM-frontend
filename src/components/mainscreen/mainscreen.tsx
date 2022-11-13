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


const MainScreen: React.FC = () => {
  const dispatch = useDispatch();
  const name = useSelector((state: any) => state.user.currentUser.name);


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
