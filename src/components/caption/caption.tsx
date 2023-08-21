import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import { Tooltip } from "@mui/material";
import { speakOutLoud } from "../../utils/speech";

import "./caption.styles.scss";

// @ts-ignore
const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";



const Caption = () => {
  const settings = useSelector(
    (state: any) => state.user.currentUser?.settings
  );
  const [listening, setListening] = useState(true);
  const username = useSelector((state: any) => state.user.currentUser?.name);

  const [translation, setTranslation] = useState("");

  const handleListen = () => {
    recognition.onstart = () => {
      console.log(
        "%c Starting to listen, speak in the microphone",
        "background-color:blue;color:#313131;padding:8px; border-radius:6px;"
      );
    };

    recognition.onresult = (event: any) => {
      const results = event.results;
      const currIndex = event.resultIndex;
      const currentResult = results[currIndex];

      const transcript = currentResult[0].transcript;

      // const transcript = Array.from(event.results)
      //   .map((result:any) => {

      //     return currentResult;

      //   })
      //   .map((result) => result.transcript)
      //   .join("");
      // console.log(transcript);
      setTranslation(transcript);
      // recognition.onerror = (event) => {
      //   console.log(event.error);
      // };
    };

    if (listening) {
      recognition.start();
      recognition.onend = () => {
        // console.log("continue..");
        // recognition.start();
      };
    } else {
      recognition.stop();
      recognition.onend = () => {
        console.log("Stopped recognition on Crecognitionk");
      };
    }
  };

  const handleSpeak = () => {
    speakOutLoud(translation);
  };

  useEffect(() => {
    // handleListen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.caption]);

  return (
    <div
      className="caption"
      style={{
        display: settings?.caption === true || false ? "block" : "none",
      }}
    >
      <Tooltip title="Click to hear the translation" arrow={true}>
        <span onClick={handleSpeak} className="caption__speak">
          <RecordVoiceOverIcon />
        </span>
      </Tooltip>

      {translation !== "" && (
        <p className="caption__text">{`${username}: ${translation}`}</p>
      )}
    </div>
  );
};

export default Caption;
