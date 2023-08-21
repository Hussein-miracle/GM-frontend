import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";

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
  updateMeetingJoiners,
  setShowStream,
} from "../../reduxtoolkit/features/meet/meetSlice";

import {
  StreamContext,
  // StreamContextProvider,
} from "../../contexts/streamContext/streamContext";

import Controls from "../../components/controls/controls";
import MeetJoiners from "../../components/meetjoiners/meetjoiners";
import {
  MEDIA_CONTRAINTS,
  // ICESERVERS_1,
  ICESERVERS,
} from "../../utils/constants";
import { StopStreams } from "../../utils/helpers";
import { UserSettings } from "../../utils/types";
// import InputContextProvider from "../../contexts/inputcontext/inputcontext";

import "./mainscreen.styles.scss";


interface ScreenInterface {
  socket: Socket;
}

const MainScreen = ({ socket }: ScreenInterface) => {
  // let connected = false;
  // const navigate = useNavigate();/
  const { meetingLink } = useParams();
  const dispatch = useDispatch();
  const { setContextStream } = useContext(StreamContext);

  const mainStream = useSelector((state: any) => state.meet.mainStream);
  // const meetDetails = useSelector((state: any) => state.meet.leaveMeetDetails);
  const name = useSelector((state: any) => state.user.currentUser.name);
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const [loadingStream, setLoadingStream] = useState(!true);
  const [loadingShareStream, setLoadingShareStream] = useState(false);
  const settings: UserSettings = useSelector(
    (state: any) => state.user.currentUser.settings
  );
  // console.log(settings,'settings');

  const handleLoadingShareStream = (value: boolean) => {
    setLoadingShareStream(value);
  };

  const handleShareScreenEnd = () => {
    dispatch(setShowStream(false));
    dispatch(updateCurrentUserSettings({ ...settings, share_screen: false }));
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
      dispatch(updateCurrentUserSettings({ ...settings, share_screen: true }));
    } catch (e) {
      dispatch(setShowStream(false));
      console.error(e);
    }
  };

  const init = async () => {
    setLoadingStream(true);
    const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONTRAINTS);
    console.log(stream,'stream from source')
    stream.getAudioTracks()[0].enabled = settings.play_voice;
    stream.getVideoTracks()[0].enabled = settings.show_cam;
    dispatch(setMainStream(stream));
    setContextStream(stream);

    socket.on("update-joiners", (data) => {
      console.log("data update", data);
      const link = data.meetLink;
      // console.log('link',link);
      // console.log('link meetif',meetingId);
      // const currMeetId = data.currentMeetId;
      const joiners = data.joiners;
      if (meetingLink === link) {
        dispatch(updateMeetingJoiners(joiners));
      }
      // console.log(joiners , 'update joiners');
    });

    // handlePeerConnection();

    setLoadingStream(false);
  };

  const handleOnIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      console.log("Sending ice candidate event", event);
      console.log("Sending ice candidate", event.candidate);

      const label = event.candidate.sdpMLineIndex;
      const id = event.candidate.sdpMid;
      const candidate = event.candidate.candidate;
      console.log(candidate, "actual candidate details");

      // const candidateData = {
      //   type: "candidate",
      //   label,
      //   id,
      //   candidate,
      //   meetingId,
      // };

      // socket.emit("candidate", candidateData);

      // socket.on("candidate", (event) => {
      //   const iceCandidateData = {
      //     sdpMLineIndex: event.label,
      //     sdpMid:event.id,
      //     candidate: event.candidate,
      //   };
      //   const candidate = new RTCIceCandidate(iceCandidateData);

      // rtcPeerConnection.addIceCandidate(candidate);
      // });

      return event.candidate;
    }
  };
  const handleOnTrackEvent = (event: any) => {
    // remoteVideo.srcObject = event.streams[0];
    // remoteStream = event.streams[0];

    const remoteStream = new MediaStream();

    const eventAudioStream = mainStream.getAudioTracks()[0];
    remoteStream.addTrack(eventAudioStream);
    const eventVideoStream = mainStream.getVideoTracks()[0];
    remoteStream.addTrack(eventVideoStream);

    // const vid = document.getElementById(
    //   `meetJoinerCam--${currentIndex}`
    // );
    // if (vid) vid.srcObject = remoteStream;
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
      meetingLink,
      userId: currentUser._id,
    };

    socket.emit("offer", offerData);

    socket.on("answer", (event) => {
      const remoteDescription = new RTCSessionDescription(event);
      webrtcPeerConnection.setRemoteDescription(remoteDescription);
    });
  };

  const handleJoinPeerConnection = async (offerDetails: {
    type: RTCSdpType;
    sdp: string;
    creatorId: string;
    meetingId: string;
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
      meetingLink,
      creatorId: currentUser._id,
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
      socket.on("offer-created", async (offerData) => {
        await handleJoinPeerConnection(offerData);
      });
    } else {
      // @ts-ignore
      socket.on("ready-for-peerconnection", handleInitPeerConnection);
    }
  };

  useEffect(() => {
    if (name) {
      init();
    }


    return () => {
      // console.log(mainStream, "on unmount");
      if (mainStream) {
        StopStreams(mainStream);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // connected = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!name) {
    return <Navigate to="/" replace />;
  }

  return (

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
  );
};

export default MainScreen;
