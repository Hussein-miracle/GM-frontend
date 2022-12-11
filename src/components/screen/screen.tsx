import React from 'react';
import "./screen.styles.scss";

interface ScreenProps{
  children: React.ReactNode | React.ReactNode[] | React.ReactElement[] | React.ReactElement;
  // show:boolean;
}

const Screen = ({children}:ScreenProps) => {
  return (
    <div className="screen">
      {children}
    </div>
  )
}

export default Screen;