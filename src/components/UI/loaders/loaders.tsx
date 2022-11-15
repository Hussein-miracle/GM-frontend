import React from "react";
import "./loaders.styles.scss";

// @ts-ignore
const Loaders = ({ children, loading }) => {
  return (
    <div
      className="loaders"
      style={{
        display: loading ? "flex" : "none",
      }}
    >
      {children}
    </div>
  );
};

export default Loaders;

// @ts-ignore
export const Loader = ({ index }) => {
  return <span className={`loader-${index}`}></span>;
};

export const GoogleLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <div className="loader-shadow"></div>
    </div>
  );
};

export const LoadingText = () => {
  return <span className="loading-text">Loading</span>;
};

// @ts-ignore
export const JoinerLoader1 = ({ load }) => {
  return (
    <div
      className="lds-roller"
      style={{
        display: load ? "inline-block" : "none",
      }}
    >
      <div className="lds-roller__inner">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

// @ts-ignore
export const JoinerLoader2 = ({ load }) => {
  return (
    <div
      className="sharescreen-loader"
      style={{
        display: load ? "block" : "none",
      }}
    ></div>
  );
};
export const SharescreenLoader = () => {
  return <div className="sharescreen-loader"></div>;
};
