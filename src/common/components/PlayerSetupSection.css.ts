import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const section = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minWidth: 0,
  gap: 12,
});

export const sectionHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  color: vars.color.muted,
  fontSize: vars.font.size.secondary,
  fontWeight: 700,
});

export const sectionTitle = style({
  margin: 0,
  color: vars.color.text,
  fontSize: vars.font.size.secondary,
  fontWeight: 800,
});

export const description = style({
  margin: 0,
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
});

export const playerList = style({
  display: "grid",
  gridTemplateColumns: "28px minmax(0, 1fr) 44px",
  gap: 8,
});

export const playerRow = style({
  display: "grid",
  gridColumn: "1 / -1",
  gridTemplateColumns: "subgrid",
  height: 44,
  alignItems: "stretch",
});

export const playerNumber = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  background: vars.color.brandSoft,
  color: vars.color.brandHover,
  fontWeight: 800,
});

export const removeButton = style({
  padding: 0,
  color: vars.color.muted,
});
