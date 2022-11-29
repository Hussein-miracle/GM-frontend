import getLink from "../assets/images/get-link.svg";
import planAhead from "../assets/images/plan-ahead.svg";
import safeMeet from "../assets/images/safe-meet.svg";

export const MEDIA_CONTRAINTS = {
  video: true,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
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
