import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";


import {
  setCurrentUser,
  getName,
} from "../../reduxtoolkit/features/user/userSlice";

import { setLeaveMeetDetails,updateMeetingJoiners } from "../../reduxtoolkit/features/meet/meetSlice";

import { manageDateTime } from "../../utils/helpers";
import { DEFAULT_SETTINGS } from "../../utils/constants";

import MeetLogo from "../../assets/images/Google_Meet-Logo.svg";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import KeyboardIcon from "@mui/icons-material/Keyboard";

import { ReactComponent as AppIcon } from "../../assets/icons/apps.svg";

import Carousel from "../carousel/carousel";
import Input from "../input/input";
import  CreateMeet from '../create-meet/create-meet';
import LinkModal from "../link-modal/link-modal";
import  {CustomTip,HtmlTooltip} from  '../UI/tooltips/tooltips';


import Loaders, { Loader, LoadingText } from "../UI/loaders/loaders";

import "./home.styles.scss";
type HomeType =  {
  socket: Socket;
}


const Home = ({ socket }:HomeType) => {
  const dispatch = useDispatch();
  const name = useSelector((state: any) => state.user.currentUser.name);
  const navigator = useNavigate();
  const ref: any = useRef();
  const [text, setText] = useState("");
  const [hovered, setHovered] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [meetLink, setMeetLink] = useState<string>("");
  const [futureLink, setShowfutureLink] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { time, day, dateFormat } = manageDateTime();
  // const [disable, setDisable] = useState(false);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
  };

  const handleMouse = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(!true);
  };

  const handleLink = () => {
    setShowfutureLink(!futureLink);
  };

  const initJoin = async (data: any) => {
    socket.emit("join-meet", data);
    socket.on("joined-meet", async (result:any) => {
      // console.log(result, "joined-meet data");
      const meetData = result.meetData;
      const link = meetData.link;
      const user = result.joiner;
      const joiners = result.participants.participants;
      // console.log(joiners , 'joiners');

      dispatch(setLeaveMeetDetails(meetData));
      dispatch(setCurrentUser(user));

      setTimeout(() => {
        dispatch(updateMeetingJoiners(joiners));
      },500)
;
      setLoading(false);
      navigator(`/${link}`);
    });
  };

  const handleClickJoin = async () => {
    let linkStr: string | string[] = "";
    const trimmedText = text.trim();
    const checkHttp = trimmedText.startsWith("https://") || trimmedText.startsWith("http://");
    if (checkHttp) {
      // console.log('workdds')
      const link = text.split("/");
      linkStr = link[link.length - 1];
      // console.log(link,'split link');
    } else {
      if (ref.current) {
        const link = String(ref.current.value).split("/");
        const urlStr = link[link.length - 1];
        // console.log(urlStr,'link 2');
        linkStr = urlStr;
      }
    }

    const joinData = {
      name,
      meetLink: linkStr,
      settings:{...DEFAULT_SETTINGS},
      meetCreator: false,
    };

    setLoading(true);

    await initJoin(joinData);

  };

  const handleFutureMeetLink = () => {
    const settings = {
      voice: false,
      cam: true,
      screen: false,
      caption: false,
    };

    const data = {
      settings,
      name,
      meetCreator: true,
    };

    // console.log('meetcreationData',data);
    socket.emit("create-future-meet-link", data);

    socket.on("future-meet-link-created", (result) => {
      console.log(result, "meet-link-creation result");
      const { link } = result;

      setMeetLink(link);
      setShowfutureLink(true);
      // const meetData = {
      //   link,
      //   meetingId: result.currentMeetingId,
      //   creator,
      // };
    });
  };

  const handleInstantLink = async () => {
    setLoading(true);

    const data = {
      settings:{...DEFAULT_SETTINGS},
      name,
      meetCreator: !false,
    };

    // console.log(data,'data sent to be for link')

    socket.emit("create-meet-link", data);
    socket.on("meet-link-created", (result) => {
      console.log(result, "meet-link-creation result");
      const { creator, link } = result;

      const meetData = {
        link,
        meetingId: result.currentMeetingId,
        creator,
      };
      
      dispatch(setLeaveMeetDetails(meetData));
      dispatch(setCurrentUser(creator));

      // const


      setLoading(false);
      navigator(`/${link}`);
    });
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };
  const handleCreateModal = () => {
    setShowCreateModal(!false);
    // handleClick();
  };

  const handleMouseLeaveCreateBTN = () => {
    setTimeout(() => {
      handleCloseCreateModal();
    }, 500);
  };

  useEffect(() => {
    if (!name) {
      dispatch(getName(true));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <div className="home">
      <Input />
      <Loaders loading={loading}>
        <Loader index={1} />
        <LoadingText />
      </Loaders>
      <header className="home__header">

        <div title="Low-Budget Google Meet" className="home__header--logo home-logo">
          <img
            src={MeetLogo}
            className="home__header--logo__img"
            alt="Low-Budget Google Meet logo"
          />

          <span className="home__header--logo__title">Low-Budget Google</span>

          <span className="home__header--logo__text">Meet</span>

        </div>

        <div className="home__header--utilities">

          <div className="time-date">
            <span>{time}</span>
            <span className="dot"> &#183;</span>
            <span>
              {" "}
              {day}, {dateFormat.split(" ").reverse().join(" ")}{" "}
            </span>
          </div>

          <div className="buttons">
            <HtmlTooltip title="Support">
              <button className="btn">
                <HelpOutlineIcon />
              </button>
            </HtmlTooltip>
            <HtmlTooltip title="Feedback">
              <button className="btn">
                <FeedbackOutlinedIcon />
              </button>
            </HtmlTooltip>

            <HtmlTooltip title={<CustomTip text={"Settings"} />}>
              <button className="btn">
                <SettingsOutlinedIcon />
              </button>
            </HtmlTooltip>

            <div className="account">
              <HtmlTooltip title="Google apps">
                <button className="btn">
                  <AppIcon />
                </button>
              </HtmlTooltip>

              {/* //@ts-ignore */}
              <HtmlTooltip
                title={
                  <CustomTip
                    text={"Google Account"}
                    name={name}
                    email={`${name}@gmail.com?`}
                  />
                }
              >
                <button className="btn">
                  <AccountCircleIcon />
                </button>
              </HtmlTooltip>
            </div>
          </div>

        </div>

      </header>

      <main className="home__main">
        <LinkModal
          showLink={futureLink && meetLink}
          link={meetLink}
          close={handleLink}
        />

        <div className="home__main--left">
          <div className="home__main--left__title">
            Premium video meetings. Now free for everyone.
          </div>
          <div className="home__main--left__sub">
            We re-engineered the service we built for secure business meetings,
            Google Meet, to make it free and available for all.
          </div>

          <div className="home__main--left__cta">
            <CreateMeet
              show={showCreateModal}
              close={handleCloseCreateModal}
              handleInstant={handleInstantLink}
              socket={socket}
              createFutureLink={handleFutureMeetLink}
              mouseLeave={handleMouseLeaveCreateBTN}
            />

            <button
              className="btn-create"
              onClick={handleCreateModal}
              disabled={showCreateModal === true ? true : false}
              style={{
                opacity: !showCreateModal ? 1 : 0.6,
              }}
            >
              <VideoCallOutlinedIcon />
              <span>New meeting</span>
            </button>

            <label className="link-input" htmlFor="meetingLinkInput">
              <KeyboardIcon />
              <input
                value={text}
                ref={ref}
                id="meetingLinkInput"
                placeholder="Enter a code or link"
                onChange={handleChange}
              />
            </label>

            {/* //@ts-ignore */}
            <button
              className="btn-join"
              onClick={handleClickJoin}
              disabled={!text ? true : false}
              style={{
                opacity: text !== "" ? 1 : 0.6,
                color:
                  text !== ""
                    ? "var(--gm-theme-color)"
                    : "var(--gm-caption-color)",
                backgroundColor:
                  text && hovered ? "var(--join-enter-color)" : "transparent",
              }}
              onMouseEnter={handleMouse}
              onMouseLeave={handleMouseLeave}
            >
              Join
            </button>
          </div>
        </div>

        <div className="home__main--right">
          <Carousel />
        </div>

      </main>
    </div>
  );
};

export default Home;

