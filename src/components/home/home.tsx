import { manageDateTime } from "../../utils/helpers";
import MeetLogo from "../../assets/images/Google_Meet-Logo.svg";
import { ReactComponent as AppIcon } from "../../assets/icons/apps.svg";
import { styled } from '@mui/material/styles';

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';

import KeyboardIcon from '@mui/icons-material/Keyboard';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import "./home.styles.scss";


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
  //@ts-ignore
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(60,64,67,.90)',
    color: '#fff',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
  },
}));

const Home = () => {
  const { time, day, dateFormat, abbr } = manageDateTime();
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

        <section className="home__header--utilities">
          <div className="time-date">
            <span>
              {time} {abbr}
            </span>{" "}
            <span className="dot"> &#183;</span>
            <span>
              {" "}
              {day}, {dateFormat}{" "}
            </span>
          </div>

          <div className="buttons">
            <Tooltip title="Support">
              <button className="btn">
                <HelpOutlineIcon />
              </button>
            </Tooltip>
            <Tooltip title="Feedback">
              <button className="btn">
                <FeedbackOutlinedIcon />
              </button>
            </Tooltip>


              <Tooltip title='Settings'>
              <button className="btn">
              <SettingsOutlinedIcon />
            </button>
              </Tooltip>
  

            <Tooltip title="Google apps">
              <button className="btn">
                <AppIcon />
              </button>
            </Tooltip>


            <HtmlTooltip  title={<div className='tooltip-code'>


              tip wit code
            </div>}>
            <button className="btn">
              <AccountCircleIcon />
            </button>

            </HtmlTooltip>

          </div>
        </section>
      </header>
    </div>
  );
};

export default Home;
