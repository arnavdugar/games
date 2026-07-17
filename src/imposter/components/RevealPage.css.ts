import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const results = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const mutedText = style({
  margin: 0,
  color: vars.color.muted,
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
