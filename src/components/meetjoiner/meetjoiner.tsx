import React, { useState, MutableRefObject, useEffect,useContext } from "react";
// import { useSelector } from "react-redux";
import "./meetjoiner.styles.scss";
import Tooltip from "@mui/material/Tooltip";
import MicOffIcon from "@mui/icons-material/MicOff";
import Screen from "../screen/screen";

import {
  JoinerLoader1,
  JoinerLoader2,
  GoogleLoader,
} from "../UI/loaders/loaders";

import { randomColor } from "../../utils/helpers";
// {currentIndex,curJoiner,hideVideo,camRef,showPhoto,currentUser}

type MeetJoinerProps = {
  currentIndex: number | null;
  currentJoiner: any | null;
  hideCam: boolean;
  camRef: MutableRefObject<HTMLVideoElement> | null;
  avatar: boolean;
  currentUser: any;
  creator: boolean;
  load: boolean;

  // name: string;
};
const MeetJoiner: React.FC<MeetJoinerProps> = ({
  creator,
  // name,
  currentUser,
  camRef,
  avatar,
  hideCam,
  load,
  currentIndex,
  currentJoiner,
}) => {
  const {
    name,
    settings: { voice },
  } = currentJoiner;
  // console.log(currentJoiner, "joiner");
  const [color, setColor] = useState("blue");

  // const {joinerInitialSettings,userName,photoURLColor} = curJoiner;

  // useEffect(() => {
  //   const genColor = randomColor();
  //   setColor(genColor);
  // }, [load, camRef]);
  return (
    <div className={`meetjoiner ${hideCam ? "hidden" : ""}`}>
      {load ? (
        <JoinerLoader2 load={load} />
      ) : (
        <Screen>
          <video
            ref={camRef}
            id={`meetJoinerCam--${currentIndex}`}
            autoPlay
            playsInline
          ></video>
          <Tooltip title="Muted">
            <MicOffIcon
              className={`mic-off ${voice === false ? "" : "hidden"}`}
            />
          </Tooltip>
          <div
            className={`avatar ${avatar === false ? "hidden" : ""}`}
            style={{
              backgroundColor: color,
            }}
          >
            {name[0].toUpperCase()}
          </div>
          <div className="display-name">
            {name} <span> {currentUser ? "(You)" : ""}</span>
          </div>
          {creator && <span className="creator">Creator</span>}
        </Screen>
      )} 
    </div>
  );
};

export default MeetJoiner;
