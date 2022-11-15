import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import  {useNavigate} from 'react-router-dom';

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
  const navigate = useNavigate();
  const settings = useSelector((state: any) => state.user.currentUser.settings);
  const [voice,setVoice]  = useState(settings.voice);
  const [cam,setCam]  = useState(settings.cam);
  const [screen,setScreen]  = useState(false);
  const [caption,setCaption]  = useState(settings.caption);

  const handleClickVoice = () => {
    setVoice(!voice);
  };
  const handleClickCam = () => {
    setCam(!cam);
  };
  const handleShareScreen = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    });

    console.log(stream);
  };

  const handleClickCaption = () => {
    setCaption(!caption);
  };

  const handleLeaveMeet = () => {
    const leave = window.confirm('Do you want to leave the meeting ?');
    if(leave){
      navigate('/');
    }
  }  


 return (
    <div className="controls">
      <Tooltip
        title={voice === true ? "Mute Mic" : "Unmute Mic"}
        arrow
      >
        <button className={`controls__btn`} onClick={handleClickVoice}>
          {voice === true ? <MicIcon /> : <MicOffIcon />}
        </button>
      </Tooltip>
      <Tooltip title={settings.cam ? "Close Cam" : "Open Cam"} arrow>
        <button
          className={`controls__btn ${!cam === false ? "off" : ""}`}
          onClick={handleClickCam}
        >
          {cam === true ? <VideoCamOffIcon /> : <VideoCamOnIcon />}
        </button>
      </Tooltip>
      <Tooltip title={caption ? "Disable Caption" : "Show Caption"} arrow>
        <button
          className={`controls__btn ${caption ? "caption" : ""}`}
          onClick={handleClickCaption}
        >
          {caption ? (
            <ClosedCaptionOffIcon />
          ) : (
            <ClosedCaptionOffIcon />
          )}
        </button>
      </Tooltip>

      <Tooltip title="Share Screen" arrow>
        <button
          type="button"
          className="controls__btn"
          onClick={handleShareScreen}
          disabled={settings.screen}
        >
          <PresentToAllIcon />
        </button>
      </Tooltip>
      <Tooltip title="More Options" arrow>
        <button type="button" className="controls__btn disabled">
          <MoreVertIcon />
        </button>
      </Tooltip>
      <Tooltip title="Leave Meet" arrow>
        <button className="controls__btn-call" onClick={handleLeaveMeet}>
          <CallEndIcon />
        </button>
      </Tooltip>
    </div>
  );
};

export default Controls;
