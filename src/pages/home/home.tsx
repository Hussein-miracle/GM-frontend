import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";

import {
  setCurrentUser,
  getName,
} from "../../reduxtoolkit/features/user/userSlice";

import {
  setLeaveMeetDetails,
  updateMeetingJoiners,
} from "../../reduxtoolkit/features/meet/meetSlice";

import { manageDateTime } from "../../utils/helpers";
import { DEFAULT_SETTINGS, SOCKET_EVENTS } from "../../utils/constants";
import { UserSettings } from "../../utils/types";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import KeyboardIcon from "@mui/icons-material/Keyboard";

import MeetLogo from "../../assets/images/Google_Meet-Logo.svg";
import { ReactComponent as AppIcon } from "../../assets/icons/apps.svg";

import Carousel from "../../components/carousel/carousel";
import Input from "../../components/input/input";
import CreateMeet from "../../components/create-meet/create-meet";
import LinkModal from "../../components/link-modal/link-modal";
import { CustomTip, HtmlTooltip } from "../../components/UI/tooltips/tooltips";
import Loaders, {
  Loader,
  LoadingText,
} from "../../components/UI/loaders/loaders";

import "./home.styles.scss";

type HomeType = {
  socket: Socket;
};

const { time, day, dateFormat } = manageDateTime();

const Home = ({ socket }: HomeType) => {
  const dispatch = useDispatch();
  const ref: any = useRef();
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const navigator = useNavigate();
  const [text, setText] = useState("");
  const [hovered, setHovered] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [meetLink, setMeetLink] = useState<string>("");
  const [futureLink, setShowfutureLink] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  // const [disable, setDisable] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const initJoin =  useCallback(async (data: any) => {
    socket.emit(SOCKET_EVENTS.JOIN_MEET, data);

    socket.on(SOCKET_EVENTS.JOINED_MEET, async (result: any) => {
      console.log(result, "joined-meet data");
      if (result.status === 404) {
        toast.error(`${result.message}`, {
          duration: 3500,
        });

        setLoading(false);

        return;
      }
      const meetData = result.meetData;
      const link = meetData.link;
      const user = result.joiner;
      const joiners = result.participants.participants;
      toast.success(`JOINED MEET ${user.name}`, {
        duration: 1000,
      });
      // console.log(joiners , 'joiners');

      const data = {
        link,
        meetingId: result.currentMeetingId,
        creator: user,
      };

      dispatch(setCurrentUser(user));

      dispatch(updateMeetingJoiners(joiners));

      setLoading(false);
      dispatch(setLeaveMeetDetails(data));
      navigator(`/${link}`);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const handleClickJoin = useCallback(async () => {
    if(!currentUser?.name){
      dispatch(getName(true));
      return;
    } 

    let linkStr: string | string[] = "";
    const trimmedText = text.trim();
    const checkHttp =
      trimmedText.startsWith("https://") || trimmedText.startsWith("http://");
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
      name:currentUser.name,
      meetLink: linkStr,
      settings: { ...DEFAULT_SETTINGS },
      meetCreator: false,
    };

    setLoading(true);

    await initJoin(joinData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.name]);

  const handleFutureMeetLink =  useCallback(() => {
    const settings: UserSettings = {
      ...DEFAULT_SETTINGS,
    };

    const data = {
      settings,
      name:currentUser.name,
      meetCreator: true,
    };

    // console.log('meetcreationData',data);
    socket.emit(SOCKET_EVENTS.CREATE_FUTURE_MEET_LINK, data);

    socket.on(SOCKET_EVENTS.FUTURE_MEET_LINK_CREATED, (result) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleInstantLink = useCallback( async () => {
    console.log({name:currentUser.name});
    
    if(!currentUser?.name){
      dispatch(getName(true));
      return;
    } 

    setLoading(true);

    const data = {
      settings: { ...DEFAULT_SETTINGS },
      name:currentUser.name,
      meetCreator: true,
    };

    console.log(data,'data sent to be for link')

    socket.emit(SOCKET_EVENTS.CREATE_MEET_LINK, data);

    socket.on(SOCKET_EVENTS.MEET_LINK_CREATED, (result) => {
      // console.log(result, "meet-link-creation result");
      const { creator, link } = result;

      const meetData = {
        link,
        meetingId: result.currentMeetingId,
        creator,
      };

      dispatch(setLeaveMeetDetails(meetData));
      dispatch(setCurrentUser(creator));

      // const

      console.log(link, "link");

      setLoading(false);
      navigator(`/${link}`);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentUser.name])
  
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
    if (!currentUser.name && currentUser?.name.length < 3) {
      dispatch(getName(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
      <Input />
      <Loaders loading={loading}>
        <Loader index={1} />
        <LoadingText />
      </Loaders>
      <header className="home__header">
        <div
          title="Low-Budget Google Meet"
          className="home__header--logo home-logo"
        >
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
                    name={currentUser?.name ?? 'User'}
                    email={`${currentUser?.name ?? 'user'}@gmail.com?`}
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
