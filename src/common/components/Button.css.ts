import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

const buttonBase = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "11px 20px",
  border: "1px solid transparent",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 850,
  lineHeight: "20px",
  transition: "background .16s ease, border-color .16s ease",
});

export const buttonVariants = styleVariants({
  primary: [
    buttonBase,
    {
      background: vars.color.brand,
      color: vars.color.onBrand,
      selectors: {
        "&:hover:not(:disabled)": { background: vars.color.brandHover },
      },
    },
  ],
  secondary: [
    buttonBase,
    {
      border: `1px solid ${vars.color.border}`,
      background: vars.color.surfaceAlt,
      color: vars.color.text,
      selectors: {
        "&:hover:not(:disabled)": {
          borderColor: vars.color.muted,
        },
      },
    },
  ],
});
