import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

const base = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  width: "fit-content",
  padding: "5px 9px",
  borderRadius: 8,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
  whiteSpace: "nowrap",
});

export const tone = styleVariants({
  brand: [
    base,
    {
      background: vars.color.brandSoft,
      color: vars.color.brandHover,
    },
  ],
  danger: [
    base,
    {
      background: vars.color.dangerSoft,
      color: vars.color.danger,
    },
  ],
  warning: [
    base,
    {
      background: vars.color.warningSoft,
      color: vars.color.warning,
    },
  ],
});
