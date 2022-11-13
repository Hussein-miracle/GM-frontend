import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  setMainStream,
  setCurrentUser,
} from "../../reduxtoolkit/features/user/userSlice";

import { manageDateTime } from "../../utils/helpers";

import MeetLogo from "../../assets/images/Google_Meet-Logo.svg";
import { ReactComponent as AppIcon } from "../../assets/icons/apps.svg";

import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import Alert from '@mui/material/Alert';
import KeyboardIcon from "@mui/icons-material/Keyboard";

import Carousel from "../carousel/carousel";
import "./home.styles.scss";
interface HomeInterface {
  socket: Socket;
}

const ColorAlerts = () => {
  return (
    <Alert severity="success" color="info">
      Copied!
    </Alert>
  );
}
// @ts-ignore
const CreateMeet = ({show,mutate}) => {
  const clicked = () => {
    mutate();
  }


  return  (
    <ul className="create-meet"
    // onMouseLeave={mutate}
    style={{
      display: show ? 'flex' : 'none'
    }}>
      
        {/* // eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
        <li className='disabled'>
          <LinkIcon/>
          {/* {icon-link} */}
          <span>Create a meeting for later</span>
        </li>
        <li  onClick={clicked}>
          <AddIcon/>
          {/* {icon-plus} */}
          <span>Start an instant meeting</span>
        </li>
        <li className='disabled'>
          <CalendarTodayIcon/>
          {/* {icon-calendar} */}
          <span>Schedule in Google Calendar</span>
        </li>
      </ul>
  )
}
const Home: React.FC<HomeInterface> = ({ socket }) => {
  const dispatch = useDispatch();
  const  name  = useSelector((state:any) => state.user.currentUser.name);

  const [text, setText] = useState("");
  const [hovered, setHovered] = useState(false);
  const [showCreateModal,setShowCreateModal] = useState(false);
  const [meetLink,setMeetLink] = useState('');
  const [sLink,setSLink] = useState(false);
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
    setSLink(!sLink)
  }

  const handleClick = () => {
    socket.emit("create-meet");
    socket.on("meet-created", (result) => {
      console.log(result, "meetlink");
      setMeetLink(result.meetingLink);
      handleLink();
      const settings = {
        voice: !true,
        share: false,
        screen: !false,
      };

      const data = {
        settings,
        name,
        meetCreator: !false,
      };

      dispatch(setCurrentUser(data));

      //@ts-ignore
      socket.emit("meet-started", data);

      // dispatch(setMainStream(stream));
    });
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    handleClick();
  }
  const handleCreateModal = () => {
    setShowCreateModal(!false);
    // handleClick();
  }
  


  return (
    <div className="home">


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

            <HtmlTooltip title={<CustomTip text={"Settings"} dr={!true} />}>
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
                title={<CustomTip text={"Google Account"} dr={true} />}
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
      <LinkModal showLink={sLink && meetLink} link={meetLink} close={handleLink}/>
        <div className="home__main--right">
          <div className="home__main--right__title">
            Premium video meetings. Now free for everyone.
          </div>
          <div className="home__main--right__sub">
            We re-engineered the service we built for secure business meetings,
            Google Meet, to make it free and available for all.
          </div>

          <div className="home__main--right__cta">
            <CreateMeet show={showCreateModal} mutate={handleCloseCreateModal}  />

            <button className="btn-create" onClick={handleCreateModal}>
              <VideoCallOutlinedIcon />
              <span>New meeting</span>
            </button>

            <label className="link-input" htmlFor="meetingLinkInput">
              <KeyboardIcon />
              <input
                id="meetingLinkInput"
                placeholder="Enter a code or link"
                onChange={handleChange}
              />
            </label>

            {/* //@ts-ignore */}
            <button
              className="btn-join"
              onClick={handleClick}
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
const LinkModal = ({showLink,link,close}) => {
  const copyLink = () => {
    navigator.clipboard.writeText(link);
  }
  return (
    <div className='link-modal'
    style={{
      display: showLink ? 'flex' : 'none'
    }}>
      <div className="link-header"><span>Here's the link to your meeting</span>
      <span className='close'><CloseIcon onClick={close}/></span>
      </div>
      <p>Copy this link and send it to people you want to meet with. Be sure to save it so you can use it later, too.</p>
      <div className="link-box">
        <span className="link">{link}</span>
        <span onClick={copyLink} className='copy'><ContentCopyIcon/></span>

      </div>
    </div>
  )
}
//@ts-ignore
const CustomTip = ({ text, dr }) => {
  return (
    <div className="tooltip-code">
      <h4>{text}</h4>
      {dr === true ? <p>Hussein Abdullahi</p> : null}
      {dr === true ? <p>miraacle64@gmail.com</p> : null}
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
