/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useState,
  ReactNode,
  useReducer,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { UserSettings, UserSettingsActions } from "../../utils/types";
import { DEFAULT_SETTINGS } from "../../utils/constants";

type StreamContextInterface = {
  contextStream: MediaStream | null;
  setContextStream: (stream: MediaStream) => void;
  setShareScreenStream: (stream: MediaStream) => void;
  shareScreenStream: MediaStream | null;
  stopStreams: (stream: MediaStream) => any;
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
  updateStreamSettings: (s: StreamActionType) => {},
};

type Props = {
  children: JSX.Element | JSX.Element[] | ReactNode | ReactNode[];
};

export const StreamContext =
  createContext<StreamContextInterface>(initialContextState);

type StreamActionType = {
  type: UserSettingsActions;
  payload: boolean;
};

const INITIAL_SETTINGS_STATE: UserSettings = {
  ...DEFAULT_SETTINGS,
};

const settingsReducer = (
  state: UserSettings,
  action: StreamActionType
): typeof INITIAL_SETTINGS_STATE => {
  // console.log(action,'action received')
  switch (action.type) {
    case UserSettingsActions.TOGGLE_PLAY_VOICE:
      return {
        ...state,
        play_voice: action.payload,
      };
    case UserSettingsActions.TOGGLE_SHOW_CAM:
      console.log("tged::", UserSettingsActions.TOGGLE_SHOW_CAM);

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
  const streamPersist = useRef<MediaStream>(null!);
  const { current: contextStreamPersisted } = streamPersist;
  const [contextStream, setUpdateContextStream] = useState<MediaStream | null>(
    null
  );
  const [shareScreenStream, setShareScreenStream] =
    useState<MediaStream | null>(null);
  const [settings, dispatch] = useReducer(settingsReducer, INITIAL_SETTINGS_STATE);

  const setContextStream = useCallback((stream: MediaStream) => {
    streamPersist.current = stream;
    setUpdateContextStream(stream);
  }, [contextStream]);

  const mutateVoice = useCallback(
    (streamAction: boolean) => {
      if (!contextStream) return;
      // contextStream.getAudioTracks()[0].enabled = streamAction;
    },
    [contextStream]
  );

  const mutateCam = useCallback(
    (streamAction: boolean) => {
      if (!contextStream) return;
      // contextStream.getVideoTracks()[0].enabled = streamAction;
    },
    [contextStream]
  );

  const updateStreamSettings = useCallback(
    (streamAction: StreamActionType) => {
      // console.log(payload,'recedd')

      if (streamAction.type === UserSettingsActions.TOGGLE_PLAY_VOICE) {
        mutateVoice(streamAction.payload);
      }

      if (streamAction.type === UserSettingsActions.TOGGLE_SHOW_CAM) {
        mutateCam(streamAction.payload);
      }

      dispatch(streamAction);
    },
    [dispatch]
  );

  const stopStreams = async (stream: MediaStream): Promise<Error | Boolean> => {
    try {
      stream.getAudioTracks()[0].stop();
      stream.getVideoTracks()[0].stop();
      // setContextStream(stream);
    } catch (err) {
      console.error(err);
      const error = new Error();
      error.message = "Unable to stop streams";
      // error.status = 403;
      throw error;
    }

    return true;
  };

  useEffect(() => {
    if (contextStreamPersisted) {
      setUpdateContextStream(contextStreamPersisted);
    }
  }, [contextStreamPersisted]);

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
