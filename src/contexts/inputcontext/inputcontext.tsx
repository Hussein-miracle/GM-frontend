import { createContext, useState,ReactNode} from "react";


type InputContextInterface = {
  name: string;
  handleName: (txt:string) => void;
}

const initialContextState:InputContextInterface = {
    name : "",
    handleName:function(txt:string){

    }
}

type Props = {
    children:JSX.Element | JSX.Element[] | ReactNode | ReactNode[]
}

export const InputContext = createContext<InputContextInterface>(initialContextState);

const InputContextProvider = ({ children }:Props) => {
  const [name, setName] = useState<string>("");
  const handleName = (text:string) =>  {
      setName(text);
  }

  const val:InputContextInterface = {name , handleName};

  return (
    <InputContext.Provider value={val}>
      {children}
    </InputContext.Provider>
  );
};

export default InputContextProvider;
