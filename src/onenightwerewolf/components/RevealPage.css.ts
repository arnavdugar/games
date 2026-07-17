import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const eyebrow = style({
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
  letterSpacing: ".06em",
  textTransform: "uppercase",
});

export const winnerRow = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
});

export const winnerChip = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 10px",
  borderRadius: 999,
  background: vars.color.warningSoft,
  color: vars.color.warning,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
});

export const trophyIcon = style({ fontSize: 18 });

export const noWinnerChip = style({
  padding: "7px 10px",
  borderRadius: 999,
  background: vars.color.surfaceAlt,
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
});

export const resultSection = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const sectionTitle = style({
  margin: 0,
  fontSize: vars.font.size.emphasis,
});

export const cardList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const playerCard = style({
  padding: 14,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
});

export const eliminatedCard = style({
  borderColor: vars.color.dangerBorder,
  background: vars.color.dangerSoft,
});

export const playerHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
});

export const playerStatus = style({
  display: "block",
  marginTop: 3,
  color: vars.color.muted,
  fontWeight: 700,
});

export const roleChange = style({
  margin: "10px 0 0",
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  lineHeight: 1.45,
});

export const voteList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const voteCard = style({
  padding: 12,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
});

export const voteHeader = style({
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
});

export const voterNames = style({
  display: "block",
  marginTop: 5,
  color: vars.color.muted,
});

export const centerGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 8,
});

export const centerCard = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
  padding: 12,
  border: `1px dashed ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  textAlign: "center",
});

export const centerLabel = style({
  color: vars.color.muted,
  fontWeight: 800,
});
