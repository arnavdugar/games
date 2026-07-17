import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const artifactIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 58,
  height: 58,
  alignSelf: "center",
  borderRadius: "50%",
  background: vars.color.warningSoft,
  color: vars.color.warning,
});

export const artifactIconGlyph = style({ fontSize: 32 });

export const artifactCard = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 16,
  border: `1px solid ${vars.color.warning}`,
  borderRadius: 8,
  background: vars.color.warningSoft,
});

export const artifactLabel = style({
  color: vars.color.warning,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
  textTransform: "uppercase",
});

export const artifactName = style({
  margin: 0,
  color: vars.color.text,
  fontSize: vars.font.size.heading,
});

export const artifactDescription = style({
  margin: 0,
  color: vars.color.text,
});

export const overrideNote = style({
  margin: "4px 0 0",
  paddingTop: 12,
  borderTop: `1px solid ${vars.color.warning}`,
  color: vars.color.text,
  fontSize: vars.font.size.caption,
  fontWeight: 700,
});
