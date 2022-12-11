import React from "react";

export const initCaption = (restartSelf = true) => {
  // @ts-ignore
  const SpeechRecognition =
    // @ts-ignore
    window?.SpeechRecognition || window?.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onstart = function (event: any) {
    console.log(
      "%c Starting to listen, speak in the microphone",
      "background-color:blue;color:#313131;padding:8px; border-radius:6px;"
    );
  };

  recognition.onresult = function (event: any) {
    // console.log('voice onresult event',event);
    // ? event is a SpeechRecognitionEvent object.
    // * It holds all the lines we have captured so far.
    // * We only need the current one.
    const current = event.resultIndex;

    // * Get a transcript of what was said.
    const transcript = event.results[current][0].transcript;
    // const confidence = event.results[current][0].confidence;

    // * Add the current transcript to the contents of our Note.
  };

  recognition.onspeechend = () => {
    console.log(
      "%c Stopped listening for speech",
      "background-color:blue;color:#313131;padding:8px; border-radius:6px;"
    );

    recognition.stop();

    if (restartSelf) {
      setTimeout(() => {
        recognition.start();
      }, 250);
    }
  };

  recognition.start();
};

export const speakOutLoud = async (message: string) => {
  const speech = new SpeechSynthesisUtterance();
  const voices = await window.speechSynthesis.getVoices();

  // femalevoice
  const femalevoice = voices[2];
  // console.log(femalevoice)
  const malevoice = voices[1];

  // Set the text and voice attributes.
  speech.voice = femalevoice;
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
};
