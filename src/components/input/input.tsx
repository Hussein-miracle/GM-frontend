import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "@mui/material";
import {
  getName,
  setUserName,
} from "../../reduxtoolkit/features/user/userSlice";
import "./input.styles.scss";

import MeetLogo from "../../assets/images/Google_Meet-Logo.svg";

const Input = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<any>(null);
  const askname = useSelector((state: any) => state.user.askName);
  const [username, setName] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const stringText = e.target.value;
    console.log({stringText});
    setName(stringText);
  };

  const handleSubmit = () => {
    dispatch(setUserName(username));
    dispatch(getName(false));
    // setName("");
  };

  // @ts-ignore
  const handleEnter = (e:MouseEvent<HTMLButtonElement>) => {
    // console.log(e.key,'key pressed');
    if (e.key === "Enter") {
      // console.log("gboriwole");
      if (username.length >= 3) {
        // console.log("omo iya how far");
        handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, []);

  return (
    <div
      className="input-wrapper"
      style={{
        display: askname ? "block" : "none",
      }}
    >
      {/* <h4>LowBudget Meet</h4> */}
      <Tooltip title="Why am i asking for your name?">
        <>
          <div
            title="Low-Budget Google Meet"
            className="home__header--logo  trans"
          >
            <img
              src={MeetLogo}
              className="home__header--logo__img"
              alt="Low-Budget Google Meet logo"
            />
            <span className="home__header--logo__title">Low-Budget Google</span>
            <span className="home__header--logo__text">Meet</span>
          </div>

          <div className="input-container">
            {/* ⚡✨ */}
            <label htmlFor="input-name">What's the voyager's<span className="" style={{
              color:'black',
              fontSize:10,
              verticalAlign:'middle',
              marginInline:2
            }}>(you)</span> name?</label>
            <input
              className="input"
              type="text"
              ref={inputRef}
              value={username}
              id="input-name"
              onChange={handleChange}
            />
            <button
              className="input-btn"
              onClick={handleSubmit}
              disabled={username.length < 3}
              style={{
                cursor:username.length < 3 ? "not-allowed" : "pointer",
                opacity: username.length < 3 ? 0.58 : 1
              }}
            >
              OK
            </button>
            <div className="hint">This is so you don't have to go through the stress of signing up or in</div>
            <div className="hint">Your name should be at least 3 letter word</div>
          </div>
        </>
      </Tooltip>
    </div>
  );
};

export default Input;
