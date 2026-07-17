import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const instructionCard = style({
  padding: 14,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  color: vars.color.text,
  lineHeight: 1.5,
});

export const instructionText = style({ margin: "6px 0 0" });

export const instructionLabel = style({
  color: vars.color.brand,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
  textTransform: "uppercase",
});
