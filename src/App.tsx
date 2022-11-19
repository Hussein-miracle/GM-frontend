import React, { useEffect, useState } from "react";
// import { useDispatch} from "react-redux";
import { Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import {useBeforeUnload} from 'react-use';

import MainScreen from "./components/mainscreen/mainscreen";
import Home from "./components/home/home";
import "./App.css";
// import { DefaultEventsMap } from "@socket.io/component-emitter";
// const socket = io(process.env.REACT_APP_BACKEND_PROD_URL as string);
const socket = io(process.env.REACT_APP_BACKEND_DEV_URL as string);
// * note: implement a notice for socket connection error
// if(!socket.emit){
//   alert('NetworkConnection error');
// }

function App() {
  let connected = false;
  // const dispatch = useDispatch();
  // const name = useSelector((state: any) => state.user.currentUser.name)

  // useBeforeUnload(true, 'You have unsaved changes, are you sure?');

  const handleCloseTab = (e:any) => {
    e.preventDefault();
    const leave = window.confirm("Do you want to leave the meeting ?");
  
  }
  
  useEffect(() => {
    if (connected) {
      socket.on("connected", () => {
        console.log("%c connected  to B.E.", "background:green;color:black;");
      });
      
      window.addEventListener('beforeunload',handleCloseTab);

    }



    return () => {
      // window.addEventListener('beforeunload',handleCloseTab);
      if (connected) {
        window.removeEventListener('beforeunload',handleCloseTab);
      }
      connected = true;
    };
  }, []);

  return (
    <div className="App">
      {/* //@ts-ignore */}
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/:meetingId" element={<MainScreen socket={socket} />} />
      </Routes>

      {/* <MainScreen socket={socket} /> */}
    </div>
  );
}

export default App;
