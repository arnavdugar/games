import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const sunIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 58,
  height: 58,
  alignSelf: "center",
  borderRadius: "50%",
  background: vars.color.warningSoft,
  color: vars.color.warning,
});

export const sunIconGlyph = style({ fontSize: 32 });

export const playerList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const playerCard = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
  padding: 12,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
});

export const playerName = style({
  color: vars.color.text,
  fontSize: vars.font.size.emphasis,
});

export const publicDetails = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flexWrap: "wrap",
  gap: 8,
  marginLeft: "auto",
});

export const markerIcon = style({
  flexShrink: 0,
  fontSize: 20,
});

export const marker = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px 8px",
  borderRadius: 8,
  background: vars.color.brandSoft,
  color: vars.color.brand,
  fontSize: vars.font.size.caption,
  fontWeight: 800,
});
