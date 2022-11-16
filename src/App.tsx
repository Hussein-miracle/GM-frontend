import React, { useEffect, useState } from "react";
// import { useDispatch} from "react-redux";
import { Routes, Route } from "react-router-dom";
import io from "socket.io-client";

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
  // const name = useSelector((state: any) => state.user.currentUser.name);
  useEffect(() => {
    if (connected) {
      socket.on("connected", () => {
        console.log("connected  to B.E.", "background:green;color:black;");
      });
    }

    return () => {
      connected = true;
    };
  }, []);

  return (
    <div className="App">
      {/* //@ts-ignore */}
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/:id" element={<MainScreen socket={socket} />} />
      </Routes>

      {/* <MainScreen socket={socket} /> */}
    </div>
  );
}

export default App;
