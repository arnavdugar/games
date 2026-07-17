import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

const buttonBase = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: 44,
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 850,
  transition:
    "transform .16s ease, background .16s ease, border-color .16s ease",
  selectors: {
    "&:hover:not(:disabled)": { transform: "translateY(-1px)" },
  },
});

export const buttonVariants = styleVariants({
  primary: [
    buttonBase,
    {
      padding: "0 20px",
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
      padding: "0 16px",
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
