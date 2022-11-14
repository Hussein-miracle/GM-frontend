import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import io, { Socket } from "socket.io-client";

import {
  setMainStream,
  setCurrentUser,
} from "./reduxtoolkit/features/user/userSlice";
import { MEDIA_CONTRAINTS } from "./utils/constants";

import Input from "./components/input/input";
import MainScreen from "./components/mainscreen/mainscreen";
import Home from "./components/home/home";
import "./App.css";

// import { DefaultEventsMap } from "@socket.io/component-emitter";
// import SocketConnection from './utils/socket';
const socket = io("http://localhost:8000");

function App() {
  // const [socket,setSocket] = useState(null);
  const dispatch = useDispatch();
  const name = useSelector((state: any) => state.user.currentUser.name);

  let connected = false;


  useEffect(() => {}, []);
  const init = async () => {
    // const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONTRAINTS);
    // stream.getAudioTracks()[0].enabled = false;
    // console.log(stream.getTracks(),'tracks');
    // dispatch(setMainStream(stream));
    // socket.emit('create-meet');
  };

  // useEffect(() => {
  //   if (connected) {
  //     init();
  //   }

  //   return () => {
  //     //@ts-ignore
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     connected = true;
  //   };
  // }, []);

  // useEffect(() => {
  //   if(name){
  //     console.log(name,'curr name')
  //   }
  // }, [name]);

  return (
    <div className="App">
      {/* //@ts-ignore */}
      <Routes>
        <Route path="/" element={<Home socket={socket}/>} />
        <Route path="/:id" element={<MainScreen socket={socket}/>} />
      </Routes>

      {/* <MainScreen socket={socket} /> */}
    </div>
  );
}

export default App;
