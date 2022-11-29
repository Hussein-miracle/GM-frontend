import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  setCurrentUser,
  getName,
} from "../../reduxtoolkit/features/user/userSlice";
import { setLeaveMeetDetails } from "../../reduxtoolkit/features/meet/meetSlice";

import { manageDateTime } from "../../utils/helpers";

import MeetLogo from "../../assets/images/Google_Meet-Logo.svg";
import { ReactComponent as AppIcon } from "../../assets/icons/apps.svg";

import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import KeyboardIcon from "@mui/icons-material/Keyboard";

import Carousel from "../carousel/carousel";
import Input from "../input/input";
import { SuccessNotify } from "../UI/notification/notification";
import Loaders, { Loader, LoadingText } from "../UI/loaders/loaders";

import "./home.styles.scss";
interface HomeInterface {
  socket: Socket;
}

// @ts-ignore
const CreateMeet = ({show,close,socket,handleInstant,clickedFuture,mouseLeave}) => {
  const clickedInstant = () => {
    close();
    handleInstant();
  };

  const handleFutureLink = () => {
    close();
    clickedFuture();
  };

  return (
    <ul
      className="create-meet"
      onMouseLeave={mouseLeave}
      style={{
        display: show ? "flex" : "none",
      }}
    >
      {/* // eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
      <li onClick={handleFutureLink}>
        <LinkIcon />
        <span>Create a meeting for later</span>
      </li>
      <li onClick={clickedInstant}>
        <AddIcon />
        <span>Start an instant meeting</span>
      </li>
      <li className="disabled">
        <CalendarTodayIcon />
        <span>Schedule in Google Calendar</span>
      </li>
    </ul>
  );
};
const Home: React.FC<HomeInterface> = ({ socket }) => {
  const dispatch = useDispatch();
  const name = useSelector((state: any) => state.user.currentUser.name);
  const navigator = useNavigate();
  const ref: any = useRef();
  const [text, setText] = useState("");
  // const [disable, setDisable] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [futureLink, setShowfutureLink] = useState(false);
  const [loading, setLoading] = useState(false);

  const { time, day, dateFormat } = manageDateTime();

  const handleChange = (e: any) => {
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

  const initJoin = (data: any) => {
    socket.emit("join-meet", data);
    socket.on("joined-meet", async (result) => {
      console.log(result, "joined-meet");
      const meetData = result.meetData;
      const link = meetData.link;
      const user = result.userData;

      dispatch(setLeaveMeetDetails(meetData));
      dispatch(setCurrentUser(user));

      setLoading(false);
      navigator(`/${link}`);
    });
  };

  const handleClickJoin = async () => {
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

    const settings = {
      voice: true,
      cam: true,
      screen: false,
    };

    const joinData = {
      name,
      meetLink: linkStr,
      settings,
      meetCreator: false,
    };

    setLoading(true);

    initJoin(joinData);

    // dispatch(setLeaveMeetDetails(meetData));
    // dispatch(setCurrentUser(creator));

    // setLoading(false);
    // navigator(`/${linkStr}`);
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

    socket.emit("create-future-meet-link", data);
    socket.on("future-meet-link-created", (result) => {
      // console.log(result, "meet-link-creation result");
      const { creator, link } = result;

      setMeetLink(link);
      setShowfutureLink(true);
      // const meetData = {
      //   link,
      //   meetingId: result.currentMeetingId,
      //   creator,
      // };
    });
  };

  const handleInstantLink = () => {
    setLoading(true);
    const settings = {
      voice: false,
      cam: true,
      screen: false,
      caption: false,
    };

    const data = {
      settings,
      name,
      meetCreator: !false,
    };

    // console.log(data,'data sent to be for link')

    socket.emit("create-meet-link", data);
    socket.on("meet-link-created", (result) => {
      // console.log(result, "meet-link-creation result");
      const { creator, link } = result;

      const meetData = {
        link,
        meetingId: result.currentMeetingId,
        creator,
      };

      dispatch(setLeaveMeetDetails(meetData));
      dispatch(setCurrentUser(creator));

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
  }, [name]);

  return (
    <div className="home">
      <Input />
      <Loaders loading={loading}>
        <Loader index={1} />
        <LoadingText />
      </Loaders>
      <header className="home__header">
        <div title="Low-Budget Google Meet" className="home__header--logo">
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
                    email={"email@gmail.com"}
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
        <div className="home__main--right">
          <div className="home__main--right__title">
            Premium video meetings. Now free for everyone.
          </div>
          <div className="home__main--right__sub">
            We re-engineered the service we built for secure business meetings,
            Google Meet, to make it free and available for all.
          </div>

          <div className="home__main--right__cta">
            <CreateMeet
              show={showCreateModal}
              close={handleCloseCreateModal}
              handleInstant={handleInstantLink}
              socket={socket}
              clickedFuture={handleFutureMeetLink}
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
        <div className="home__main--left">
          <Carousel />
        </div>
      </main>
    </div>
  );
};

export default Home;

//@ts-ignore
const LinkModal = ({ showLink, link, close }) => {
  const [showAlert, setShowAlert] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(!true);
    }, 500);
  };
  return (
    <div
      className="link-modal"
      style={{
        display: showLink ? "flex" : "none",
      }}
    >
      {showAlert && <SuccessNotify text="Copied" />}
      <div className="link-header">
        <span>Here's the link to your meeting</span>
        <span className="close">
          <CloseIcon onClick={close} />
        </span>
      </div>
      <p>
        Copy this link and send it to people you want to meet with. Be sure to
        save it so you can use it later, too.
      </p>
      <div className="link-box">
        <span className="link">{link}</span>
        <span onClick={copyLink} className="copy">
          <ContentCopyIcon />
        </span>
      </div>
    </div>
  );
};
//@ts-ignore
const CustomTip = ({ text, name = "", email = "" }) => {
  return (
    <div className="tooltip-code">
      <h4>{text}</h4>
      {name !== "" ? <p>{name}</p> : null}
      {email !== "" ? <p>{email}</p> : null}
    </div>
  );
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
  //@ts-ignore
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(60,64,67,.90)",
    color: "#fff",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
  },
}));
