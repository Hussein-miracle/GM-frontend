import React, { MutableRefObject, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./meetjoiners.styles.scss";
import MeetJoiner from "../meetjoiner/meetjoiner";


const handleGrid = (usersLen: number, factor: number): number => {
  if (usersLen + 1 <= 4) {
    return usersLen;
  } else {
    const value = Math.ceil(usersLen / factor);
    return value;
  }
};


const MeetJoiners: React.FC = () => {
  const camRef = useRef<HTMLVideoElement | null>(
    null
  ) as MutableRefObject<HTMLVideoElement>;
  const meetJoiners = useSelector((state: any) => state.user.meetJoiners);
  const currentUserData = useSelector((state: any) => state.user.currentUser);

  // console.log(currentUserData)
  const stream = useSelector((state: any) => state.user.mainStream);
  const meetJoinersIds: any[] = Object.values(meetJoiners);
  // console.log(meetJoinersIds);

  // const currentUser = currentUserData ? Object.values(currentUserData)[0]    : null;
  // console.log(currentUser ,"[cur user meetjoiners component]")

  useEffect(() => {
    if (camRef.current && stream) {
      console.log(stream,'stream')
      camRef.current.srcObject = stream;
      camRef.current.muted = currentUserData.audio;
    }
  }, [currentUserData.audio, stream]);

  // const findScreenSharer = meetJoinersIds.find((element) => {
  //   const currentJoiner = meetJoiners[element];
  //   return currentJoiner.screen;
  // });

  // if (findScreenSharer) {
  //   gridCol = 1;
  //   gridRow = 2;
  // }

  const joiners = meetJoinersIds.map((meetJoiner, index) => {
    // console.log(meetJoiner, "joiner");

    return (
      <MeetJoiner
        key={meetJoiner.id}
        creator={meetJoiner.meetCreator}
        name={meetJoiner.name}
        currentUser={!true}
        stream={meetJoiner.stream}
        // curJoiner={curJoiner}
        // data={curJoiner}
        // currentIndex={index} curJoiner={null} hideVideo={false} 
        camRef={null} 
        avatar={!false} 
        // currentUser={undefined}
      />
    );
  });

  // if(currentUserData === null) return <></>;

  return (
    <div
      className="meetjoiners"
      style={{
        //@ts-ignore//
        "--grid-col": handleGrid(meetJoinersIds.length, 2),
        "--grid-row": handleGrid(meetJoinersIds.length, 3),
      }}
    >
      <MeetJoiner
        key={currentUserData.id}
        creator={currentUserData.meetCreator}
        name={currentUserData.name}
        // curJoiner={currentUser}
        // currentIndex={meetJoinersIds.length - 1}
        // hideVideo={findScreenSharer && !currentUser.screen}
        avatar ={false}
        camRef={camRef}
        // currentIndex={0}
        // curJoiner={null}
        // hideVideo={false}
        // showPhoto={false}
        stream={stream}
        currentUser={true}
      />

      {joiners}
    </div>
  );
};

export default MeetJoiners;
