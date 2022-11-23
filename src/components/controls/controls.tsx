import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

import { StopStreams } from "../../utils/helpers";
import Tooltip from "@mui/material/Tooltip";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import ClosedCaptionOffIcon from "@mui/icons-material/ClosedCaptionOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CallEndIcon from "@mui/icons-material/CallEnd";

import { ReactComponent as VideoCamOnIcon } from "../../assets/icons/videoCamOn.svg";
import { ReactComponent as VideoCamOffIcon } from "../../assets/icons/videoCamOff.svg";


import {
  // setMainStream,
  updateCurrentUserSettings,
  // setCurrentUser,
} from "../../reduxtoolkit/features/user/userSlice";

import "./controls.styles.scss";
// import { closeStreams } from "../../reduxtoolkit/features/user/userSlice";
interface ControlsInterface {
  socket: Socket;
  handleShareScreen:Function;
}
const Controls: React.FC<ControlsInterface> = ({ socket,handleShareScreen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const settings = useSelector((state: any) => state.user.currentUser.settings);
  const meet = useSelector((state: any) => state.user.leaveMeetDetails);
  const stream = useSelector((state: any) => state.user.mainStream);
  const [voice, setVoice] = useState(settings.voice || false);
  const [cam, setCam] = useState(settings.cam || true);
  const [loadingShareStream, setLoadingShareStream] = useState(false);
  const [screen, setScreen] = useState(false);
  const [caption, setCaption] = useState(settings.caption || false);

  const handleVoiceClick = (voice: boolean) => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = voice;
      dispatch (updateCurrentUserSettings({...settings, voice: voice }));
    }
  };

  const handleShare = async () => {
    await handleShareScreen();
  }

  const handleCamClick = (cam: boolean) => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = cam;
      dispatch(updateCurrentUserSettings({ ...settings,cam: cam }));
    }
  };

  const handleCaptionClick = (caption: boolean) => {
    dispatch(updateCurrentUserSettings({...settings, caption: caption }));
  };

  const handleClickVoice = () => {
    handleVoiceClick(!voice);
    setVoice(!voice);
  };
  const handleClickCam = () => {
    handleCamClick(!cam);
    setCam(!cam);
  };

  const handleClickCaption = () => {
    handleCaptionClick(!caption);
    setCaption(!caption);
  };

  const handleLeaveMeet = async () => {
    const leave = window.confirm("Do you want to leave the meeting ?");
    if (leave) {
      socket.emit("leave-meeting", meet);
      const closed = await StopStreams(stream);
      if (closed) {
        navigate("/");
        window.location.reload();
      }
    }
  };

  return (
    <div className="controls">
      <Tooltip title={voice === true ? "Mute Mic" : "Unmute Mic"} arrow>
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
          className={`controls__btn ${caption ? "caption__btn" : ""}`}
          onClick={handleClickCaption}
        >
          {caption ? <ClosedCaptionOffIcon /> : <ClosedCaptionOffIcon />}
        </button>
      </Tooltip>

      <Tooltip title="Share Screen" arrow>
        <button
          type="button"
          className="controls__btn"
          onClick={handleShare}
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
