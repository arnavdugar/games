import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

const cardBase = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  padding: 14,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
});

export const card = styleVariants({
  default: [cardBase],
  eliminated: [
    cardBase,
    {
      borderColor: vars.color.dangerBorder,
      background: vars.color.dangerSoft,
    },
  ],
});

export const header = style({
  display: "flex",
  alignItems: "self-start",
  justifyContent: "space-between",
  gap: 12,
});

export const identity = style({
  flex: "1 1 auto",
  minWidth: 0,
});

export const title = style({
  display: "block",
  color: vars.color.text,
  fontWeight: 900,
  overflowWrap: "anywhere",
});

export const status = style({
  display: "block",
  marginTop: 3,
  color: vars.color.muted,
  fontWeight: 700,
});

export const voteDetails = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const voteHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  fontSize: vars.font.size.caption,
});

export const voteCount = style({
  color: vars.color.muted,
  fontWeight: 800,
});

export const voterNames = style({
  display: "block",
  color: vars.color.muted,
});
