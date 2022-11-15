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

interface  MeetJoinerInterface{
  loadingStream:boolean;
  setLoadingStream:Function;
}

const MeetJoiners: React.FC<MeetJoinerInterface> = ({loadingStream,setLoadingStream}) => {
  const camRef = useRef<HTMLVideoElement | null>(
    null
  ) as MutableRefObject<HTMLVideoElement>;
  const meetJoiners = useSelector((state: any) => state.user.meetJoiners);
  const currentUserData = useSelector((state: any) => state.user.currentUser);
  const stream = useSelector((state: any) => state.user.mainStream);
  const meetJoinersIds: any[] = Object.values(meetJoiners);
  // console.log(meetJoinersIds);
  // const currentUser = currentUserData ? Object.values(currentUserData)[0]    : null;
  // console.log(currentUser ,"[cur user meetjoiners component]")

  useEffect(() => {
    if (camRef.current && stream) {
      // console.log(stream, "stream");
      camRef.current.srcObject = stream;
      camRef.current.muted = currentUserData.settings.voice;

      setLoadingStream(false);
    }
  }, [currentUserData.settings.voice, stream]);



  // const findScreenSharer = meetJoinersIds.find((element) => {
  //   const currentJoiner = meetJoiners[element];
  //   return currentJoiner.screen;
  // });

  // if (findScreenSharer) {
  //   gridCol = 1;
  //   gridRow = 2;
  // }

  // const joiners = meetJoinersIds?.map((meetJoiner, index) => {
  //   // console.log(meetJoiner, "joiner");
  //   const currentJoiner = meetJoiners[meetJoiner];

  //   return (
  //     <MeetJoiner
  //       key={meetJoiner.id}
  //       creator={meetJoiner.meetCreator}
  //       currentUser={!true}
  //       currentJoiner={currentJoiner}
  //       currentIndex={index}
  //       hideCam={false}
  //       camRef={null}
  //       avatar={meetJoiner.voice}
  //     />
  //   );
  // });

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
      {/* {joiners} */}
      <MeetJoiner
        key={currentUserData.id}
        creator={currentUserData.meetCreator || false}
        currentJoiner={currentUserData}
        currentIndex={meetJoinersIds.length}
        hideCam={false}
        // hideCam={findScreenSharer && !currentUserData.settings.screen}
        load = {loadingStream}
        avatar={currentUserData.settings.cam === true ? false : true}
        camRef={camRef}
        currentUser={true}
      />

    </div>
  );
};

export default MeetJoiners;
