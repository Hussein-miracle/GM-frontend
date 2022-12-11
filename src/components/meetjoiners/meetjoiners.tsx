import React, {
  MutableRefObject,
  useEffect,
  useRef,
  // useContext,
  // SetStateAction,
  // Dispatch,
} from "react";
import { useSelector } from "react-redux";
// import { StreamContext } from "../../contexts/streamContext/streamContext";
import Caption from "../caption/caption";
import MeetJoiner from "../meetjoiner/meetjoiner";
import StreamScreen from "../streamscreen/streamscreen";
import "./meetjoiners.styles.scss";

const handleGrid = (usersLen: number, factor: number): number => {
  if (usersLen + 1 <= 4) {
    return usersLen;
  } else {
    const value = Math.ceil(usersLen / factor);
    return value;
  }
};

interface MeetJoinerInterface {
  loadingStream: boolean;
  handleLoadingShareStream: any;
  setLoadingStream: any;
  loadingShareStream: boolean;
}

const MeetJoiners = ({
  loadingStream,
  setLoadingStream,
  handleLoadingShareStream,
  loadingShareStream,
}: MeetJoinerInterface) => {
  const camRef = useRef<HTMLVideoElement | null>(
    null
  ) as MutableRefObject<HTMLVideoElement>;
  const currentUserData = useSelector((state: any) => state.user.currentUser);
  const stream = useSelector((state: any) => state.meet.mainStream);

  const meetJoiners = useSelector((state: any) => state.meet.meetJoiners);

  const meetJoinersIds: any[] = meetJoiners?.map(
    (item: { _id: any }) => item._id
  );

  // console.log(meetJoinersIds);
  // const currentUser = currentUserData ? Object.values(currentUserData)[0]    : null;
  // console.log(currentUser ,"[cur user meetjoiners component]")

  useEffect(() => {
    // if (connected) {

    if (camRef.current && stream) {
      // console.log(stream, "stream");
      camRef.current.srcObject = stream;
      camRef.current.muted = currentUserData?.settings?.voice || true;
      setLoadingStream(false);
    }

    // }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
    //@ts-ignore
  }, [currentUserData.settings.voice, stream]);

  // const findScreenSharer = meetJoinersIds.find((element) => {
  //   const currentJoiner = meetJoiners[element];
  //   return currentJoiner.screen;
  // });

  // if (findScreenSharer) {
  //   gridCol = 1;
  //   gridRow = 2;
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const joiners = meetJoiners?.map((meetJoiner: any, index: number | null) => {
    const currentJoiner = meetJoiner;

    if(currentJoiner._id !== currentUserData._id){
      return (
        <MeetJoiner
          key={meetJoiner._id}
          creator={meetJoiner.meetCreator || false}
          currentUser={false}
          load={false}
          currentJoiner={meetJoiner}
          currentIndex={index}
          hideCam={false}
          camRef={null}
          avatar={currentJoiner.settings.cam === true ? false : true}
        />
      );
    }

  });

  // if(currentUserData === null) return <></>;

  return (
    <div className="meet-wrapper">
      {/* //@ts-ignore */}
      <StreamScreen
        handleLoadingShareStream={handleLoadingShareStream}
        loadingShareStream={loadingShareStream}
      />
      <div
        className="meetjoiners"
        style={{
          //@ts-ignore
          "--grid-col": handleGrid(
            meetJoinersIds.length > 0 ? meetJoinersIds.length : 2,
            2
          ),
          "--grid-row": handleGrid(
            meetJoinersIds.length > 0 ? meetJoinersIds.length : 2,
            3
          ),
          // position:  ? 'absolute' : 'relative'
        }}
      >
        {joiners}
        <MeetJoiner
          key={currentUserData._id}
          creator={currentUserData.meetCreator || false}
          currentJoiner={currentUserData}
          currentIndex={meetJoiners.length}
          hideCam={currentUserData.settings.screen === true}
          // hideCam={findScreenSharer && !currentUserData.settings.screen}
          load={loadingStream}
          avatar={currentUserData.settings.cam === true ? false : true}
          camRef={camRef}
          currentUser={true}
        />
      </div>

      <Caption />
    </div>
  );
};

export default MeetJoiners;
