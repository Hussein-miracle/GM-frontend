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
  CREATE_FUTURE_MEET_LINK = 'create-future-meet-link',
  LEAVE_MEET = 'leave-meet',
}