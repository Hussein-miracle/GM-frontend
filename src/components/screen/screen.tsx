import React from 'react';
import "./screen.styles.scss";

interface ScreenProps{
  children: React.ReactNode | React.ReactNode[];
  // show:boolean;
}

const Screen:React.FC<ScreenProps> = ({children}:ScreenProps) => {
  return (
    <div className="screen">
      {children}
    </div>
  )
}

export default Screen;