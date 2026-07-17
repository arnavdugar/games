import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

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
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const outcomeLine = style({
  display: "block",
});

export const artifactLine = style({
  display: "block",
  marginTop: 5,
  color: vars.color.warning,
});

export const protectedLine = style({
  display: "block",
  marginTop: 5,
  color: vars.color.brand,
  fontWeight: 800,
});

export const centerGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
  gap: 8,
  margin: 0,
  padding: 0,
  listStyle: "none",
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
