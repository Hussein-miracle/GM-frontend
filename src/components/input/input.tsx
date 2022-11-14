import { StarRateTwoTone } from "@mui/icons-material";
import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getName,
  setUserName,
} from "../../reduxtoolkit/features/user/userSlice";
import "./input.styles.scss";

import MeetLogo from "../../assets/images/Google_Meet-Logo.svg";

const Input = () => {
  const dispatch = useDispatch();
  const askname = useSelector((state:any) => state.user.askName);
  const [username, setName] = useState("");

  const handleChange = (e: any) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(setUserName(username));
    dispatch(getName(false));
    setName("");
  };

  // @ts-ignore
  const handleEnter = (e) => {
    // console.log(e.key,'key pressed');
    if(e.key === 'Enter'){

      console.log('gboriwole');
      if(username && username.length >= 3){
        console.log('omo iya how far')
        handleSubmit();
      }
    }
  }

  return (
    <div className='input-wrapper' 
    style={{
      display: askname ? 'block' : 'none'
    }}>

      {/* <h4>LowBudget Meet</h4> */}
      <div title="Low-Budget Google Meet" className="home__header--logo  trans">
          <img
            src={MeetLogo}
            className="home__header--logo__img"
            alt="Low-Budget Google Meet logo"
          />
          <span className="home__header--logo__title">Low-Budget Google</span>
          <span className="home__header--logo__text">Meet</span>
        </div>

      <div className="input-container">
        <label htmlFor="input-name">What's the name ?</label>
        <input
          className="input"
          type="text"
          onKeyDown={handleEnter}
          value={username}
          id="input-name"
          onChange={handleChange}
        />
        <button className="input-btn" onClick={handleSubmit}  disabled={!username && username.length < 3 } style={{
          cursor: !username && username.length < 3 ? 'not-allowed' : 'pointer'
        }}>
          Ok
        </button>
      </div>
    </div>
  );
};

export default Input;
