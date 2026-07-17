import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const results = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const resultCard = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 14,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
});

export const resultHeader = style({
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",
  gap: 12,
});

export const resultName = style({ fontWeight: 900 });

export const resultCount = style({
  color: vars.color.muted,
  fontWeight: 800,
});

export const imposterCard = style({
  borderColor: vars.color.dangerBorder,
  background: vars.color.dangerSoft,
  color: vars.color.danger,
});

export const voteBar = style({
  height: 10,
  maxWidth: "100%",
  borderRadius: 999,
  background: vars.color.brand,
});

globalStyle(`${imposterCard} ${voteBar}`, {
  background: vars.color.danger,
});
