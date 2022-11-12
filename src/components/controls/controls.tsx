import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Tooltip from "@mui/material/Tooltip";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import ClosedCaptionOffIcon from "@mui/icons-material/ClosedCaptionOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CallEndIcon from "@mui/icons-material/CallEnd";

import { ReactComponent as VideoCamOnIcon } from "../../assets/icons/videoCamOn.svg";
import { ReactComponent as VideoCamOffIcon } from "../../assets/icons/videoCamOff.svg";

import "./controls.styles.scss";

// {handleMicClick,handleShareScreenClick,handleCamClick})
const Controls: React.FC = () => {
  const handleClickMic = () => {};
  const handleClickCam = () => {};
  const handleShareScreen = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video:true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    })

    console.log(stream)
  };

  const handleClickCaption = () => {};
  return (
    <div className="controls">


      {/* data-tip={streamState.micOn ? "Mute Mic" : "Unmute Mic"}  */}

      <Tooltip title={true ? "Mute Mic" : "Unmute Mic"} arrow>
              {/*  className={`controls__btn ${ streamState.micOn === false ? "off" : "" }`} */}
        <button className={`controls__btn`} onClick={handleClickMic}>
          {/* {streamState.micOn ? <MicIcon/> : <MicOffIcon/>} */}
          {true ? <MicIcon /> : <MicOffIcon />}
        </button>
      </Tooltip>

      {/* data-tip={streamState.camOn ? "Close Cam" : "Open Cam"} */}
      <Tooltip title={true ? "Close Cam" : "Open Cam"} arrow>
        {/* className={`controls__btn ${ streamState.camOn === false ? "off" : "" }`} */}
        <button
          className={`controls__btn ${false ? "off" : ""}`}
          onClick={handleClickCam}
        >
          {/* {streamState.camOn ? <VideoCamOnIcon/> : <VideoCamOffIcon />}         */}
          {true ? <VideoCamOnIcon /> : <VideoCamOffIcon />}
        </button>
      </Tooltip>

      {/* data-tip={streamState.captionOn ? "disable caption" : "show caption"} */}
      <Tooltip title={true ? "Disable Caption" : "Show Caption"} arrow>
        {/* className={`controls__btn ${ streamState.captionOn ? "caption" : "" }`} */}
        <button
          className={`controls__btn ${true ? "caption" : ""}`}
          onClick={handleClickCaption}
        >
          {/* {streamState.captionOn ? <ClosedCaptionOffIcon/> : <ClosedCaptionOffIcon/>} */}
          {true ? <ClosedCaptionOffIcon /> : <ClosedCaptionOffIcon />}
        </button>
      </Tooltip>

      <Tooltip title="Share Screen" arrow>
        {/* disabled={streamState.screen} onClick={handleShareScreen} */}
        <button
          type="button"
          className="controls__btn"
          disabled={false}
          onClick={handleShareScreen}
        >
          <PresentToAllIcon />
        </button>
      </Tooltip>
      <Tooltip title="More Options" arrow>
        <button type="button" className="controls__btn">
          <MoreVertIcon />
        </button>
      </Tooltip>
      <Tooltip title="Leave Meet" arrow>
        <button className="controls__btn-call">
          <CallEndIcon />
        </button>
      </Tooltip>
    </div>
  );
};

export default Controls;
