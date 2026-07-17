import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const moonIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 58,
  height: 58,
  alignSelf: "center",
  borderRadius: "50%",
  background: vars.color.brandSoft,
  color: vars.color.brand,
});

export const moonIconGlyph = style({ fontSize: 32 });

export const selectableOption = style({
  display: "flex",
  alignItems: "center",
  minHeight: 44,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  cursor: "pointer",
  fontWeight: 800,
  lineHeight: "20px",
  selectors: {
    "&:has(input:checked)": {
      borderColor: vars.color.brand,
      background: vars.color.brandSoft,
    },
    "&:focus-within": {
      boxShadow: vars.shadow.focus,
    },
    "&:has(input:disabled)": {
      cursor: "not-allowed",
      opacity: 0.65,
    },
  },
});

export const hiddenInput = style({
  position: "absolute",
  width: 1,
  height: 1,
  minHeight: 0,
  padding: 0,
  overflow: "hidden",
  border: 0,
  clipPath: "inset(50%)",
  pointerEvents: "none",
});

export const revealSection = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const revealTitle = style({
  margin: 0,
  color: vars.color.text,
  fontSize: vars.font.size.emphasis,
});
