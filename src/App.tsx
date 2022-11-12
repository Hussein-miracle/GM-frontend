import React, {  useEffect } from "react";
import { useSelector } from "react-redux";
import Input from "./components/input/input";
import MainScreen from "./components/mainscreen/mainscreen";
import Home from "./components/home/home";
import "./App.css";

function App() {
  const  name  = useSelector((state:any) => state.user.currentUser.name);


  useEffect(() => {
    if(name){
      console.log(name,'curr name')
    }
  }, [name]);

  return (
    <div className="App">
      {/* {name === "" && <Input />}

      {name && <MainScreen/>} */}

      <Home/>
    </div>
  );
}

export default App;
