import React, {
  useState,
  MutableRefObject,
  useEffect,
  LegacyRef,
  // useContext,
} from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import Tooltip from "@mui/material/Tooltip";
import MicOffIcon from "@mui/icons-material/MicOff";
import Screen from "../screen/screen";

import { JoinerLoader2 } from "../UI/loaders/loaders";

import { randomColor } from "../../utils/helpers";
// {currentIndex,curJoiner,hideVideo,camRef,showPhoto,currentUser}
import "./meetjoiner.styles.scss";

type MeetJoinerProps = {
  currentIndex: number | null;
  currentJoiner: any | null;
  hideCam: boolean;
  camRef:LegacyRef<HTMLVideoElement> ;
  // camRef: any;
  avatar: boolean;
  currentUser: any;
  creator: boolean;
  load: boolean;
  voice:boolean;

  // name: string;
};


const MeetJoiner = (props: MeetJoinerProps) => {
  const { creator, currentUser,camRef,avatar,hideCam,load,currentIndex,currentJoiner,voice
  } = props;
  
  const { name } = currentJoiner;
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
      className={`meetjoiner`}
      drag
      dragElastic={1}
      dragConstraints={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      //@ts-ignore
      initial={{ scale: 0.88 }}
      animate={{
        left: `1.5vw`,
        scale: 1,
      }}
      transition={{
        type: "spring",
        duration: 1,    
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
              className={`mic-off ${ voice === false ? "" : "hidden"}`}
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
          {!creator && <span className="joiner">Joiner</span>}
        </Screen>
      )}
    </motion.div>
  );
};

export default MeetJoiner;
