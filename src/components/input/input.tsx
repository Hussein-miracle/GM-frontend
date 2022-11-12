import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { setUserName } from "../../reduxtoolkit/features/user/userSlice";
import "./input.styles.scss";

const Input = () => {
  const dispatch = useDispatch();
  const [username,setName] = useState("");


  const handleChange = (e: any) => {
    setName(e.target.value);
  };


  const handleSubmit = () => {
    dispatch(setUserName(username));
    setName('');
  }

  return (
    <div className="input-container">
      <label htmlFor="input-name">What's your name?</label>
      <input
        className="input"
        type="text"
        value={username}
        id="input-name"
        onChange={handleChange}
      />
      <button className="input-btn" onClick={handleSubmit}>Ok</button>
    </div>
  );
};

export default Input;
