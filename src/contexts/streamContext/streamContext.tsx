import { createContext, useState, ReactNode, useReducer } from "react";
import { UserSettings, UserSettingsActions } from "../../utils/types";
import { DEFAULT_SETTINGS } from "../../utils/constants";

type StreamContextInterface = {
  contextStream: MediaStream | null;
  setContextStream: (stream: MediaStream) => void;
  setShareScreenStream: (stream: MediaStream) => void;
  shareScreenStream: MediaStream | null;
  stopStreams: (stream: MediaStream) => void;
  settings: UserSettings;
  updateStreamSettings: (s: any) => void;
};

const initialContextState: StreamContextInterface = {
  contextStream: null,
  setContextStream: (stream: MediaStream) => {},
  shareScreenStream: null,
  setShareScreenStream: (stream: MediaStream) => void {},
  stopStreams: (stream: MediaStream) => {},
  settings: { ...DEFAULT_SETTINGS },
  updateStreamSettings:(s:StreamActionType) =>  {},
};

type Props = {
  children: JSX.Element | JSX.Element[] | ReactNode | ReactNode[];
};

export const StreamContext =
  createContext<StreamContextInterface>(initialContextState);

interface StreamActionType {
  type: UserSettingsActions;
  payload: boolean;
}

const INITIAL_SETTINGS_STATE: UserSettings = {
  ...DEFAULT_SETTINGS,
};

const settingsReducer = (
  state: UserSettings,
  action: StreamActionType
): typeof INITIAL_SETTINGS_STATE => {
  console.log(action,'action received')
  switch (action.type) {

    case UserSettingsActions.TOGGLE_PLAY_VOICE:
      return {
        ...state,
        play_voice: action.payload,
      };
    case UserSettingsActions.TOGGLE_SHOW_CAM:
      return {
        ...state,
        show_cam: action.payload,
      };
    case UserSettingsActions.TOGGLE_SHOW_CAPTION:
      return {
        ...state,
        show_caption: action.payload,
      };
    case UserSettingsActions.TOGGLE_SHARE_SCREEN:
      return {
        ...state,
        share_screen: action.payload,
      };

    default:
      return state;
  }
};

export const StreamContextProvider = ({ children }: Props) => {
  // const streamPersist = useRef();
  const [contextStream, setContextStream] = useState<MediaStream>(null!);
  const [shareScreenStream, setShareScreenStream] =
    useState<MediaStream | null>(null);
  const [settings, dispatch] = useReducer(settingsReducer, DEFAULT_SETTINGS);
  // const setMainStream = (streamData:any) =>  {
  //     setStream(streamData);
  // }


  const mutateVoice = (streamAction:boolean) => {
    contextStream.getAudioTracks()[0].enabled = streamAction;
  }
  const mutateCam = (streamAction:boolean) => {
    contextStream.getVideoTracks()[0].enabled = streamAction;
  }



  const updateStreamSettings = (payload: StreamActionType) => {

    // console.log(payload,'recedd')

    if(payload.type === UserSettingsActions.TOGGLE_PLAY_VOICE){
      mutateVoice(payload.payload)
    }

    if(payload.type === UserSettingsActions.TOGGLE_SHOW_CAM){
      mutateCam(payload.payload)
    }

    dispatch(payload);
  };

  const stopStreams = async (stream: MediaStream) => {
    try {
      stream.getAudioTracks()[0].stop();
      stream.getVideoTracks()[0].stop();
    } catch (err) {
      console.error(err);
      const error = new Error();
      error.message = "Unable to stop streams";
      // error.status = 403;
      return error;
    }

    return true;
  };
  const val: StreamContextInterface = {
    contextStream,
    setContextStream,
    shareScreenStream,
    setShareScreenStream,
    stopStreams,
    settings,
    updateStreamSettings,
  };

  return (
    <StreamContext.Provider value={val}>{children}</StreamContext.Provider>
  );
};

export default StreamContextProvider;
