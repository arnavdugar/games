import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const options = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const option = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  padding: "12px 14px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  color: vars.color.text,
  cursor: "pointer",
});

export const selected = style({
  borderColor: vars.color.brand,
  background: vars.color.brandSoft,
  color: vars.color.brandHover,
  boxShadow: vars.shadow.focus,
});

export const disabled = style({
  cursor: "not-allowed",
  opacity: 0.5,
});

export const hiddenRadio = style({
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

export const optionName = style({ fontWeight: 900 });
