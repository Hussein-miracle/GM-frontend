import React, {
  useState,
  MutableRefObject,
  useEffect,
  useContext,
} from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import Tooltip from "@mui/material/Tooltip";
import MicOffIcon from "@mui/icons-material/MicOff";
import Screen from "../screen/screen";

import {
  JoinerLoader2,
} from "../UI/loaders/loaders";

import { randomColor } from "../../utils/helpers";
// {currentIndex,curJoiner,hideVideo,camRef,showPhoto,currentUser}
import "./meetjoiner.styles.scss";

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
  const screenStream = useSelector((state: any) => state.meet.screenStream);
  const [color, setColor] = useState("blue");

  // const {joinerInitialSettings,userName,photoURLColor} = curJoiner;

  useEffect(() => {
    const genColor = randomColor();
    setColor(genColor);
  }, [screenStream]);

  return (
    <motion.div
      className={`meetjoiner ${hideCam ? "hidden" : ""}`}
      drag
      dragElastic={1}
      dragConstraints={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      //@ts-ignore
      initial={{ scale: 0.85 , rotation: -180 }}
      animate={{
        rotate: 0,
        left: `2vw`,
        scale:1
      }}
      transition={{
        type: "spring",
        duration: 2,
        stiffness: 260,
        damping: 25,
      }}
    >
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
    </motion.div>
  );
};

export default MeetJoiner;
