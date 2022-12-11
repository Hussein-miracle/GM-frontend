import {useState} from 'react';
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tooltip } from '@mui/material';


import { SuccessNotify } from "../UI/notification/notification";
//@ts-ignore
const LinkModal = ({ showLink, link, close }) => {
  const [showAlert, setShowAlert] = useState(false);
  const copyLink = (e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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
        <Tooltip title='Click to copy ✨ meet link.'>
        <span onClick={copyLink} className="copy">
          <ContentCopyIcon />
        </span>
        </Tooltip>

      </div>
    </div>
  );
};

export default LinkModal;