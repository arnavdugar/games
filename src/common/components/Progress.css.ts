import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const progress = style({
  position: "sticky",
  bottom: 12,
  zIndex: 1,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 10,
  padding: 14,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surface,
  boxShadow: vars.shadow.sticky,
});

export const row = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
});

export const phaseLabel = style({
  color: vars.color.text,
  fontWeight: 900,
  textTransform: "capitalize",
});

export const detail = style({
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 800,
  textAlign: "right",
});

export const track = style({
  overflow: "hidden",
  height: 10,
  borderRadius: 5,
  background: vars.color.surfaceAlt,
});

export const fill = style({
  height: "100%",
  borderRadius: 5,
  background: vars.color.brand,
  transition: "width .18s ease",
});
