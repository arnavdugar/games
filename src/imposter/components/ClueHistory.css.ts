import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const playerName = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 800,
});

export const clueGrid = style({
  display: "grid",
  gridTemplateColumns: "72px minmax(0, 1fr)",
  width: "100%",
});

export const roundHeader = style({
  padding: "0 10px 6px 0",
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 800,
  textAlign: "left",
});

export const clueHeader = style({
  padding: "0 0 6px",
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 800,
  textAlign: "left",
});

export const roundNumber = style({
  padding: "8px 10px 8px 0",
  borderTop: `1px solid ${vars.color.border}`,
  color: vars.color.muted,
  fontWeight: 800,
});

export const clue = style({
  padding: "8px 0",
  borderTop: `1px solid ${vars.color.border}`,
  overflowWrap: "anywhere",
  fontSize: vars.font.size.emphasis,
  fontWeight: 800,
});
