import React, {
  MutableRefObject,
  // RefObject,
  useContext,
  useEffect,
  useRef,
  // useContext,
  // SetStateAction,
  // Dispatch,
} from "react";
import { useSelector } from "react-redux";
import { StreamContext } from "../../contexts/streamContext/streamContext";
// import Caption from "../caption/caption";
import MeetJoiner from "../meetjoiner/meetjoiner";
// import StreamScreen from "../streamscreen/streamscreen";
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
  const renderCount = useRef(0)
  const { contextStream, settings } = useContext(StreamContext);
  // let connected = false;
  const camRef = useRef<HTMLVideoElement>(
    null!
  ) as MutableRefObject<HTMLVideoElement>;
  const currentUserData = useSelector((state: any) => state.user.currentUser);
  const meetJoiners = useSelector((state: any) => state.meet.meetJoiners);

  // const stream:MediaStream = useSelector((state: any) => state.meet.mainStream);
  // const meetJoinersIds: any[] = meetJoiners.map(
  //   (item: { _id: any }) => item._id
  // );

  // console.log(meetJoinersIds);
  // const currentUser = currentUserData ? Object.values(currentUserData)[0]    : null;
  // console.log(currentUser ,"[cur user meetjoiners component]")

  // useEffect(() => {
  //   ++renderCount.current;

  //   console.log({renderCount:renderCount.current,why:'meetJoiners'})

  // },[meetJoiners])
  // useEffect(() => {
  //   ++renderCount.current;

  //   console.log({renderCount:renderCount.current,why:'contextStream'})

  // },[contextStream])

  useEffect(() => {
    // if (connected) {
    if (camRef.current && contextStream) {
      // console.log(stream, "stream");
      camRef.current.srcObject = contextStream;
      camRef.current.muted = currentUserData.settings.play_voice;
      setLoadingStream(false);
    }
    // }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // connected = true;
    };
  }, [currentUserData.settings.play_voice, setLoadingStream, contextStream]);

  // const findScreenSharer = meetJoinersIds.find((element) => {
  //   const currentJoiner = meetJoiners[element];
  //   return currentJoiner.screen;
  // });

  // if (findScreenSharer) {
  //   gridCol = 1;
  //   gridRow = 2;
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, array-callback-return
  const joiners = meetJoiners.length <= 0  ? null : meetJoiners.map((meetJoiner: any, index: number) => {
    const currentJoiner = meetJoiner;
    console.log(currentJoiner._id,`currJoiner --- ${index}`)

    if (currentJoiner._id !== currentUserData._id) {
      const pc = currentJoiner?.peerConnection;
      const remoteStream = new MediaStream();
      if (pc) {
        pc.ontrack = (event:any) => {
          event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
            remoteStream.addTrack(track);
          });
          
          const joinerVid = document.querySelector(`#meetJoinerCam--${index}`) as HTMLVideoElement;
          
          if (joinerVid){
            console.log(joinerVid,'joinerVid')
            joinerVid.srcObject = remoteStream;
          }
            
        };
      }

      return (
        <MeetJoiner
          key={currentJoiner._id}
          creator={meetJoiner.meetCreator || false}
          currentUser={false}
          load={false}
          currentJoiner={meetJoiner}
          currentIndex={index}
          hideCam={currentJoiner.settings.share_screen === true}
          camRef={null}
          avatar={currentJoiner.settings.show_cam === true ? false : true}
          voice={currentJoiner.settings.play_voice === true ? !false : !true}
        />
      );
    } else {
      return null;
    }
  });

  console.log(joiners,'joiners')

  // if(currentUserData === null) return <></>;

  return (
    <div className="meet-wrapper">
      {/* //@ts-ignore */}
      {/* <StreamScreen
        handleLoadingShareStream={handleLoadingShareStream}
        loadingShareStream={loadingShareStream}
      /> */}
      <div
        className="meetjoiners"
        style={{
          //@ts-ignore
          "--grid-col": handleGrid(
            meetJoiners.length > 0 ? meetJoiners.length : 2,
            2
          ),
          "--grid-row": handleGrid(
            meetJoiners.length > 0 ? meetJoiners.length : 2,
            3
          ),
          // position:  ? 'absolute' : 'relative'
        }}
      >
        {joiners}
        <MeetJoiner
          key={currentUserData._id ?? meetJoiners.length+1}
          creator={currentUserData.meetCreator || false}
          currentJoiner={currentUserData}
          currentIndex={meetJoiners.length}
          hideCam={settings.share_screen === true}
          // hideCam={findScreenSharer && !settings.screen}
          load={loadingStream}
          avatar={settings.show_cam === true ? false : true}
          voice={settings.play_voice === true ? !false : !true}
          camRef={camRef}
          currentUser={true}
        />
      </div>

      {/* <Caption /> */}
    </div>
  );
};

export default MeetJoiners;
