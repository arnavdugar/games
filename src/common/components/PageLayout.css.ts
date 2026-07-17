import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const header = style({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 2,
  width: "100%",
  minHeight: 56,
  background: vars.color.header,
  boxShadow: vars.shadow.header,
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
});

export const headerContent = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  maxWidth: 680,
  minHeight: 56,
  marginInline: "auto",
  padding: "0 18px",
});

export const title = style({
  margin: 0,
  color: vars.color.onHeader,
  fontSize: vars.font.size.heading,
  fontWeight: 850,
});

const headerButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  padding: 10,
  border: 0,
  borderRadius: 8,
  background: "transparent",
  color: vars.color.onHeader,
  cursor: "pointer",
  textDecoration: "none",
  transition: "background .16s ease",
  selectors: {
    "&:hover:not(:disabled)": { background: vars.color.headerActionHover },
    "&:focus-visible": {
      boxShadow: "0 0 0 3px rgb(255 255 255 / 35%)",
      outline: "none",
    },
  },
});

export const leadingAction = style([
  headerButton,
  {
    position: "absolute",
    left: 18,
  },
]);

export const installButton = style([
  headerButton,
  {
    position: "absolute",
    right: 18,
  },
]);
