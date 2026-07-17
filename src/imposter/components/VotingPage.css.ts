import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const options = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const option = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 14,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  cursor: "pointer",
});

export const selected = style({
  borderColor: vars.color.brand,
  background: vars.color.brandSoft,
  boxShadow: vars.shadow.focus,
});

export const disabled = style({
  background: vars.color.surfaceAlt,
  cursor: "not-allowed",
  opacity: 0.55,
});

export const skip = style({ borderStyle: "dashed" });

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

export const skipTitle = style({ fontWeight: 900 });

export const skipDescription = style({
  color: vars.color.muted,
  overflowWrap: "anywhere",
});
