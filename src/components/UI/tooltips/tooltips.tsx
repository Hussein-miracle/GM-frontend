import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

//@ts-ignore
export const CustomTip = ({ text, name = "", email = "" }) => {
  return (
    <div className="tooltip-code">
      <h4>{text}</h4>
      {name !== "" ? <p>{name}</p> : null}
      {email !== "" ? <p>{email}</p> : null}
    </div>
  );
};

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
  //@ts-ignore
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(60,64,67,.90)",
    color: "#fff",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
  },
}));
