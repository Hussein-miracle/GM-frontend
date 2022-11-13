import { days } from "./constants";
export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`; 

export const randColor = () =>  {
  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}


export const manageDateTime = () => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const abbr =  new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
  const dateOptions = {
    timeZone: zone,
    hour: "numeric",
    minute: "numeric",
  };
  const date = new Date();
  let day: string | number = date.getDay();
  day = days[day];

  // full, long, medium, short
  let dateFormat: string | string[] = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date)
  dateFormat = dateFormat.split(',')[0];
  dateFormat = dateFormat.split(' ')
  dateFormat = dateFormat.slice(0,2)
  dateFormat = dateFormat.join(' ');

  // @ts-ignore
  const formatter = new Intl.DateTimeFormat([], dateOptions);
  const time = formatter.format(date);




  return {
    time,
    day,
    dateFormat,
    abbr,

  }
}