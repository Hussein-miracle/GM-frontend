import React,{useRef , useEffect } from "react";
import {useSelector,useDispatch} from "react-redux";
import Controls from "../controls/controls";
import HomeScreen from "../homescreen/homescreen";

import "./home.styles.scss";
const Home:React.FC = () => {
  return (
    <div className="home">
    <main className="home__content">
        <HomeScreen/>
    </main>
    <footer className="home__footer">
        <Controls 
        // handleShareScreenClick={handleShareScreenClick}
        // handleMicClick={handleMicClick} 
        // handleCamClick={handleCamClick}

       /> 
    </footer>
</div>
  )
}

export default Home