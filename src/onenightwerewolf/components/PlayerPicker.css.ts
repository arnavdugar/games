import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const choiceList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const choice = style({
  display: "flex",
  alignItems: "center",
  gap: 5,
  minHeight: 44,
  padding: 11,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  cursor: "pointer",
  fontWeight: 800,
  lineHeight: "20px",
  selectors: {
    "&:has(input:checked)": {
      borderColor: vars.color.brand,
      background: vars.color.brandSoft,
    },
    "&:focus-within": {
      boxShadow: vars.shadow.focus,
    },
    "&:has(input:disabled)": {
      cursor: "not-allowed",
      opacity: 0.65,
    },
  },
});

export const choiceName = style({
  flex: "1 1 auto",
  minWidth: 0,
  marginRight: 7,
  overflowWrap: "anywhere",
});

export const choiceStatus = style({
  flex: "0 0 auto",
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
});

export const choiceStatusIcon = style({
  flex: "0 0 20px",
  width: 20,
  color: vars.color.muted,
  fontSize: 20,
});

export const hiddenInput = style({
  position: "absolute",
  width: 1,
  height: 1,
  minHeight: 0,
  padding: 0,
  overflow: "hidden",
  border: 0,
  clipPath: "inset(50%)",
  pointerEvents: "none",
});

export const emptyNotice = style({
  margin: 0,
  padding: 12,
  borderRadius: 8,
  background: vars.color.warningSoft,
  color: vars.color.warning,
  fontSize: vars.font.size.caption,
  fontWeight: 800,
});
