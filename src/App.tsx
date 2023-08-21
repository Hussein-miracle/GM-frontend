import React, { useEffect } from "react";
// import { useDispatch,useSelector} from "react-redux";
import { Routes, Route } from "react-router-dom";
import io from "socket.io-client";
// import {useBeforeUnload} from 'react-use';

import MainScreen from "./pages/mainscreen/mainscreen";
import Home from "./pages/home/home";
import "./App.css";
import StreamContextProvider from "./contexts/streamContext/streamContext";

// const socket = io(process.env.REACT_APP_BACKEND_PROD2_URL as string);
export const socket = io(process.env.REACT_APP_BACKEND_DEV_URL as string);
// * note: implement a notice for socket connection error
// if(!socket.emit){
//   alert('NetworkConnection error');
// }

// export const socket = io(process.env.REACT_APP_BACKEND_PROD_URL as string, { transports: ["websocket"],forceNew:true ,reconnectionAttempts: "Infinity" , });

function App() {
  let connected = false;
  // const dispatch = useDispatch();
  // const name = useSelector((state: any) => state.user.currentUser?.name)

  // useBeforeUnload(true, 'You have unsaved changes, are you sure?');

  const handleCloseTab = (e:any) => {
    e.preventDefault();
    const leave = window.confirm("Do you want to leave the meeting ?");

  }

  useEffect(() => {
    // if (connected) {
    socket.on("connect", () => {
      console.log(
        "%c Connected  to Socket Backend ⚡🛡️🛡️⚡",
        "background:yellow;color:black; padding:12px;border-radius:5px;"
      );
    });

    socket.on("connected", () => {
      console.log(
        "%c Connected  to Socket Backend ⚡..🛡️⚡",
        "background:yellow;color:black; padding:12px;border-radius:5px;"
      );
    });

    window.addEventListener('beforeunload',handleCloseTab);

    // }

    return () => {
      // window.addEventListener('beforeunload',handleCloseTab);
      // if (connected) {
        window.removeEventListener('beforeunload',handleCloseTab);
      // }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // connected = true;
    };
  }, []);

  return (
    <div className="App">
      <StreamContextProvider>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route
            path="/:meetingLink"
            element={<MainScreen socket={socket} />}
          />
        </Routes>
      </StreamContextProvider>
    </div>
  );
}

export default App;
