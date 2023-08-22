import getLink from "../assets/images/get-link.svg";
import planAhead from "../assets/images/plan-ahead.svg";
import safeMeet from "../assets/images/safe-meet.svg";
import { UserSettings } from "./types";

export const MEDIA_CONTRAINTS = {
  video: true,
  audio: true
};

export const DEFAULT_SETTINGS:UserSettings = {
  play_voice: false,
  show_cam: true,
  share_screen: false,
  show_caption: false,
}


export const ICESERVERS_1 = [
  {
    urls: [
      "stun:stun1.l.google.com:19302",
      "stun:stun2.l.google.com:19302",
      "stun:stun.l.google.com:19302",
      "stun:stun3.l.google.com:19302",
      "stun:stun4.l.google.com:19302",
      "stun:stun.services.mozilla.com",
    ],
  },
];

export const ICESERVERS = {
  iceServers: [
    {
      urls: "stun:stun.services.mozilla.com",
    },
    {
      urls: "stun:stun1.l.google.com:19302",
    },
    {
      urls: "stun:stun2.l.google.com:19302",
    },
    {
      urls: "stun:stun3.l.google.com:19302",
    },
    {
      urls: "stun:stun4.l.google.com:19302",
    },
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};


export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CarouselData = [
  {
    id: "1",
    imgUrl: getLink,
    title: "Get a link you can share",
    subtitle:
      "Click <strong>New meeting</strong> to get a link you can send to people you want to meet with",
  },
  {
    id: "2",
    imgUrl: planAhead,
    title: "Plan ahead",
    subtitle:
      "Click <strong>New meeting</strong> to schedule meetings in Google Calendar and send invites to participants",
  },
  {
    id: "3",
    imgUrl: safeMeet,
    title: "Your meeting might be safe 👀",
    subtitle:
      "No one can join a meeting unless invited or admitted by the host",
  },
];

export enum SOCKET_EVENTS{
  CREATE_MEET_LINK = 'create-meet-link',
  JOIN_MEET = 'join-meet',
  JOINED_MEET = 'joined-meet',
  CREATE_FUTURE_MEET_LINK = 'create-future-meet-link',
  FUTURE_MEET_LINK_CREATED = 'future-meet-link-created',
  MEET_LINK_CREATED = 'meet-link-created',
  LEAVE_MEET = 'leave-meet',
  UPDATE_JOINERS = 'update-joiners',


  OFFER = 'offer',
  OFFER_CREATED = 'offer-created',
  OFFER_CANDIDATE = 'offer-candidate',
  OFFER_CANDIDATE_CREATED = 'offer-candidate-created',


  CANDIDATE = 'candidate',
  CANDIDATE_CREATED = 'candidate-created',

  ANSWER = 'answer',
  ANSWER_CREATED = 'answer-created',
  ANSWER_CANDIDATE = 'answer-candidate',
  ANSWER_CANDIDATE_CREATED = 'answer-candidate-created',



  READY_FOR_PEERCONNECTION = 'ready-for-peerconnection',
  CLIENTS_READY_FOR_PEERCONNECTION = 'clients-ready-for-peerconnection',
}



export const APP_ERRORS = {
  MEDIASTREAM_ERROR:'MediaStream is unavailable,Allow camera permissions',
  MEDIASTREAM_NOT_YET_AVAILABLE:'MediaStream is NOT YET available',
}