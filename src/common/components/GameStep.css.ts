import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const step = style({
  display: "flex",
  flexDirection: "column",
  gap: 18,
  padding: 18,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surface,
  boxShadow: vars.shadow.panel,
});

export const titleRow = style({
  display: "flex",
  alignItems: "flex-end",
  flexWrap: "wrap-reverse",
  gap: 12,
});

export const title = style({
  flex: "0 0 auto",
  minWidth: 0,
  maxWidth: "100%",
  margin: 0,
  color: vars.color.text,
  fontSize: vars.font.size.display,
  overflowWrap: "anywhere",
});

export const beforeTitle = style({
  display: "flex",
  flex: "0 0 auto",
  marginLeft: "auto",
});

export const description = style({
  margin: 0,
  color: vars.color.muted,
});

export const actions = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});
