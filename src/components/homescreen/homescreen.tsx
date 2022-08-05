import React from 'react';
import "./homescreen.styles.scss";
import MeetJoiners from "../meetjoiners/meetjoiners";
const HomeScreen = () => {
  return (
    <div className="homescreen">
      <MeetJoiners/>
    </div>
  )
}

export default HomeScreen;