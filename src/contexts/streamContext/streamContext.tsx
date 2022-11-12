import { createContext, useState,ReactNode} from "react";


type StreamContextInterface = {
  mainStream: any | null,
  setMainStream: (stream:any) => void;
}

const initialContextState:StreamContextInterface = {
    mainStream: null,
    setMainStream(stream) {
        
    }
}

type Props = {
    children:JSX.Element | JSX.Element[] | ReactNode | ReactNode[]
}

export const StreamContext = createContext<StreamContextInterface>(initialContextState);

const StreamContextProvider = ({ children }:Props) => {
  const [mainStream, setMainStream] = useState<any | null>(null);
  // const setMainStream = (streamData:any) =>  {
  //     setStream(streamData);
  // }

  const val:StreamContextInterface = {mainStream, setMainStream};

  return (
    <StreamContext.Provider value={val}>
      {children}
    </StreamContext.Provider>
  );
};

export default StreamContextProvider;
