/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useState,
  useContext,
  // useCallback,
  useRef,
} from "react";
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
  APP_ERRORS,
  SOCKET_EVENTS,
} from "../../utils/constants";
// import { StopStreams } from "../../utils/helpers";
import { SessionDataType, UserSettings } from "../../utils/types";
// import InputContextProvider from "../../contexts/inputcontext/inputcontext";

import "./mainscreen.styles.scss";
import toast from "react-hot-toast";

interface ScreenInterface {
  socket: Socket;
}

const MainScreen = ({ socket }: ScreenInterface) => {
  const peerConnectionInited = useRef(false);
  // let connected = false;
  // const navigate = useNavigate();/
  const { meetingLink } = useParams();
  const dispatch = useDispatch();
  const {
    setContextStream,
    contextStream: mainStream,
    stopStreams,
  } = useContext(StreamContext);

  // const mainStream = useSelector((state: any) => state.meet.mainStream);
  const meetDetails = useSelector((state: any) => state.meet.leaveMeetDetails);
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
    //console.log(stream,'stream from source')
    stream.getAudioTracks()[0].enabled = settings.play_voice;
    stream.getVideoTracks()[0].enabled = settings.show_cam;
    dispatch(setMainStream(stream));
    setContextStream(stream);

    socket.on(SOCKET_EVENTS.UPDATE_JOINERS, (data) => {
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

    handlePeerConnection();

    setLoadingStream(false);
  };


  function handleOnIceCandidate(iceEvent: RTCPeerConnectionIceEvent) {
    if (iceEvent.candidate) {
      console.log({iceEvent})
      console.log("Sending ice  iceEvent", iceEvent);
      console.log("Sending ice candidate", iceEvent.candidate);

      const label = iceEvent.candidate.sdpMLineIndex;
      const id = iceEvent.candidate.sdpMid;
      // const candidateSessionData = {
      //   label,
      //   id,
      //   candidate: iceEvent.candidate.candidate,
      //   type:'candidate',
      // }

      const candidate = iceEvent.candidate.candidate;
      console.log(candidate, "actual candidate details");

      // const candidateData = {
      //   candidateSessionData,
      //   meeting: {
      //     meetingLink,
      //     ...meetDetails,
      //   },
      //   userId: currentUser._id,
      // };

      // socket.emit(SOCKET_EVENTS.CANDIDATE, candidateData);

    }
  }

  function handleOnTrackEvent(event: any) {
    if (!mainStream) {
      toast.error(APP_ERRORS.MEDIASTREAM_NOT_YET_AVAILABLE, {
        duration: 5000,
      });
      return;
    }
    // remoteVideo.srcObject = event.streams[0];
    // remoteVideoStream = event.streams[0];

    console.log(event,'handleOnTrackEvent data')
    const remoteStream =  event.streams[0];

    console.log({remoteStream},'remoteStream handleOnTrackEvent')
    // const remoteStream = new MediaStream();

    // const eventAudioStream = mainStream.getAudioTracks()[0];
    // remoteStream.addTrack(eventAudioStream);
    // const eventVideoStream = mainStream.getVideoTracks()[0];
    // remoteStream.addTrack(eventVideoStream);


    // socket.emit('c')

  }

  const handleInitPeerConnection = async function () {
    if (!mainStream) {
      console.log(
        mainStream,
        "mainStream not available handleInitPeerConnection"
      );
      toast.error(APP_ERRORS.MEDIASTREAM_NOT_YET_AVAILABLE, {
        duration: 5000,
      });
      return;
    }

    if (peerConnectionInited.current === true) {
      return;
    }
    //  here i create an instance of RTCPeerConnection which takes in an argument,the argument being an THE ICESERVERS we want to use;
    // const webrtcPeerConnection = new RTCPeerConnection(ICESERVERS_1);
    const webrtcPeerConnection = new RTCPeerConnection(ICESERVERS);
    console.log({ webrtcPeerConnection }, "offer creation init rtcpc");
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
    console.log({ sessionDescription });
    await webrtcPeerConnection.setLocalDescription(sessionDescription);

    const offerData = {
      sessionDescription,
      meeting: {
        meetingLink,
        ...meetDetails,
      },
      userId: currentUser._id,
    };

    console.log(offerData, "offer creation Data");

    socket.emit(SOCKET_EVENTS.OFFER, offerData);

    socket.on(SOCKET_EVENTS.ANSWER_CREATED, async (event:SessionDataType) => {
      const remoteDescription = new RTCSessionDescription(event.sessionDescription);
      await webrtcPeerConnection.setRemoteDescription(remoteDescription);
    });

    socket.on(SOCKET_EVENTS.CANDIDATE_CREATED, async (icecandidateEvent:any) => {
      const candidate = {
        sdpMLineIndex:icecandidateEvent.label,
        candidate:icecandidateEvent.candidate,
        sdpMid:icecandidateEvent.id,
      }

      const icecandidate = new RTCIceCandidate(candidate);

      await webrtcPeerConnection.addIceCandidate(icecandidate)
    })
  
    peerConnectionInited.current = true;
  };

  const handleJoinPeerConnection = async (offerDetails: SessionDataType) => {
    if (!mainStream) {
      console.log(
        mainStream,
        "mainStream not available handleJoinPeerConnection"
      );
      toast.error(APP_ERRORS.MEDIASTREAM_NOT_YET_AVAILABLE, {
        duration: 5000,
      });
      return;
    }

    console.log(
      `%c ${SOCKET_EVENTS.OFFER_CREATED} > INSIDE THE CALLBACK`,
      "background:black;color:white;padding:8px;border-radius:10px;"
    );
    if (peerConnectionInited.current === true) {
      return;
    }

    console.log(
      `%c ${SOCKET_EVENTS.OFFER_CREATED} > CB INITTED!!! LET'S FUCKOING GO`,
      "background:green;color:white;padding:8px;border-radius:10px;"
    );
    // const {sessionDescription:} = offerDetails;
    //  here i create an instance of RTCPeerConnection which takes in an argument,the argument being an THE ICESERVERS we want to use;
    // const webrtcPeerConnection = new RTCPeerConnection(ICESERVERS_1);
    const webrtcPeerConnection = new RTCPeerConnection(ICESERVERS);

    // // we assign a function that handles what should happen natively if there's an icecandidate event
    // webrtcPeerConnection.onicecandidate = handleOnIceCandidate;

    // // we assign a function that handles what should happen natively if there's a track event
    // webrtcPeerConnection.ontrack = handleOnTrackEvent;

    // we add the first track to the rtcpeerConnection :-> audio
    const audioTrack = mainStream.getAudioTracks()[0];
    webrtcPeerConnection.addTrack(audioTrack, mainStream);

    // we add the second track to the rtcpeerConnection :-> video
    const videoTrack = mainStream.getVideoTracks()[0];
    webrtcPeerConnection.addTrack(videoTrack, mainStream);

    //we receive the remote Description
    const remoteSessionDetails = {
      type: offerDetails.sessionDescription.type,
      sdp: offerDetails.sessionDescription.sdp,
    };
    const remoteDescription = new RTCSessionDescription(remoteSessionDetails);

    webrtcPeerConnection.setRemoteDescription(remoteDescription);

    //we create an answer event which return us the sessiondescription

    const sessionDescription = await webrtcPeerConnection.createAnswer();
    webrtcPeerConnection.setLocalDescription(sessionDescription);

    const answerData = {
      sessionDescription,
      meeting: {
        meetingLink,
        ...meetDetails,
      },
      userId: currentUser._id,
    };

    socket.emit(SOCKET_EVENTS.ANSWER, answerData);

    peerConnectionInited.current = true;
  };


  function handlePeerConnection() {
    if (currentUser?.meetCreated && currentUser.meetCreated !== meetingLink) {
      socket.emit(SOCKET_EVENTS.READY_FOR_PEERCONNECTION, {
        user: currentUser,
        meeting: {
          meetingLink,
          ...meetDetails,
        },
        userId: currentUser._id,
      });

      socket.on(SOCKET_EVENTS.OFFER_CREATED, async (offerData) => {
        console.log(
          `%c ${SOCKET_EVENTS.OFFER_CREATED} LISTENING CALLED `,
          "background:black;color:red;padding:8px;"
        );
        await handleJoinPeerConnection(offerData);
      });
    } else{
      socket.on(
        SOCKET_EVENTS.CLIENTS_READY_FOR_PEERCONNECTION,
        handleInitPeerConnection
      );
    }
  }

  useEffect(() => {
    if (mainStream?.active) {
      handlePeerConnection();
    }
  }, [mainStream]);

  useEffect(() => {
    if (name) {
      init();
    }

    return () => {
      // console.log(mainStream, "on unmount");
      if (mainStream) {
        stopStreams(mainStream);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // connected = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!name) {
    return <Navigate to="/" replace />;
  }

  if (!mainStream) {
    return null;
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
        <Controls socket={socket} handleShareScreen={handleShareScreenStart} />
      </footer>
    </div>
  );
};

export default MainScreen;
