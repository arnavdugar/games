import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const playerList = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const playerCard = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 16,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
});
