import React, { useState, MutableRefObject} from "react";
import { useSelector } from "react-redux";
import "./meetjoiner.styles.scss";
import Tooltip from "@mui/material/Tooltip";
import MicOffIcon from "@mui/icons-material/MicOff";
import Screen from "../screen/screen";

import { randomColor } from "../../utils/helpers";
// {currentIndex,curJoiner,hideVideo,camRef,showPhoto,currentUser}

type MeetJoinerProps = {
  // currentIndex:number;
  // key:string | number;
  // curJoiner:object | null;
  // hideVideo:boolean;
  camRef: MutableRefObject<HTMLVideoElement> | null;
  avatar: boolean;
  currentUser: any;
  creator: boolean;
  name: string;
  stream: any;
};
const MeetJoiner: React.FC<MeetJoinerProps> = ({
  creator,
  name,
  currentUser,
  camRef,
  avatar,
}) => {
  // const [curUser ,setCurUser]= useState(null)
  // const currentUserData = useSelector((state) => state.user.currentUser);

  // const {joinerInitialSettings,userName,photoURLColor} = curJoiner;

  //  className={`meetjoiner ${hideVideo ? "hidden" : ""}`}
  return (
    <div className={`meetjoiner`}>
      <Screen>
        <video
          ref={camRef}
          id={`meetJoinerCam--${name}`}
          autoPlay
          playsInline
        ></video>

        <Tooltip title="Muted">
          <MicOffIcon
            className={`mic-off ${avatar === false ? "" : "hidden"}`}
          />
        </Tooltip>

        <div
          className={`avatar ${!avatar ? "hidden" : ""}`}
          style={{
            backgroundColor: randomColor(),
          }}
        >
          {avatar === true && name[0].toUpperCase()}
        </div>

        <div className="display-name">
          {name} <span> {currentUser ? "(You)" : ""}</span>
        </div>

        {creator && <span className="creator">Creator</span>}
      </Screen>
    </div>
  );
};

export default MeetJoiner;
