import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Navigate } from "react-router-dom";

import { Socket } from "socket.io-client";

import {
  updateCurrentUserSettings,
  // setCurrentUser,
  // getName,
} from "../../reduxtoolkit/features/user/userSlice";

import {
  setMainStream,
  setScreenStream,
  // setLeaveMeetDetails,
  setShowStream,
} from "../../reduxtoolkit/features/meet/meetSlice";

import {
  StreamContext,
  StreamContextProvider,
} from "../../contexts/streamContext/streamContext";

import Controls from "../controls/controls";
import MeetJoiners from "../meetjoiners/meetjoiners";
import {
  MEDIA_CONTRAINTS,
  ICESERVERS_1,
  ICESERVERS,
} from "../../utils/constants";
import { StopStreams } from "../../utils/helpers";
// import InputContextProvider from "../../contexts/inputcontext/inputcontext";

import "./mainscreen.styles.scss";

interface ScreenInterface {
  socket: Socket;
}

const MainScreen: React.FC<ScreenInterface> = ({ socket }) => {
  // const navigate = useNavigate();/
  const dispatch = useDispatch();
  const { setContextStream } = useContext(StreamContext);
  const { meetingId } = useParams();
  const mainStream = useSelector((state: any) => state.meet.mainStream);
  const name = useSelector((state: any) => state.user.currentUser.name);
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [loadingStream, setLoadingStream] = useState(!true);
  const [loadingShareStream, setLoadingShareStream] = useState(false);
  const settings = useSelector((state: any) => state.user.currentUser.settings);
  let connected = false;
  let forceConnected = false;

  // console.log(settings,'settings');

  const handleLoadingShareStream = (value: boolean) => {
    setLoadingShareStream(value);
  };

  const handleShareScreenEnd = () => {
    dispatch(setShowStream(false));
    dispatch(updateCurrentUserSettings({ ...settings, screen: false }));
  };
  const handleShareScreenStart = async () => {
    dispatch(setShowStream(true));
    setLoadingShareStream(true);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(
        MEDIA_CONTRAINTS
      );

      stream.getVideoTracks()[0].onended = handleShareScreenEnd;

      dispatch(setScreenStream(stream));
      dispatch(updateCurrentUserSettings({ ...settings, screen: true }));

      // setTimeout(() => {
      //   setLoadingShareStream(false);
      // }, 1500);
    } catch (e) {
      dispatch(setShowStream(false));
      console.error(e);
    }
  };

  const init = async () => {
    setLoadingStream(!false);
    const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONTRAINTS);
    stream.getAudioTracks()[0].enabled = settings.voice;
    stream.getVideoTracks()[0].enabled = settings.cam;
    setContextStream(stream);
    dispatch(setMainStream(stream));
    handlePeerConnection();
  };

  const handleOnIceCandidate = (event:RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      console.log("Sending ice candidate event", event);
      console.log("Sending ice candidate", event.candidate);

      const label = event.candidate.sdpMLineIndex;
      const id = event.candidate.sdpMid;
      const candidate = event.candidate.candidate;
      console.log(candidate, "actual candidate details");

      const candidateData = {
        type: "candidate",
        label,
        id,
        candidate,
        meetingId,
      };

      socket.emit("candidate", candidateData);
    }
  };
  const handleOnTrackEvent = () => {
    // remoteVideo.srcObject = event.streams[0];
    // remoteStream = event.streams[0];
  };
  const handleInitPeerConnection = async () => {
    //  here i create an instance of RTCPeerConnection which takes in an argument,the argument being an THE ICESERVERS we want to use;
    // const webrtcPeerConnection = new RTCPeerConnection(ICESERVERS_1);
    const webrtcPeerConnection = new RTCPeerConnection(ICESERVERS);

    // we assign a function that handles what should happen natively if there's an icecandidate event
    webrtcPeerConnection.onicecandidate = handleOnIceCandidate;

    // we assign a function that handles what should happen natively if there's a track event
    webrtcPeerConnection.ontrack = handleOnTrackEvent;

    // we add the first track to the rtcpeerConnection :-> audio
    const audioTrack = mainStream.getAudioTracks()[0];
    webrtcPeerConnection.addTrack(audioTrack, mainStream);

    // we add the second track to the rtcpeerConnection :-> video
    const videoTrack = mainStream.getVideoTracks()[0];
    webrtcPeerConnection.addTrack(videoTrack, mainStream);

    //we create an offer event which return us the sessiondescription

    const sessionDescription = await webrtcPeerConnection.createOffer();
    webrtcPeerConnection.setLocalDescription(sessionDescription);
    const offerData = {
      type: "offer",
      sdp: sessionDescription,
      meetingId,
    };

    socket.emit("offer", offerData);

    socket.on("answer", (event) => {
      const remoteDescription = new RTCSessionDescription(event);
      webrtcPeerConnection.setRemoteDescription(remoteDescription);
    });
  };

  const handleJoinPeerConnection = async (offerDetails: {
    type: any;
    sdp: any;
  }) => {
    //  here i create an instance of RTCPeerConnection which takes in an argument,the argument being an THE ICESERVERS we want to use;
    // const webrtcPeerConnection = new RTCPeerConnection(ICESERVERS_1);
    const webrtcPeerConnection = new RTCPeerConnection(ICESERVERS);

    // we assign a function that handles what should happen natively if there's an icecandidate event
    webrtcPeerConnection.onicecandidate = handleOnIceCandidate;

    // we assign a function that handles what should happen natively if there's a track event
    webrtcPeerConnection.ontrack = handleOnTrackEvent;

    // we add the first track to the rtcpeerConnection :-> audio
    const audioTrack = mainStream.getAudioTracks()[0];
    webrtcPeerConnection.addTrack(audioTrack, mainStream);

    // we add the second track to the rtcpeerConnection :-> video
    const videoTrack = mainStream.getVideoTracks()[0];
    webrtcPeerConnection.addTrack(videoTrack, mainStream);

    //we receive the remote Description
    const remoteSessionDetails = {
      type: offerDetails.type,
      sdp: offerDetails.sdp,
    };
    const remoteDescription = new RTCSessionDescription(remoteSessionDetails);

    webrtcPeerConnection.setRemoteDescription(remoteDescription);

    //we create an answer event which return us the sessiondescription

    const sessionDescription = await webrtcPeerConnection.createAnswer();
    webrtcPeerConnection.setLocalDescription(sessionDescription);
    const answerData = {
      type: "answer",
      sdp: sessionDescription,
      meetingId,
    };

    socket.emit("answer", answerData);
  };

  // socket.on("candidate", (event) => {
  //   const iceCandidateData = {
  //     sdpMLineIndex: event.label,
  //     // sdpMid:event.id,
  //     candidate: event.candidate,
  //   };
  //   const candidate = new RTCIceCandidate(iceCandidateData);

  //   // rtcPeerCo

  //   // rtcPeerConnection.addIceCandidate(candidate);
  // });

  const handlePeerConnection = () => {
    if (currentUser?.meetCreator !== true) {
      socket.emit("ready-for-peerconnection", { user: currentUser });
      socket.on("offer-created", handleJoinPeerConnection);
    } else {
      // @ts-ignore
      socket.on("ready-for-peerconnection", handleInitPeerConnection);
    }
  };

  useEffect(() => {
    // if(meetingId){
    if (connected) {
      if (name) {
        init();
      }
      setTimeout(() => {
        setLoadingStream(false);
      }, 1200);
      // console.log(mainStream, "on mount");
    }

    // }

    return () => {
      // console.log(mainStream, "on unmount");
      if (mainStream) {
        StopStreams(mainStream);
      }
      //@ts-ignore
      // eslint-disable-next-line react-hooks/exhaustive-deps
      connected = true;
    };
  }, []);

  return (
    <>
      {name === "" ? (
        <Navigate to="/" replace />
      ) : (
        <StreamContextProvider>
          <div className="mainscreen">
            <main className="mainscreen__content">
              <MeetJoiners
                loadingStream={loadingStream}
                setLoadingStream={setLoadingStream}
                handleLoadingShareStream={handleLoadingShareStream}
                loadingShareStream={loadingShareStream}
              />
            </main>
            <footer className="mainscreen__footer">
              <Controls
                socket={socket}
                handleShareScreen={handleShareScreenStart}
              />
            </footer>
          </div>
        </StreamContextProvider>
      )}
    </>
  );
};

export default MainScreen;
