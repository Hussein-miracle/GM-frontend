import { createContext, useState, ReactNode } from "react";

type StreamContextInterface = {
  contextStream: any | null;
  setContextStream: (stream: any) => void;
};

const initialContextState: StreamContextInterface = {
  contextStream: null,
  setContextStream: (stream) => {},
};

type Props = {
  children: JSX.Element | JSX.Element[] | ReactNode | ReactNode[];
};

export const StreamContext =
  createContext<StreamContextInterface>(initialContextState);

export  const StreamContextProvider = ({ children }: Props) => {
  const [contextStream, setContextStream] = useState<any | null>(null);
  // const setMainStream = (streamData:any) =>  {
  //     setStream(streamData);
  // }

  const val: StreamContextInterface = { contextStream, setContextStream };

  return (
    <StreamContext.Provider value={val}>{children}</StreamContext.Provider>
  );
};

export default StreamContextProvider;
