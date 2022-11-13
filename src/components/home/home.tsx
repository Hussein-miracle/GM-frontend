import { manageDateTime } from "../../utils/helpers";
import MeetLogo from "../../assets/images/Google_Meet-Logo.svg";
import { ReactComponent as AppIcon } from "../../assets/icons/apps.svg";
import { styled } from "@mui/material/styles";

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";

import KeyboardIcon from "@mui/icons-material/Keyboard";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./home.styles.scss";

const Home = () => {
  const { time, day, dateFormat } = manageDateTime();
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
        <div className="home__main--right">
          <div className="home__main--right__title">
            Premium video meetings. Now free for everyone.
          </div>
          <div className="home__main--right__sub">
            We re-engineered the service we built for secure business meetings,
            Google Meet, to make it free and available for all.
          </div>

          <div className="home__main--right__cta">
            <button className="btn-create">
              <VideoCallOutlinedIcon/>
              <span>New meeting</span>
            </button>
            <input className="link-input"></input>
            <button className="btn-join"></button>
          </div>


        </div>
        <div className="home__main--left"></div>
      </main>
    </div>
  );
};

export default Home;

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
