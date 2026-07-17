import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const revealList = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const revealCard = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  minWidth: 0,
  padding: 14,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
});

export const revealLabel = style({
  display: "block",
  flex: "1 1 auto",
  minWidth: 0,
  overflowWrap: "anywhere",
  fontWeight: 900,
});
