import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const sunIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 58,
  height: 58,
  borderRadius: "50%",
  background: vars.color.warningSoft,
  color: vars.color.warning,
});

export const sunIconGlyph = style({ fontSize: 32 });

export const playerCloud = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
});

export const playerChip = style({
  padding: "7px 11px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 999,
  background: vars.color.surfaceAlt,
  fontSize: vars.font.size.caption,
  fontWeight: 800,
});
