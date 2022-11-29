import React, { useEffect, useRef, MutableRefObject } from "react";
import { useSelector } from "react-redux";

import Loaders, { GoogleLoader } from "../UI/loaders/loaders";

import "./streamscreen.styles.scss";

interface ScreenInterface {
  handleLoadingShareStream: any;
  loadingShareStream: boolean;
}

const StreamScreen: React.FC<ScreenInterface> = ({
  handleLoadingShareStream,
  loadingShareStream,
}) => {
  const screenStream = useSelector((state: any) => state.meet.screenStream);
  const showStream = useSelector((state: any) => state.meet.showStream);
  const shareRef = useRef<HTMLVideoElement | null>(
    null
  ) as MutableRefObject<HTMLVideoElement>;

  useEffect(() => {
    if (screenStream && shareRef.current) {
      shareRef.current.srcObject = screenStream;
      setTimeout(() => {
        handleLoadingShareStream(false);
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenStream]);

  return (
    <div
      className="streamscreen"
      style={{
        display: showStream === true ? "block" : "none",
      }}
    >
      {loadingShareStream || true ? (
        <Loaders loading={loadingShareStream}>
          <GoogleLoader />
        </Loaders>
      ) : null}
      <video
        autoPlay
        playsInline
        ref={shareRef}
        className="vid"
        style={{
          display: loadingShareStream ? "none" : "block",
        }}
      ></video>
    </div>
  );
};

export default StreamScreen;
