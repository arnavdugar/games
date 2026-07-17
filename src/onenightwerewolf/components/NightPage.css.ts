import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const moonIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 58,
  height: 58,
  marginInline: "auto",
  borderRadius: "50%",
  background: vars.color.brandSoft,
  color: vars.color.brand,
});

export const moonIconGlyph = style({ fontSize: 32 });

export const eyebrow = style({
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
  letterSpacing: ".06em",
  textTransform: "uppercase",
});

export const actionHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
});

export const choiceList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const centerGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 8,
});

export const choice = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  color: vars.color.text,
  cursor: "pointer",
  fontWeight: 800,
});

export const selected = style({
  borderColor: vars.color.brand,
  background: vars.color.brandSoft,
  boxShadow: vars.shadow.focus,
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

export const choiceIcon = style({
  display: "inline-flex",
  color: vars.color.brand,
});

export const choiceIconGlyph = style({ fontSize: 21 });

export const modeSwitch = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
});

export const modeOption = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "8px 10px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  cursor: "pointer",
  fontSize: vars.font.size.caption,
  fontWeight: 800,
  textAlign: "center",
});

export const privateNote = style({
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  lineHeight: 1.45,
  textAlign: "center",
});

export const revealList = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const revealCard = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: 14,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
});

export const revealLabel = style({ fontWeight: 900 });
