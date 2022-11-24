import Alert from "@mui/material/Alert";
import AlertTitle from '@mui/material/AlertTitle';

const SuccessNotify = ({ text }: { text: string }) => {
  return <Alert style={{
    height: '3rem'
  }} severity="success" color="info">{text}</Alert>;
};
const ErrorNotify = ({ text }: { text: string }) => {
  return <Alert severity="error">{text}</Alert>;
};
const InfoNotify = ({ text }: { text: string }) => {
  return <Alert severity="info">{text}</Alert>;
};

export {SuccessNotify,ErrorNotify,InfoNotify};
