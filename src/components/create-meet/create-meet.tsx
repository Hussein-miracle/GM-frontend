import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LinkIcon from "@mui/icons-material/Link";


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


export default CreateMeet;