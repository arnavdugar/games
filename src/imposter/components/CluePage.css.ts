import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const characterCount = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 12,
  color: vars.color.muted,
  fontSize: vars.font.size.secondary,
  fontWeight: 700,
});

export const fieldLabel = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  color: vars.color.text,
  fontSize: vars.font.size.secondary,
  fontWeight: 800,
});

export const warningMessage = style({
  margin: 0,
  padding: "12px 14px",
  borderRadius: 8,
  background: vars.color.warningSoft,
  color: vars.color.warning,
  fontWeight: 800,
});
