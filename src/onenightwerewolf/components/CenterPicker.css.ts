import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const centerGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
  gap: 8,
});

export const centerChoice = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 72,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  cursor: "pointer",
  fontWeight: 800,
  lineHeight: "20px",
  textAlign: "center",
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
