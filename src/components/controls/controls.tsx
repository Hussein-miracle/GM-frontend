import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import Tooltip from "@mui/material/Tooltip";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import PanToolIcon from "@mui/icons-material/PanTool";
import ClosedCaptionOffIcon from "@mui/icons-material/ClosedCaptionOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CallEndIcon from "@mui/icons-material/CallEnd";

import { ReactComponent as VideoCamOnIcon } from "../../assets/icons/videoCamOn.svg";
import { ReactComponent as VideoCamOffIcon } from "../../assets/icons/videoCamOff.svg";

import {
  getName,
  // setMainStream,
  // updateCurrentUserSettings,
  // setCurrentUser,
} from "../../reduxtoolkit/features/user/userSlice";

import { UserSettings, UserSettingsActions } from "../../utils/types";
import { StreamContext } from "../../contexts/streamContext/streamContext";
// import { closeStreams } from "../../reduxtoolkit/features/user/userSlice";
import "./controls.styles.scss";
interface ControlsInterface {
  socket: Socket;
  handleShareScreen: Function;
}

const Controls = ({ socket, handleShareScreen }: ControlsInterface) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    contextStream: stream,
    updateStreamSettings,
    settings: {
      play_voice: voice,
      show_cam: cam,
      show_caption: caption,
      share_screen: screen,
    },
    // settings: streamSettings,
    stopStreams,
  } = useContext(StreamContext);
  // const {
  //   play_voice: voice,
  //   show_cam: cam,
  //   show_caption: caption,
  //   share_screen: screen,
  // } = streamSettings;
  // const currentUser = useSelector((state: any) => state.user.currentUser);
  const settings: UserSettings = useSelector(
    (state: any) => state.user.currentUser.settings
  );
  const meet = useSelector((state: any) => state.meet.leaveMeetDetails);
  // const [loadingShareStream, setLoadingShareStream] = useState(false);

  const handleShare = async () => {
    await handleShareScreen();
    updateStreamSettings({
      type: UserSettingsActions.TOGGLE_SHARE_SCREEN,
      payload: !screen,
    });
  };

  const handleClickVoice = () => {
    // console.log('VOICE CLICK')
    if (stream?.active) {
      // console.log("VOICE CLICK active");
      updateStreamSettings({
        type: UserSettingsActions.TOGGLE_PLAY_VOICE,
        payload: !voice,
      });
      // dispatch(updateCurrentUserSettings({play_voice: !voice }));
      // stream.getAudioTracks()[0].enabled = settings.play_voice;
      // setVoice(settings.play_voice)
    }
  };

  const handleClickCam = () => {
    if (stream) {
      // console.log(stream, "stream in cam click");
      // dispatch(updateCurrentUserSettings({show_cam: !cam }));
      stream.getVideoTracks()[0].enabled = !cam;
      updateStreamSettings({
        type: UserSettingsActions.TOGGLE_SHOW_CAM,
        payload: !cam,
      });
    }
  };

  const handleClickCaption = () => {
    // dispatch(updateCurrentUserSettings({ ...settings, show_caption: !caption }));
    updateStreamSettings({
      type: UserSettingsActions.TOGGLE_SHOW_CAPTION,
      payload: !caption,
    });
  };

  const handleLeaveMeet = async () => {
    const leave = window.confirm("Do you want to leave the meeting ?");
    if (leave) {
      const closed = await stopStreams(stream!);
      socket.emit("leave-meeting", meet);
      if (closed === true) {
        navigate("/");
        // window.location.reload();
        dispatch(getName(true));
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
      <Tooltip title={settings.show_cam ? "Close Cam" : "Open Cam"} arrow>
        <button
          className={`controls__btn ${cam === false ? "off" : ""}`}
          onClick={handleClickCam}
        >
          {cam === true ? <VideoCamOnIcon /> : <VideoCamOffIcon />}
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

      <Tooltip title="👋 Feature Coming Soon..." arrow>
        <button type="button" className="controls__btn">
          <PanToolIcon />
        </button>
      </Tooltip>
      <Tooltip title="Share Screen" arrow>
        <button
          type="button"
          className={`controls__btn ${screen ? "caption__btn" : ""}`}
          onClick={handleShare}
          disabled={settings.share_screen}
        >
          <PresentToAllIcon />
        </button>
      </Tooltip>
      <Tooltip title="👋 Feature Coming Soon..." arrow>
        <button type="button" className="controls__btn">
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
